<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">🔥 Firebase Authentication</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="signInWithFirebase">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="loginForm.email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="loginForm.password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Signing in...' : 'Sign In with Firebase' }}
                </button>
                <router-link to="/FireRegister" class="btn btn-outline-secondary">
                  Create New Account
                </router-link>
                <button type="button" class="btn btn-outline-info" @click="signInWithGoogle" :disabled="isLoading">
                  Sign In with Google
                </button>
                <button type="button" class="btn btn-outline-warning" @click="resetPassword" :disabled="isLoading">
                  Forgot Password?
                </button>
              </div>
            </form>
            
            <div v-if="user" class="mt-4">
              <div class="alert alert-success">
                <h5>Welcome, {{ user.email }}!</h5>
                <p><strong>User ID:</strong> {{ user.uid }}</p>
                <p>You are successfully logged in with Firebase.</p>
                <button class="btn btn-outline-danger" @click="signOutUser">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/init.js'

const loginForm = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const user = ref(null)

// Listen for authentication state changes
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      console.log('🔥 Firebase Auth - User is signed in:')
      console.log('   Email:', currentUser.email)
      console.log('   UID:', currentUser.uid)
      console.log('   Creation Time:', currentUser.metadata.creationTime)
      console.log('   Last Sign In:', currentUser.metadata.lastSignInTime)
      console.log('   User Object:', currentUser)
    } else {
      user.value = null
      console.log('🔥 Firebase Auth - User is signed out')
    }
  })
})

const signInWithFirebase = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      loginForm.value.email, 
      loginForm.value.password
    )
    
    const user = userCredential.user
    successMessage.value = `Welcome back, ${user.email}!`
    console.log('🔥 Firebase Sign In Success:')
    console.log('   Method: Email/Password')
    console.log('   Email:', user.email)
    console.log('   UID:', user.uid)
    console.log('   Sign In Time:', new Date().toLocaleString())
    
    // Clear form
    loginForm.value = {
      email: '',
      password: ''
    }
    
  } catch (error) {
    console.error('Sign in error:', error)
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address.'
        break
      case 'auth/user-disabled':
        errorMessage.value = 'This account has been disabled.'
        break
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email. Please register first.'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Incorrect password.'
        break
      case 'auth/invalid-credential':
        errorMessage.value = 'Invalid email or password.'
        break
      default:
        errorMessage.value = `Sign in failed: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}

const signInWithGoogle = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user
    
    successMessage.value = `Welcome, ${user.displayName || user.email}!`
    console.log('🔥 Firebase Google Sign In Success:')
    console.log('   Method: Google OAuth')
    console.log('   Email:', user.email)
    console.log('   Display Name:', user.displayName)
    console.log('   UID:', user.uid)
    
  } catch (error) {
    console.error('Google sign in error:', error)
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage.value = 'Sign in was cancelled.'
        break
      case 'auth/popup-blocked':
        errorMessage.value = 'Popup was blocked. Please allow popups for this site.'
        break
      default:
        errorMessage.value = `Google sign in failed: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}

const signOutUser = async () => {
  try {
    await signOut(auth)
    successMessage.value = 'Successfully signed out!'
    errorMessage.value = ''
    console.log('🔥 Firebase Sign Out Success')
    console.log('   User has been signed out at:', new Date().toLocaleString())
  } catch (error) {
    console.error('Sign out error:', error)
    errorMessage.value = `Sign out failed: ${error.message}`
  }
}

const resetPassword = async () => {
  if (!loginForm.value.email) {
    errorMessage.value = 'Please enter your email address first.'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await sendPasswordResetEmail(auth, loginForm.value.email)
    successMessage.value = 'Password reset email sent! Check your inbox.'
    console.log('Password reset email sent')
  } catch (error) {
    console.error('Password reset error:', error)
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email address.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address.'
        break
      default:
        errorMessage.value = `Password reset failed: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e35 100%);
  color: white;
  border-bottom: none;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8e35 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ff5722 0%, #ff7043 100%);
}

.btn-outline-info {
  border-color: #4285f4;
  color: #4285f4;
}

.btn-outline-info:hover {
  background-color: #4285f4;
  border-color: #4285f4;
}

.btn-outline-secondary {
  text-decoration: none;
}
</style> 