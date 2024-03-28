<template>
  <div>
    <qst-header/>
    <BgAnimations/>
    <div class="page-container">
      <div class="form-container">
        <h2 class="form-title">Enter Your Height and Weight</h2>
        <form class="height-weight-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="height">Height (cm):</label>
            <input type="number" id="height" name="height" placeholder="Enter height" required v-model="height">
          </div>
          <div class="form-group">
            <label for="weight">Weight (kg):</label>
            <input type="number" id="weight" name="weight" placeholder="Enter weight" required v-model="weight">
          </div>
          <button type="submit" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
            Next
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore, auth } from '../../../firebase/config'; 
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      height: null,
      weight: null
    };
  },
  methods: {
    async handleSubmit() {
      try {
        // Check if user is logged in
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          // Handle user not logged in
          return;
        }

        // Query Firestore to find the document with the user's email
        const userDocRef = collection(projectFirestore, "userResponses");
        const q = query(userDocRef, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.error("User document not found.");
          // Handle user document not found
          return;
        }

        // Update the existing document with the new data
        const doc = querySnapshot.docs[0];
        await updateDoc(doc.ref, {
          height: this.height,
          weight: this.weight,
          timestamp: new Date()
        });

        console.log('Data updated in', user.email, 'account');
        // Redirect to the next question
        this.$router.push('/form/cut/qst3');
      } catch (error) {
        console.error("Error updating data in Firestore: ", error);
        // Handle error
      }
    }
  }
};
</script>


<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  height: 100vh;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #2ecc71; 
  color: #fff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
}

.svg-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
}

.svg-icon {
  fill: none;
  stroke-width: 1.5;
  stroke: #2ecc71;
}

.svg-button:hover .svg-icon {
  stroke: #27ae60; 
}

.form-container {
  width: 80%;
  max-width: 400px;
  padding: 20px;
  margin-top: 50px; 
  background-color: #ffffff; 
  text-align: center;
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333; 
}

.height-weight-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #555; 
}

input[type="number"] {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  outline: none; 
}

.submit-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #2ecc71; 
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none; 
}

.submit-button:hover {
  background-color: #27ae60; 
}
</style>
