<template>
  <div>
    <site-header/>
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

        <!-- Explanation Box -->
        <div class="explanation-box">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <p>We ask for this information to help you achieve your goal weight more effectively.</p>
        </div>
        <!-- End of Explanation Box -->
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
            goalWeight: this.weight,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          // If document doesn't exist, create a new one with the provided data
          await addDoc(collection(projectFirestore, "userResponses"), {
            userEmail: user.email,
            goalWeight: this.weight,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        // Redirect to the next question
        this.$router.push('/form/bulk/qst5');
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
  align-items: flex-start; /* Align items to the top */
  height: 100vh;
}

.form-container {
  width: 100%;
  max-width: 400px; /* Reduce max-width for a smaller form */
  margin-top: 20px; /* Added space between the top and the form */
}

.modern-box {
  background-color: #ffffff; /* Change background color to white */
  border: none; /* Remove border */
  border-radius: 10px;
  padding: 20px; /* Reduce padding for a smaller form */
}

.form-title {
  font-size: 1.5rem; /* Reduce font size for the title */
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333; /* Adjust title color */
}

.form-group {
  margin-bottom: 15px; /* Reduce margin for a more compact form */
}

.form-label {
  font-size: 1.1rem; /* Reduce font size for labels */
  margin-bottom: 5px;
  display: block;
  color: #555; /* Adjust label color */
}

.form-input {
  width: 100%;
  padding: 12px; /* Reduce padding for input fields */
  font-size: 1rem; /* Reduce font size for input fields */
  border: 1px solid #ccc; /* Adjust border color */
  border-radius: 5px;
}

.submit-button {
  padding: 12px 20px; /* Reduce padding for the submit button */
  font-size: 1.1rem; /* Reduce font size for the submit button */
  background-color: #2ecc71; /* Change button color to green */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjust hover background color to a slightly darker shade of green */
}

.explanation-box {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px); /* Add a blur effect for modernity */
  background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent background color */
  color: #333;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for modernity */
  display: flex;
  align-items: center; /* Center content vertically */
  justify-content: center; /* Center content horizontally */
}

.info-icon {
  margin-right: 10px; /* Space between the icon and text */
}
</style>
