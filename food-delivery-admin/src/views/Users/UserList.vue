<template>
  <div class="user-list">
    <h2>User Management</h2>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> Add User
      </el-button>

      <el-table :data="users" style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Active' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="Add User" width="500px">
      <el-form :model="form">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="form.role">
            <el-option label="Customer" value="Customer" />
            <el-option label="Driver" value="Driver" />
            <el-option label="Admin" value="Admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveUser">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const form = ref({
  name: '',
  email: '',
  role: 'Customer'
})

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Driver', status: 'Active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Admin', status: 'Active' }
])

const editUser = (user) => {
  form.value = { ...user }
  dialogVisible.value = true
}

const deleteUser = (user) => {
  ElMessageBox.confirm('Are you sure to delete this user?', 'Warning', {
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(u => u.id !== user.id)
    ElMessage.success('User deleted successfully')
  })
}

const saveUser = () => {
  ElMessage.success('User saved successfully')
  dialogVisible.value = false
}
</script>

<style scoped>
.user-list h2 {
  margin-bottom: 20px;
}
</style>