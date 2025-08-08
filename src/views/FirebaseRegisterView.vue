<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">🔥 Firebase Registration</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="registerUser">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="registerForm.email"
                  required
                  placeholder="Enter your email address"
                  :class="{ 'is-invalid': emailError }"
                />
                <div v-if="emailError" class="invalid-feedback">
                  {{ emailError }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="registerForm.password"
                  required
                  placeholder="Enter your password (min 6 characters)"
                  :class="{ 'is-invalid': passwordError }"
                />
                <div v-if="passwordError" class="invalid-feedback">
                  {{ passwordError }}
                </div>
                <div class="form-text">
                  Password must be at least 6 characters long.
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  required
                  placeholder="Confirm your password"
                  :class="{ 'is-invalid': confirmPasswordError }"
                />
                <div v-if="confirmPasswordError" class="invalid-feedback">
                  {{ confirmPasswordError }}
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                <strong>Registration Failed:</strong> {{ errorMessage }}
              </div>

              <div v-if="successMessage" class="alert alert-success" role="alert">
                <strong>Success:</strong> {{ successMessage }}
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                </button>
                
                <div class="text-center mt-3">
                  <p class="mb-0">Already have an account?</p>
                  <router-link to="/firebase-signin" class="btn btn-outline-secondary">
                    Sign In Instead
                  </router-link>
                </div>
              </div>
            </form>

            <!-- Registration Success Display -->
            <div v-if="registeredUser" class="mt-4">
              <div class="alert alert-success">
                <h5>🎉 Registration Successful!</h5>
                <p><strong>Email:</strong> {{ registeredUser.email }}</p>
                <p><strong>User ID:</strong> {{ registeredUser.uid }}</p>
                <p>Your account has been created successfully. You can now sign in.</p>
                <router-link to="/firebase-signin" class="btn btn-primary">
                  Go to Sign In
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/init.js'

// Reactive form data
const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// State management
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const registeredUser = ref(null)

// Validation errors
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// Computed property for form validation
const isFormValid = computed(() => {
  return registerForm.value.email &&
         registerForm.value.password.length >= 6 &&
         registerForm.value.password === registerForm.value.confirmPassword &&
         !emailError.value &&
         !passwordError.value &&
         !confirmPasswordError.value
})

// Validation functions
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(registerForm.value.email)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (registerForm.value.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long'
  } else {
    passwordError.value = ''
  }
  validateConfirmPassword() // Re-validate confirm password when password changes
}

const validateConfirmPassword = () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

// Main registration function
const registerUser = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate form
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      registerForm.value.email, 
      registerForm.value.password
    )
    
    // Registration successful
    const user = userCredential.user
    registeredUser.value = user
    successMessage.value = `Account created successfully for ${user.email}!`
    
    console.log('🔥 Firebase Registration Success:')
    console.log('   Email:', user.email)
    console.log('   UID:', user.uid)
    console.log('   Registration Time:', new Date().toLocaleString())
    console.log('   User Object:', user)
    
    // Clear form
    registerForm.value = {
      email: '',
      password: '',
      confirmPassword: ''
    }
    
  } catch (error) {
    // Handle Firebase authentication errors
    console.error('Registration error:', error)
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'This email address is already registered. Please use a different email or sign in.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address format.'
        break
      case 'auth/weak-password':
        errorMessage.value = 'Password is too weak. Please choose a stronger password.'
        break
      case 'auth/operation-not-allowed':
        errorMessage.value = 'Email/password registration is not enabled. Please contact support.'
        break
      default:
        errorMessage.value = `Registration failed: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}

// Watch for input changes to provide real-time validation
watch(() => registerForm.value.email, validateEmail)
watch(() => registerForm.value.password, validatePassword)
watch(() => registerForm.value.confirmPassword, validateConfirmPassword)
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-bottom: none;
}

.btn-primary {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1e7e6f 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
}

.alert {
  border-radius: 0.5rem;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style> 