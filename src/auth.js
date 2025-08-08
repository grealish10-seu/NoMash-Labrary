import { ref } from 'vue'

// 硬编码的用户凭据
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
}

// 全局身份验证状态
export const isAuthenticated = ref(false)
export const currentUser = ref(null)

// 登录函数
export function login(username, password) {
  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    isAuthenticated.value = true
    currentUser.value = username
    return { success: true, message: 'Login successful' }
  } else {
    return { success: false, message: 'Invalid username or password' }
  }
}

// 登出函数
export function logout() {
  isAuthenticated.value = false
  currentUser.value = null
}

// 检查是否已认证
export function checkAuth() {
  return isAuthenticated.value
} 