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
import { collection, getDocs } from 'firebase/firestore';
import userState from '@/store/userState.js';

export default {
  middleware: 'auth',
  data() {
    return {
      profileList: [],
      selectedProfile: null,
      messages: {},
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
      return this.messages[this.selectedProfile.id] || [];
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
    sendMessage() {
      if (!this.selectedProfile) return;
      if (this.newMessage.trim() === '') return;
      const profileId = this.selectedProfile.id;
      if (!this.messages[profileId]) {
        this.messages[profileId] = [];
      }
      this.messages[profileId].push({
        text: this.newMessage,
        sentByMe: true // Assuming the user is always sending messages
      });
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
  