<template>
<el-container class="layout-container">
    <el-header class="header">
      <div class="header-left">
        <h2>🍔 FoodHub 后台管理</h2>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ userStore.userInfo?.name || '未命名用户' }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
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
          <el-menu-item v-if="isAdmin" index="/">
            <el-icon><DataAnalysis /></el-icon>
            <span>仪表板</span>
          </el-menu-item>

          <el-sub-menu v-if="isAdmin" index="users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">用户列表</el-menu-item>
            <el-menu-item index="/drivers">配送员管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/orders">
            <el-icon><ShoppingCart /></el-icon>
            <span>{{ isDriver ? '接单派送' : '订单管理' }}</span>
          </el-menu-item>

          <el-menu-item v-if="isAdmin || isCustomer" index="/menu">
            <el-icon><Food /></el-icon>
            <span>{{ isAdmin ? '菜单管理' : '点餐菜单' }}</span>
          </el-menu-item>

          <el-menu-item v-if="isAdmin" index="/banners">
            <el-icon><Picture /></el-icon>
            <span>轮播图</span>
          </el-menu-item>

          <el-menu-item v-if="isAdmin" index="/analytics">
            <el-icon><TrendCharts /></el-icon>
            <span>数据分析</span>
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
const role = computed(() => userStore.userInfo?.role)
const isAdmin = computed(() => role.value === 'Admin')
const isDriver = computed(() => role.value === 'Driver')
const isCustomer = computed(() => role.value === 'Customer')

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background: #f6f8fb;
}

.header {
  background: #ffffff;
  color: #1f2933;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.header-left h2 {
  margin: 0;
  color: #1f2933;
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
  color: #1f2933;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 6px rgba(0,0,0,0.03);
}

.sidebar-menu {
  border-right: none;
  background: transparent;
  color: #1f2933;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  color: #1f2933;
}

.sidebar-menu .el-menu-item.is-active {
  background: rgba(88,196,143,0.12);
  color: #1f2933;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background: rgba(88,196,143,0.1);
}

.main-content {
  padding: 20px;
  background: #f6f8fb;
  color: #1f2933;
  overflow-y: auto;
}

/* 提升表格和卡片的可读性（浅色） */
:deep(.el-card) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #1f2933;
}

:deep(.el-table) {
  --el-table-bg-color: #ffffff;
  --el-table-header-bg-color: #f1f3f7;
  --el-table-header-text-color: #1f2933;
  --el-table-text-color: #5c6670;
  --el-table-row-hover-bg-color: rgba(88, 196, 143, 0.08);
  --el-table-border-color: #e5e7eb;
  --el-table-row-striped-bg-color: #f8fafc;
}

:deep(.el-pagination) {
  --el-text-color-regular: #5c6670;
}
</style>