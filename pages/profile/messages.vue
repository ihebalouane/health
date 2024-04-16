<template>
  <div>
    <profile-header/>
    <div class="chat-box">
      <div class="chat-app">
        <div class="user-list-box">
          <div class="user-list">
            <div v-for="(profile, index) in profileList" :key="index" class="user" @click="selectUser(profile)">
              {{ profile.firstName }}
            </div>
          </div>
        </div>
        <div class="chat-container">
          <div class="chat-header">
            <div v-if="selectedProfile">{{ selectedProfile.firstName }}</div>
            <div v-else>Select a user to chat</div>
          </div>
          <div class="chat-messages" ref="messages">
            <div v-for="(message, index) in filteredMessages" :key="index" class="message" :class="{ 'sent': message.sentByMe, 'received': !message.sentByMe }">
              <div class="message-content">{{ message.text }}</div>
            </div>
          </div>
          <div class="chat-input">
            <input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
            <button @click="sendMessage">Send</button>
          </div>
          <p>This connected email is: {{ Email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '@/firebase/config.js'; // Update the path accordingly
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import userState from '@/store/userState.js';

export default {
  middleware: 'auth',
  data() {
    return {
      profileList: [],
      selectedProfile: null,
      messages: {}, // Changed to store messages based on senderId_receiverId combination
      newMessage: ''
    };
  },
  async mounted() {
    await this.fetchProfiles();
  },
  setup() {
    const Email = userState.userEmail;
    return { Email };
  },
  computed: {
    filteredMessages() {
      if (!this.selectedProfile) return [];
      // Get the conversation key based on senderId_receiverId combination
      const conversationKey = `${this.Email}_${this.selectedProfile.email}`;
      return this.messages[conversationKey] || [];
    }
  },
  methods: {
    async fetchProfiles() {
      try {
        const profilesSnapshot = await getDocs(collection(projectFirestore, 'profile'));
        this.profileList = profilesSnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    },
    selectUser(profile) {
      if (this.selectedProfile && profile.id !== this.selectedProfile.id) {
        // Clear new message when switching users
        this.newMessage = '';
      }
      this.selectedProfile = profile;
    },
    async sendMessage() {
      if (!this.selectedProfile) return;
      if (this.newMessage.trim() === '') return;
      const receiverEmail = this.selectedProfile.email; // Get receiver's email from the selected profile
      const senderEmail = this.Email; // Get sender's email from userState
      const timestamp = Timestamp.now(); // Get current timestamp
      
      // Get the conversation key based on senderId_receiverId combination
      const conversationKey = `${senderEmail}_${receiverEmail}`;
      
      // Add message to the messages object based on the conversation key
      if (!this.messages[conversationKey]) {
        this.messages[conversationKey] = [];
      }
      this.messages[conversationKey].push({
        text: this.newMessage,
        sentByMe: true // Assuming the user is always sending messages
      });
      
      // Add message to the messages collection
      try {
        await addDoc(collection(projectFirestore, 'messages'), {
          receiverId: receiverEmail,
          senderId: senderEmail,
          message: this.newMessage,
          timestamp: timestamp
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
      
      this.newMessage = '';
      // Scroll to the bottom of the chat window
      this.$nextTick(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      });
    }
  }
};
</script>




<style scoped>
.chat-box {
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
}

.chat-app {
  display: flex;
  height: 400px; /* Adjust as needed */
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

.user:hover {
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
}

.message {
  margin-bottom: 10px;
  max-width: 70%;
}

.sent {
  align-self: flex-end;
}

.received {
  align-self: flex-start;
}

.message-content {
  padding: 8px 12px;
  border-radius: 10px;
  background-color: #DCF8C6; /* Sent message background color */
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
  background-color: #007BFF; /* Button background color */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3; /* Button hover background color */
}
</style>

  
  <style scoped>
  .chat-box {
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .chat-app {
    display: flex;
    height: 400px; /* Adjust as needed */
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
  
  .user:hover {
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
  }
  
  .message {
    margin-bottom: 10px;
    max-width: 70%;
  }
  
  .sent {
    align-self: flex-end;
  }
  
  .received {
    align-self: flex-start;
  }
  
  .message-content {
    padding: 8px 12px;
    border-radius: 10px;
    background-color: #DCF8C6; /* Sent message background color */
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
    background-color: #007BFF; /* Button background color */
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .chat-input button:hover {
    background-color: #0056b3; /* Button hover background color */
  }
  </style>
  