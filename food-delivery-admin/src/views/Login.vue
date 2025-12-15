<template>
  <div class="login-page">
    <div class="bg-overlay"></div>
    <el-card class="login-card" shadow="hover">
      <div class="brand">
        <div class="brand-logo">🍔</div>
        <div class="brand-text">
          <div class="brand-title">Food Delivery Admin</div>
          <div class="brand-sub">欢迎登录</div>
        </div>
      </div>
      <el-form :model="loginForm" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
              v-model="loginForm.identity"
              placeholder="手机号 / 邮箱 / 用户名"
              prefix-icon="User"
              size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="full-btn" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="helper-text">
        还没有账号？
        <el-link type="primary" @click="goRegister">立即注册</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import { ElMessage } from 'element-plus'
import { authService } from '../api/services/authService'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  identity: '',
  password: ''
})

const handleLogin = async () => {
  if (!loginForm.identity || !loginForm.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }

  try {
    const res = await authService.login({ identity: loginForm.identity, password: loginForm.password })
    // authService returns { token, user }
    userStore.setToken(res.token)
    userStore.setUser(res.user)
    ElMessage.success('登录成功!')
    router.push('/')
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || '登录失败')
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
  color: #e5e7eb;
  overflow: hidden;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15,23,42,0.45), rgba(15,23,42,0.25));
  backdrop-filter: blur(3px);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 28px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(11, 18, 32, 0.55);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 48px rgba(0,0,0,0.35);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.brand-logo {
  font-size: 32px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.brand-sub {
  font-size: 13px;
  color: #9ca3af;
}

.full-btn {
  width: 100%;
}

.helper-text {
  text-align: center;
  margin-top: 10px;
  color: #9ca3af;
  font-size: 14px;
}

@media (max-width: 900px) {
  .login-card {
    width: 92%;
  }
}
</style>