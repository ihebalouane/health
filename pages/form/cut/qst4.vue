<template>
  <div>
    <qst-header />
    <BgAnimations/>
    <div class="page-container">
      <div class="form-container">
        <div class="modern-box">
          <h2 class="form-title">What's Your Goal Weight?</h2>
          <form class="weight-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="weight" class="form-label">Weight (kg):</label>
              <input type="number" id="weight" name="weight" placeholder="Enter your goal weight" required v-model.number="weight" min="0" class="form-input">
            </div>
            <button type="submit" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
                  Next
            </button>          
          </form>
        </div>
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
      weight: null
    };
  },
  methods: {
    async submitForm() {
      if (!this.weight || this.weight <= 0) {
        alert('Please enter a valid weight.');
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          return;
        }

        const userDocRef = collection(projectFirestore, "userResponses");
        const q = query(userDocRef, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            goalWeight: this.weight,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          await addDoc(collection(projectFirestore, "userResponses"), {
            userEmail: user.email,
            goalWeight: this.weight,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        this.$router.push('/form/cut/qst5');
      } catch (error) {
        console.error("Error saving goal weight: ", error);
        alert('There was an error saving your goal weight. Please try again.');
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

.form-container {
  width: 100%;
  max-width: 400px; 
  margin-top: 20px; 
}

.modern-box {
  background-color: #ffffff; 
  border: none; 
  border-radius: 10px;
  padding: 20px; 
}

.form-title {
  font-size: 1.5rem; 
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333; 
}

.form-group {
  margin-bottom: 15px; 
}

.form-label {
  font-size: 1.1rem; 
  margin-bottom: 5px;
  display: block;
  color: #555; 
}

.form-input {
  width: 100%;
  padding: 12px; 
  font-size: 1rem; 
  border: 1px solid #ccc; 
  border-radius: 5px;
}

.submit-button {
  padding: 12px 20px;
  font-size: 1.1rem; 
  background-color: #2ecc71; 
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #27ae60;
}
</style>
