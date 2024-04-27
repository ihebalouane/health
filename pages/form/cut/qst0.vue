<template>
    <div>
      <qstHeader />
      <BgAnimations/>
      <div class="form-container">
        <div class="experience-form">
          <label class="form-label">What is your level of experience?</label>
          <div class="radio-group">
            <label class="radio-label" v-for="option in options" :key="option.value">
              <input type="radio" v-model="selectedOption" :value="option.value" class="radio-input">
              <span class="radio-custom"></span>
              <span class="radio-text">{{ option.label }}</span>
            </label>
          </div>
          <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
            Submit
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { projectFirestore, auth } from '../../../firebase/config';
  import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        selectedOption: '',
        options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' }
        ]
      };
    },
    methods: {
      async submitForm() {
        if (!this.selectedOption) {
          alert('Please select one option.');
          return;
        }
        
        try {
          const user = auth.currentUser;
          if (!user) {
            console.error("User not logged in.");
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
              experienceLevel: this.selectedOption,
              timestamp: new Date()
            });
            console.log('Data updated in Firestore');
          } else {
            // If document doesn't exist, create a new one with the provided data
            await addDoc(collection(projectFirestore, "users"), {
              userEmail: user.email,
              experienceLevel: this.selectedOption,
              timestamp: new Date()
            });
            console.log('New document created in Firestore');
          }
  
          // Redirect to the next page or perform another action
          this.$router.push('/form/cut/qst1');
        } catch (error) {
          console.error("Error saving experience level: ", error);
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
    background-color: white;
    border-radius: 8px;
    padding: 20px;
  }
  
  .form-label {
    font-size: 1.3rem;
    margin-bottom: 15px;
    display: block;
    color: #333;
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    cursor: pointer;
  }
  
  .radio-custom {
    width: 24px;
    height: 24px;
    border: 2px solid #2ecc71;
    border-radius: 12px;
    margin-right: 12px;
    position: relative;
  }
  
  .radio-custom::after {
    content: '';
    display: block;
    width: 12px;
    height: 12px;
    background-color: #2ecc71;
    border-radius: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .radio-label:hover .radio-custom::after {
    opacity: 0.5;
  }
  
  .radio-text {
    font-size: 1.1rem;
  }
  
  .radio-input {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
  }
  
  .radio-input:checked + .radio-custom::after {
    opacity: 1;
  }
  
  .submit-button {
    background-color: #2ecc71;
    color: white;
    padding: 12px 24px;
    font-size: 1.1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .submit-button:hover {
    background-color: #27ae60;
  }
  </style>
  