<template>
  <div>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="alcohol-form">
        <label class="form-label">How often do you consume alcohol?</label>
        <div class="radio-group">
          <label class="radio-label" v-for="option in options" :key="option.value">
            <input type="radio" v-model="selectedOption" :value="option.value" class="radio-input">
            <span class="radio-custom"></span>
            <span class="radio-text">{{ option.label }}</span>
          </label>
        </div>
        <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore, auth } from '../../../firebase/config'; // Make sure the path is correct
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedOption: '',
      options: [
        { value: 'Never', label: 'Never' },
        { value: 'Occasionally', label: 'Occasionally' },
        { value: 'Regularly', label: 'Regularly' },
        { value: 'Frequently', label: 'Frequently' }
      ]
    };
  },
  methods: {
    async submitForm() {
      if (!this.selectedOption) {
        alert('Please select how often you consume alcohol.');
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          // Handle user not logged in
          return;
        }

        // Query Firestore to find if there's an existing document with the user's email
        const userDocRef = collection(projectFirestore, "userResponses");
        const q = query(userDocRef, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // If document exists, update it with the new data
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            alcoholFrequency: this.selectedOption,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          // If document doesn't exist, create a new one with the provided data
          await addDoc(collection(projectFirestore, "users"), {
            userEmail: user.email,
            alcoholFrequency: this.selectedOption,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        // Redirect to the next question
        this.$router.push('/form/bulk/qst9');
      } catch (error) {
        console.error("Error saving alcohol consumption frequency: ", error);
        alert('There was an error saving your selection. Please try again.');
      }
    }
  }
};
</script>


<style scoped>

.form-container {
  max-width: 400px;
  margin: 20px auto;
  background-color: #fff; /* Changed background color to white */
  border-radius: 8px; /* Removed border */
  padding: 20px;
  box-shadow: none; /* Removed box shadow */
}

.form-label {
font-size: 1.2rem;
margin-bottom: 10px;
display: block;
}

.radio-group {
display: flex;
flex-direction: column;
}

.radio-label {
display: flex;
align-items: center;
margin-bottom: 10px;
cursor: pointer;
}

.radio-custom {
width: 20px;
height: 20px;
border: 2px solid #2ecc71; /* Changed border color */
border-radius: 50%;
margin-right: 10px;
position: relative;
}

.radio-custom::after {
content: '';
display: block;
width: 10px;
height: 10px;
background-color: #2ecc71; /* Changed background color */
border-radius: 50%;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%) scale(0);
transition: transform 0.2s ease;
}

.radio-text {
font-size: 1rem;
}

.radio-input {
opacity: 0;
width: 0;
height: 0;
}

.radio-input:checked + .radio-custom::after {
transform: translate(-50%, -50%) scale(1);
}

.submit-button {
background-color: #2ecc71; /* Changed button color */
color: #fff;
padding: 10px 20px;
font-size: 1rem;
border: none;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease;
}

.submit-button:hover {
background-color: #27ae60; /* Adjusted hover background color */
}
</style>
