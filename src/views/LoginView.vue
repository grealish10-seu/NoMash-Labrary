<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">🔐 Library Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="loginForm.username"
                  required
                  :class="{ 'is-invalid': loginError }"
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
                  :class="{ 'is-invalid': loginError }"
                />
              </div>
              <div v-if="loginError" class="alert alert-danger" role="alert">
                {{ loginError }}
              </div>
              <div v-if="loginSuccess" class="alert alert-success" role="alert">
                {{ loginSuccess }}
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isLoggingIn">
                  <span v-if="isLoggingIn" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <small class="text-muted">
                Demo credentials: username = <strong>admin</strong>, password = <strong>password123</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../auth.js'

const router = useRouter()

const loginForm = ref({
  username: '',
  password: ''
})

const loginError = ref('')
const loginSuccess = ref('')
const isLoggingIn = ref(false)

const handleLogin = async () => {
  loginError.value = ''
  loginSuccess.value = ''
  isLoggingIn.value = true

  // 模拟登录延迟
  setTimeout(() => {
    const result = login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      loginSuccess.value = result.message
      // 登录成功后重定向到首页或之前尝试访问的页面
      setTimeout(() => {
        const redirectTo = router.currentRoute.value.query.redirect || '/'
        router.push(redirectTo)
      }, 1000)
    } else {
      loginError.value = result.message
    }
    
    isLoggingIn.value = false
  }, 500)
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style> 