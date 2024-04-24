<template>
  <div>
    <site-header/>
    <profile-header />
    <div class="chat-box">
      <BgAnimations/>
      <div class="chat-app">
        <div class="user-list-box">
          <div class="user-list">
            <div v-if="showCoachTitle" class="user-list-title">Coaches</div>
            <div
              v-for="(profile, index) in filteredProfileList('Coach')"
              :key="'coach' + index"
              class="user"
              @click="selectUser(profile)"
              :class="{ 'selected-user': profile === selectedProfile }"
            >
              <!-- SVG icon added here -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
              {{ profile.firstName + " " + profile.lastName }}
            </div>
            <div v-if="showClientTitle" class="user-list-title">Clients</div>
            <div
              v-for="(profile, index) in filteredProfileList('Client')"
              :key="'client' + index"
              class="user"
              @click="selectUser(profile)"
              :class="{ 'selected-user': profile === selectedProfile }"
            >
              <!-- SVG icon added here -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
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
            <div v-for="message in messages" :key="message.id" class="message">
              <p>
                <strong>{{ message.senderFirstName }}:</strong>
                {{ message.message }}
              </p>
            </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from "@/firebase/config.js";
import {collection,getDocs,addDoc,Timestamp,query,where,orderBy,onSnapshot} from "firebase/firestore";
import userState from "@/store/userState.js";
import { ref, onMounted } from 'vue';

export default {
  middleware: "auth",
  setup (){
    const userEmail = ref('');

    onMounted(() => {
      userEmail.value = localStorage.getItem('email') || '';
    });

    return { userEmail };
  },
  data() {
    return {
      profileList: [],
      selectedProfile: null,
      messages: [],
      newMessage: "",
      senderProfession: "",
      senderFirstName: "",
      unsubscribe: null,
    };
  },
  async mounted() {
    await this.fetchProfiles();
  },
  computed: {
    showMessages() {
      if (this.selectedProfile && this.userEmail) {
        return `${this.userEmail}_${this.selectedProfile.email}`;
      }
      return null;
    },
    showCoachTitle() {
      return this.filteredProfileList('Coach').length > 0;
    },
    showClientTitle() {
      return this.filteredProfileList('Client').length > 0;
    },
  },
  methods: {
    async fetchProfiles() {
      try {
        const profilesSnapshot = await getDocs(
          collection(projectFirestore, "profile")
        );
        this.profileList = profilesSnapshot.docs.map((doc) => {
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
      const senderEmail = this.userEmail;
      const senderFirstName = this.senderFirstName;
      const timestamp = Timestamp.now();

      try {
        await addDoc(collection(projectFirestore, "messages"), {
          receiverId: receiverEmail,
          senderId: senderEmail,
          senderFirstName: senderFirstName,
          message: this.newMessage,
          timestamp: timestamp,
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
        const email = this.userEmail;
        const querySnapshot = await getDocs(
          query(
            collection(projectFirestore, "profile"),
            where("email", "==", email)
          )
        );
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          this.senderProfession = data.profession;
          this.senderFirstName = data.firstName;
          if (this.senderProfession === "Coach") {
            this.addClientUsers();
          } else if (this.senderProfession === "Client") {
            this.addCoachUsers();
          }
        });
      } catch (error) {
        console.error("Error retrieving sender info:", error);
      }
    },
    async addClientUsers() {
      try {
        const clientUsersSnapshot = await getDocs(
          query(
            collection(projectFirestore, "profile"),
            where("profession", "==", "Client")
          )
        );
        const clientUsers = clientUsersSnapshot.docs.map((doc) => doc.data());
        this.profileList = clientUsers;
      } catch (error) {
        console.error("Error adding client users:", error);
      }
    },
    async addCoachUsers() {
      try {
        const coachUsersSnapshot = await getDocs(
          query(
            collection(projectFirestore, "profile"),
            where("profession", "==", "Coach")
          )
        );
        const coachUsers = coachUsersSnapshot.docs.map((doc) => doc.data());
        this.profileList = coachUsers;
      } catch (error) {
        console.error("Error adding coach users:", error);
      }
    },
    fetchMessages() {
      const senderEmail = this.userEmail;
      const receiverEmail = this.selectedProfile
        ? this.selectedProfile.email
        : null;
      if (!receiverEmail) return;

      const messagesRef = collection(projectFirestore, "messages");
      const q = query(
        messagesRef,
        where("senderId", "in", [senderEmail, receiverEmail]),
        where("receiverId", "in", [senderEmail, receiverEmail]),
        orderBy("timestamp", "asc")
      );

      // Stop listening to previous messages if already subscribed
      if (this.unsubscribe) {
        this.unsubscribe();
      }

      // Subscribe to collection updates
      this.unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          this.messages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          this.$nextTick(() => {
            const messagesContainer = this.$refs.messages;
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          });
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
    },
    filteredProfileList(profession) {
      return this.profileList.filter(
        (profile) => profile.profession === profession
      );
    },
  },
  watch: {
    showMessages() {
      this.fetchMessages();
    },
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
};
</script>

<style scoped>
/* Your existing styles */
/* Updated styles for a more modern look */

.chat-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-app {
  display: flex;
  max-height: 600px; /* Set maximum height */
  overflow-y: auto; /* Add vertical scroll if content exceeds maximum height */
}

.user-list-box {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ccc;
}

.user-list {
  border: none; /* Removed border for cleaner look */
  overflow-y: auto;
}

.user-list-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.user {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Added smooth transition */
  display: flex; /* Added to align icon and text horizontally */
  align-items: center; /* Added to align icon and text vertically */
}

.user svg {
  margin-right: 8px; /* Added margin to separate icon from text */
}

.user:hover,
.selected-user {
  background-color: #f0f0f0; /* Lighter background color on hover */
}

.chat-container {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px; /* Increased padding for better spacing */
  border-bottom: 1px solid #ccc;
  font-size: 18px; /* Larger font size for header */
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  padding: 20px; /* Increased padding for better spacing */
  overflow-y: auto;
}

.message {
  margin-bottom: 20px; /* Increased margin for better separation */
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 20px; /* Increased padding for better spacing */
  border-top: 1px solid #ccc; /* Added border top */
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 12px 24px; /* Increased padding for better appearance */
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; /* Added smooth transition */
}

.chat-input button:hover {
  background-color: #0056b3; /* Darker background color on hover */
}
</style>
