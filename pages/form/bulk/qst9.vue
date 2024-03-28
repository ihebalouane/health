<template>
  <div>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="tobacco-form">
        <label class="form-label">Do you smoke or use any tobacco products?</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="smokeStatus" value="Yes" class="radio-input">
            <span class="radio-custom"></span>
            <span class="radio-text">Yes</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="smokeStatus" value="No" class="radio-input">
            <span class="radio-custom"></span>
            <span class="radio-text">No</span>
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
import { projectFirestore, auth } from '../../../firebase/config';
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      smokeStatus: ''
    };
  },
  methods: {
    async submitForm() {
      if (!this.smokeStatus) {
        alert('Please select an option.');
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
            tobaccoUse: this.smokeStatus,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          await addDoc(collection(projectFirestore, "userResponses"), {
            userEmail: user.email,
            tobaccoUse: this.smokeStatus,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        this.$router.push('/form/bulk/qst10');
      } catch (error) {
        console.error("Error saving tobacco use information: ", error);
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
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: none;
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
  border: 2px solid #2ecc71;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}

.radio-custom::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background-color: #2ecc71;
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
  background-color: #2ecc71;
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60;
}
</style>
