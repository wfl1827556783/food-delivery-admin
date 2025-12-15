<template>
  <div class="user-list">
    <div class="toolbar">
      <div class="left">
        <h2>用户管理</h2>
        <div class="filters">
          <el-input v-model="keyword" placeholder="搜索姓名/邮箱/电话" clearable size="small" style="width: 220px" @input="applyFilter" />
          <el-select v-model="roleFilter" placeholder="角色" clearable size="small" style="width: 120px" @change="applyFilter">
            <el-option label="全部" value="" />
            <el-option label="管理员" value="Admin" />
            <el-option label="配送员" value="Driver" />
            <el-option label="用户" value="Customer" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态" clearable size="small" style="width: 120px" @change="applyFilter">
            <el-option label="全部" value="" />
            <el-option label="启用" value="Active" />
            <el-option label="禁用" value="Inactive" />
          </el-select>
        </div>
      </div>
      <el-button type="primary" @click="openAdd">
        <el-icon><Plus /></el-icon> 添加用户
      </el-button>
    </div>

    <el-card class="table-card" shadow="hover">
      <el-table :data="pagedUsers" stripe height="520">
        <el-table-column prop="name" label="姓名" min-width="140" />
        <el-table-column prop="role" label="角色" width="110">
          <template #default="{ row }">
            <el-tag :type="getRoleTag(row.role)" effect="dark" size="small">
              {{ roleText(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" min-width="140" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Active' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.status === 'Active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)" type="primary" plain>编辑</el-button>
            <el-button size="small" type="danger" plain @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page="page"
            :total="filteredUsers.length"
            @current-change="page = $event"
        />
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '添加用户'" width="520px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role">
            <el-option label="用户" value="Customer" />
            <el-option label="配送员" value="Driver" />
            <el-option label="管理员" value="Admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option label="启用" value="Active" />
            <el-option label="禁用" value="Inactive" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userService } from '../../api/services/userService'

const dialogVisible = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  role: 'Customer',
  status: 'Active'
})

const users = ref([])
const keyword = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = 8

const loadUsers = () => {
  userService.getAllUsers().then(res => {
    if (Array.isArray(res)) users.value = res
  }).catch(() => ElMessage.error('加载用户失败'))
}

onMounted(() => loadUsers())

const filteredUsers = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return users.value.filter(u => {
    const matchKw = kw
      ? [u.name, u.email, u.phone].some(v => String(v || '').toLowerCase().includes(kw))
      : true
    const matchRole = roleFilter.value ? u.role === roleFilter.value : true
    const matchStatus = statusFilter.value ? u.status === statusFilter.value : true
    return matchKw && matchRole && matchStatus
  })
})

const pagedUsers = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

watch([keyword, roleFilter, statusFilter], () => {
  page.value = 1
})

const applyFilter = () => {
  page.value = 1
}

const editUser = (user) => {
  form.value = { ...user }
  dialogVisible.value = true
}

const openAdd = () => {
  form.value = { name: '', email: '', phone: '', role: 'Customer', status: 'Active' }
  dialogVisible.value = true
}

const deleteUser = (user) => {
  ElMessageBox.confirm('确定要删除该用户吗?', '警告', {
    type: 'warning'
  }).then(() => {
    userService.deleteUser(user.id).then(() => {
      users.value = users.value.filter(u => u.id !== user.id)
      ElMessage.success('用户已删除')
    }).catch(() => ElMessage.error('删除失败'))
  })
}

const saveUser = () => {
  if (form.value.id) {
    userService.updateUser(form.value.id, form.value).then(() => {
      ElMessage.success('用户已更新')
      dialogVisible.value = false
      loadUsers()
    }).catch(() => ElMessage.error('保存失败'))
  } else {
    userService.createUser(form.value).then(() => {
      ElMessage.success('用户已创建')
      dialogVisible.value = false
      loadUsers()
    }).catch(() => ElMessage.error('创建失败'))
  }
}

const getRoleTag = (role) => {
  const map = { Admin: 'warning', Driver: 'info', Customer: 'success' }
  return map[role] || 'info'
}

const roleText = (role) => {
  const map = { Admin: '管理员', Driver: '配送员', Customer: '用户' }
  return map[role] || role
}
</script>

<style scoped>
.user-list h2 {
  margin: 0;
  color: #e5e7eb;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.table-card {
  background: rgba(11, 18, 32, 0.55);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}

.table-footer {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>