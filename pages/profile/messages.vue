<template>
  <div>
    <profile-header />
    <div class="chat-box">
      <div class="chat-app">
        <div class="user-list-box">
          <div class="user-list">
            <div
              v-for="(profile, index) in filteredProfileList"
              :key="index"
              class="user"
              @click="selectUser(profile)"
              :class="{'selected-user': profile === selectedProfile}"
            >
              {{ profile.firstName + " " + profile.lastName }}
            </div>
          </div>
        </div>
        <div class="chat-container">
          <div class="chat-header">
            <div v-if="selectedProfile">{{ selectedProfile.firstName }}</div>
            <div v-else>Select a user to chat</div>
          </div>
          <div class="chat-messages" ref="messages">
            <template v-for="(messageGroup, index) in groupedMessages" :key="index">
              <div class="message-group" v-if="messageGroup.messages.length > 0">
                <div class="message-group-header">{{ messageGroup.header }}</div>
                <div v-if="messageGroup.header === 'Sent Messages'">
                  <div
                    v-for="(message, index) in messageGroup.messages"
                    :key="index"
                    class="message sent"
                  >
                    <div class="message-content sent-content">
                      {{ message.message }}
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div
                    v-for="(message, index) in messageGroup.messages"
                    :key="index"
                    class="message received"
                  >
                    <div class="message-content received-content">
                      {{ message.message }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="chat-input">
            <input
              type="text"
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="Type your message..."
            />
            <button @click="sendMessage">Send</button>
          </div>
          <p>This sender email is: {{ senderEmail }} and profession is: {{ senderProfession }}</p>

          <p v-if="selectedProfile">You selected the user '{{ selectedProfile.firstName }}' to chat with</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from "@/firebase/config.js";
import { collection, getDocs, addDoc, Timestamp, query, where, orderBy } from "firebase/firestore";
import userState from "@/store/userState.js";

export default {
  middleware: "auth",
  data() {
    return {
      profileList: [],
      selectedProfile: null,
      messages: [],
      newMessage: "",
      senderEmail: "",
      senderProfession: "",
      senderFirstName: "",
    };
  },
  async mounted() {
    await this.fetchProfiles();
  },
  computed: {
    conversationKey() {
      if (this.selectedProfile && this.senderEmail) {
        return `${this.senderEmail}_${this.selectedProfile.email}`;
      }
      return null;
    },
    groupedMessages() {
      const grouped = [];
      const sentMessages = this.messages.filter(message => message.sentByMe);
      const receivedMessages = this.messages.filter(message => !message.sentByMe);

      if (sentMessages.length > 0) {
        grouped.push({ header: "Sent Messages", messages: sentMessages });
      }

      if (receivedMessages.length > 0) {
        grouped.push({ header: "Received Messages", messages: receivedMessages });
      }

      return grouped;
    },
    filteredProfileList() {
      if (this.senderProfession === "Coach") {
        return this.profileList.filter(profile => profile.profession === "Client");
      } else {
        return this.profileList;
      }
    },
  },
  methods: {
    async fetchProfiles() {
      try {
        const profilesSnapshot = await getDocs(collection(projectFirestore, "profile"));
        this.profileList = profilesSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        this.retrieveSenderInfo();
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    },
    selectUser(profile) {
      if (this.selectedProfile && profile.id !== this.selectedProfile.id) {
        this.newMessage = "";
      }
      this.selectedProfile = profile;
    },
    async sendMessage() {
      if (!this.selectedProfile) return;
      if (this.newMessage.trim() === "") return;
      const receiverEmail = this.selectedProfile.email;
      const senderEmail = this.senderEmail;
      const senderFirstName = this.senderFirstName;
      const timestamp = Timestamp.now();
      const conversationKey = `${senderEmail}_${receiverEmail}`;
      const inverseConversationKey = `${receiverEmail}_${senderEmail}`;

      try {
        await addDoc(collection(projectFirestore, "messages"), {
          receiverId: receiverEmail,
          senderId: senderEmail,
          senderFirstName: senderFirstName,
          message: this.newMessage,
          timestamp: timestamp,
          conversationKey: conversationKey,
          inverseConversationKey: inverseConversationKey
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }

      this.newMessage = "";
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      });
    },
    async retrieveSenderInfo() {
      try {
        const email = userState.userEmail;
        this.senderEmail = email;

        const querySnapshot = await getDocs(query(collection(projectFirestore, "profile"), where("email", "==", email)));
        querySnapshot.forEach(doc => {
          const data = doc.data();
          this.senderProfession = data.profession;
          this.senderFirstName = data.firstName;
          if (this.senderProfession === "Coach") {
            this.addClientUsers();
          }
        });
      } catch (error) {
        console.error("Error retrieving sender info:", error);
      }
    },
    async addClientUsers() {
      try {
        const clientUsersSnapshot = await getDocs(query(collection(projectFirestore, "profile"), where("profession", "==", "Client")));
        const clientUsers = clientUsersSnapshot.docs.map(doc => doc.data());
        this.profileList = clientUsers;
      } catch (error) {
        console.error("Error adding client users:", error);
      }
    },
    async fetchMessages() {
      try {
        const senderEmail = this.senderEmail;
        const receiverEmail = this.selectedProfile ? this.selectedProfile.email : null;
        if (!receiverEmail) return;

        const messagesSnapshot = await getDocs(
          query(
            collection(projectFirestore, "messages"),
            where("senderId", "==", senderEmail),
            where("receiverId", "==", receiverEmail)
          )
        );
        const receivedMessagesSnapshot = await getDocs(
          query(
            collection(projectFirestore, "messages"),
            where("senderId", "==", receiverEmail),
            where("receiverId", "==", senderEmail)
          )
        );

        const messages = messagesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            conversationKey: `${data.senderId}_${data.receiverId}`,
            inverseConversationKey: `${data.receiverId}_${data.senderId}`,
            senderId: data.senderId,
            senderFirstName: data.senderFirstName,
            message: data.message,
            timestamp: data.timestamp.toDate(),
            sentByMe: true,
          };
        });

        const receivedMessages = receivedMessagesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            conversationKey: `${data.senderId}_${data.receiverId}`,
            inverseConversationKey: `${data.receiverId}_${data.senderId}`,
            senderId: data.senderId,
            senderFirstName: data.senderFirstName,
            message: data.message,
            timestamp: data.timestamp.toDate(),
            sentByMe: false,
          };
        });

        this.messages = [...messages, ...receivedMessages];
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
  },
  watch: {
    conversationKey() {
      this.fetchMessages();
    },
  },
};
</script>



<style scoped>
/* Your existing styles */

.chat-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.chat-app {
  display: flex;
  height: 400px; 
}

.user-list-box {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ccc;
}

.user-list {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow-y: auto;
}

.user {
  padding: 8px;
  cursor: pointer;
}

.user:hover, .selected-user {
  background-color: #f0f0f0; 
}

.chat-container {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: right; /* Centering messages */
}

.message-group-header {
  font-weight: bold;
  margin-bottom: 5px;
  padding-right: 10px;
}

.message {
  margin-bottom: 10px;
  max-width: 70%;
  padding-left: 55px;
}

.sent {
  align-self: flex-end; 
}

.received {
  align-self: flex-start; 
}

.sent-content {
  color: white;
  margin-right: 50px;
  padding: 8px 12px;
  border-radius: 10px;
  background-color: rgb(105, 146, 223); /* Default background color for sent messages */
}

.received-content {
  padding: 7px 12px;
  margin-left: 20px;
  border-radius: 10px;
  background-color: #f0f0f0; /* Background color for received messages */
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #007BFF; 
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3; 
}
</style>
