<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>🍔 外卖配送平台</h2>
      <el-form :model="loginForm" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
              v-model="loginForm.username"
              placeholder="Username"
              prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="Password"
              prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="handleLogin">
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  // Mock login - replace with real API call later
  if (loginForm.username && loginForm.password) {
    userStore.setToken('mock-token-123')
    userStore.setUser({ name: loginForm.username })
    ElMessage.success('Login successful!')
    router.push('/')
  } else {
    ElMessage.error('Please enter username and password')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 30px;
}
</style>