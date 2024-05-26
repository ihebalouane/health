<template>
  <div>
    <profile-header />
    <div v-if="loading" class="spinner">Loading...</div>
    <div v-else>
      <div class="chat-box">
        <BgAnimations />

        <div class="chat-app">
          <div class="user-list-box">
            <div class="user-list">
              <div class="title-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                {{ senderProfession === "Coach" ? "Client" : "Coach" }}
              </div>
              <div
                v-for="(profile, index) in filteredProfileList()"
                :key="'coach' + index"
                class="user"
                @click="selectUser(profile)"
                :class="{ 'selected-user': profile === selectedProfile }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
                {{ profile.firstName }} {{ profile.lastName }}
                <span v-if="profile.unreadCount > 0" class="unread-count">
                  &nbsp;({{ profile.unreadCount }})
                </span>
              </div>
            </div>
          </div>
          <div class="chat-container">
            <div class="chat-header">
              <div v-if="selectedProfile">{{ selectedProfile.firstName }}</div>
              <div v-else>Select a user to chat</div>
            </div>

            <div class="chat-messages" ref="messages">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="[
                  message.senderId === userEmail
                    ? 'sent-message-container'
                    : 'received-message-container',
                ]"
              >
                <div
                  :class="[
                    message.senderId === userEmail
                      ? 'sent-message'
                      : 'received-message',
                  ]"
                >
                  <p>
                    {{ message.message }}
                  </p>
                </div>
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
  </div>
</template>

<script>
import { projectFirestore } from "@/firebase/config.js";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ref, onMounted } from "vue";

export default {
  middleware: "auth",
  setup() {
    const userEmail = ref("");

    onMounted(() => {
      userEmail.value = localStorage.getItem("email") || "";
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
      loading: true,
    };
  },

  async mounted() {
    await this.fetchProfiles();
  },

  computed: {
    showMessages() {
      if (this.selectedProfile && this.userEmail) {
        return `${this.userEmail}_${this.selectedProfile.userEmail}`;
      }
      return null;
    },
  },
  methods: {
    async fetchProfiles() {
      this.loading = true;
      try {
        const profilesSnapshot = await getDocs(
          collection(projectFirestore, "profile")
        );

        // Fetch profiles and unread message counts
        const profilePromises = profilesSnapshot.docs.map(async (doc) => {
          const profile = {
            id: doc.id,
            ...doc.data(),
          };
          // Get unread message count for the profile
          profile.unreadCount = await this.getUnreadMessagesCount(
            profile.userEmail
          );
          return profile;
        });

        // Wait for all profile promises to resolve
        this.profileList = await Promise.all(profilePromises);

        // Retrieve sender info after profiles are fetched
        await this.retrieveSenderInfo();
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        this.loading = false;
      }
    },

    async selectUser(profile) {
      this.selectedProfile = profile;
      this.newMessage = "";
      await this.markMessagesAsRead();
    },

    async markMessagesAsRead() {
      const senderEmail = this.userEmail;
      const receiverEmail = this.selectedProfile.userEmail;

      const messagesRef = collection(projectFirestore, "messages");
      const q = query(
        messagesRef,
        where("senderId", "==", receiverEmail),
        where("receiverId", "==", senderEmail),
        where("isRead", "==", false)
      );

      try {
        const querySnapshot = await getDocs(q);
        const updatePromises = querySnapshot.docs.map((doc) => {
          const messageRef = doc.ref;
          return updateDoc(messageRef, { isRead: true });
        });

        await Promise.all(updatePromises);
        this.selectedProfile.unreadCount = 0;
        console.log("All messages marked as read.");
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },

    async getUnreadMessagesCount(profileId) {
      const profilesSnapshot = await getDocs(
        collection(projectFirestore, "profile")
      );
      const profiles = profilesSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      if (!this.userEmail) return 0;
      const profile = profiles.find((profile) => profile.id === profileId);
      if (!profile) return 0;
      const senderEmail = profile.userEmail;
      const receiverEmail = this.userEmail;

      try {
        const messagesRef = collection(projectFirestore, "messages");
        const q = query(
          messagesRef,
          where("senderId", "==", senderEmail),
          where("receiverId", "==", receiverEmail),
          where("isRead", "==", false)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
      } catch (error) {
        console.error("Error fetching unread messages:", error);
        return 0;
      }
    },
    async sendMessage() {
      if (
        !this.selectedProfile ||
        !this.userEmail ||
        this.newMessage.trim() === ""
      ) {
        return;
      }

      const receiverEmail = this.selectedProfile.userEmail;
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
          isRead: false,
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
            where("userEmail", "==", email)
          )
        );
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          this.senderProfession = data.profession;
          this.senderFirstName = data.firstName;
          if (this.senderProfession === "Client") {
            const filteredList = this.filteredProfileList();
            this.profileList = filteredList.filter((profile) => {
              if (data.coach) {
                return profile.userEmail === data.coach;
              }
            });
          } else if (this.senderProfession === "Coach") {
            const filteredList = this.filteredProfileList();
            this.profileList = filteredList.filter((profile) => {
              return profile.coach === email;
            });
          }
        });
      } catch (error) {
        console.error("Error retrieving sender info:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchMessages() {
      const senderEmail = this.userEmail;
      const receiverEmail = this.selectedProfile
        ? this.selectedProfile.userEmail
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
    filteredProfileList() {
      return this.profileList.filter(
        (profile) => profile.profession !== this.senderProfession
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

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 1.5rem;
  color: #999;
}

.chat-box {
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chat-app {
  display: flex;
  max-height: 600px;
  overflow-y: auto;
}

.user-list-box {
  flex: 1;
  padding: 10px;
  border-right: 1px solid #ccc;
}

.user-list {
  border: none;
  overflow-y: auto;
}

.title-container {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.title-container svg {
  margin-right: 8px;
}

.user {
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.user svg {
  margin-right: 8px;
}

.user:hover,
.selected-user {
  background-color: #f0f0f0;
}

.chat-container {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  font-size: 18px;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.unread-count {
  color: red;
  font-weight: bold;
}

.message {
  margin-bottom: 20px;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 12px 24px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-input button:hover {
  background-color: #0056b3;
}

.received-message-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.sent-message-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.received-message {
  background-color: #2ecc71;
  color: #fff;
  padding: 10px;
  border-radius: 20px;
}

.sent-message {
  background-color: rgb(94, 113, 236);
  color: white;
  padding: 10px;
  border-radius: 20px;
}
</style>
