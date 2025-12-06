<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <h2>🍔 FoodHub Admin</h2>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ userStore.userInfo?.name || 'Admin' }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px" class="sidebar">
        <el-menu
            :default-active="activeMenu"
            router
            class="sidebar-menu"
        >
          <el-menu-item index="/">
            <el-icon><DataAnalysis /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>

          <el-sub-menu index="users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>User Management</span>
            </template>
            <el-menu-item index="/users">User List</el-menu-item>
            <el-menu-item index="/drivers">Drivers</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/orders">
            <el-icon><ShoppingCart /></el-icon>
            <span>Orders</span>
          </el-menu-item>

          <el-menu-item index="/menu">
            <el-icon><Food /></el-icon>
            <span>Menu Management</span>
          </el-menu-item>

          <el-menu-item index="/banners">
            <el-icon><Picture /></el-icon>
            <span>Banners</span>
          </el-menu-item>

          <el-menu-item index="/analytics">
            <el-icon><TrendCharts /></el-icon>
            <span>Analytics</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.header {
  background: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left h2 {
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.sidebar {
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
}

.sidebar-menu {
  border-right: none;
}

.main-content {
  padding: 20px;
  background: #f0f2f5;
}
</style>