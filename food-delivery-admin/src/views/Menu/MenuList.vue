<template>
  <div class="menu-list">
    <h2>Menu Management</h2>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> Add Menu Item
      </el-button>

      <el-table :data="menuItems" style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="category" label="Category" />
        <el-table-column prop="price" label="Price" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-switch v-model="row.available" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editItem(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteItem(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="Add Menu Item" width="500px">
      <el-form :model="form">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="form.category">
            <el-option label="Burgers" value="Burgers" />
            <el-option label="Pizza" value="Pizza" />
            <el-option label="Salads" value="Salads" />
            <el-option label="Drinks" value="Drinks" />
          </el-select>
        </el-form-item>
        <el-form-item label="Price">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveItem">Save</el-button>
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
  category: 'Burgers',
  price: 0
})

const menuItems = ref([
  { id: 1, name: 'Classic Burger', category: 'Burgers', price: '$12.99', available: true },
  { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: '$15.99', available: true },
  { id: 3, name: 'Caesar Salad', category: 'Salads', price: '$8.99', available: false }
])

const editItem = (item) => {
  form.value = { ...item }
  dialogVisible.value = true
}

const deleteItem = (item) => {
  ElMessageBox.confirm('Delete this menu item?', 'Warning', {
    type: 'warning'
  }).then(() => {
    menuItems.value = menuItems.value.filter(i => i.id !== item.id)
    ElMessage.success('Menu item deleted')
  })
}

const toggleStatus = (item) => {
  ElMessage.success(`${item.name} is now ${item.available ? 'available' : 'unavailable'}`)
}

const saveItem = () => {
  ElMessage.success('Menu item saved')
  dialogVisible.value = false
}
</script>

<style scoped>
.menu-list h2 {
  margin-bottom: 20px;
}
</style>