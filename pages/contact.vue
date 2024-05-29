<template>
    <div class="contact-page">
        <div class="contact-form">
            <h1>Contact Us</h1>
            <p>We're here to help! Use the form below to send us a message.</p>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" v-model="formData.name" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="formData.email" required />
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" v-model="formData.message" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit</button>
            </form>
        </div>
        <div class="contact-info">
            <h2>Our Information</h2>
            <p><strong>Address:</strong> 123 Gym Street, Fitness City, FG 56789</p>
            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
            <p><strong>Email:</strong> contact@coachinggym.com</p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const formData = reactive({
    name: '',
    email: '',
    message: ''
});

const submitForm = () => {
    // Handle the form submission logic here
    console.log('Form submitted:', formData);
    // Reset the form after submission
    formData.name = '';
    formData.email = '';
    formData.message = '';
};
</script>

<style lang="scss" scoped>
.contact-page {
    display: flex;
    gap: 40px;
    padding: 40px;
    max-width: 1000px;
    margin: auto;

    font-family: 'Roboto', sans-serif;

    .contact-form {
        flex: 2;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background-color: #f9f9f9;

        h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
            color: #555;
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;

            .form-group {
                margin-bottom: 15px;

                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }

                input, textarea {
                    width: 100%;
                    padding: 12px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: border-color 0.3s;

                    &:focus {
                        border-color: #007BFF;
                        outline: none;
                    }
                }

                textarea {
                    resize: none;
                    height: 120px;
                }
            }

            .submit-btn {
                padding: 12px 20px;
                background-color: #2ecc71;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s;

                &:hover {
                    background-color: #34dc7a;
                }
            }
        }
    }

    .contact-info {
        flex: 1;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background-color: #f9f9f9;

        h2 {
            font-size: 24px;
            margin-bottom: 15px;
            color: #333;
        }

        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 10px;
        }

        .map {
            height: 200px;
            width: 100%;
            background-color: #eee;
            border-radius: 5px;
        }
    }
}
</style>
