<template>
  <div class="banner-list">
    <h2>Banner Management</h2>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> Add Banner
      </el-button>

      <el-table :data="banners" style="margin-top: 20px;">
        <el-table-column label="Preview" width="150">
          <template #default="{ row }">
            <el-image :src="row.image" style="width: 120px; height: 60px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="description" label="Description" />
        <el-table-column prop="position" label="Position" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-switch v-model="row.active" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editBanner(row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteBanner(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="Add Banner" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="Image URL">
          <el-input v-model="form.image" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="Position">
          <el-select v-model="form.position">
            <el-option label="Home Top" value="Home Top" />
            <el-option label="Home Middle" value="Home Middle" />
            <el-option label="Category Page" value="Category Page" />
          </el-select>
        </el-form-item>
        <el-form-item label="Link URL">
          <el-input v-model="form.link" placeholder="https://..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveBanner">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const form = ref({
  title: '',
  description: '',
  image: '',
  position: 'Home Top',
  link: ''
})

const banners = ref([
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get 20% off on all orders',
    image: 'https://via.placeholder.com/400x200/409eff/ffffff?text=Summer+Sale',
    position: 'Home Top',
    active: true
  },
  {
    id: 2,
    title: 'New Menu Items',
    description: 'Try our new dishes',
    image: 'https://via.placeholder.com/400x200/67c23a/ffffff?text=New+Menu',
    position: 'Home Middle',
    active: true
  }
])

const editBanner = (banner) => {
  form.value = { ...banner }
  dialogVisible.value = true
}

const deleteBanner = (banner) => {
  ElMessageBox.confirm('Delete this banner?', 'Warning', {
    type: 'warning'
  }).then(() => {
    banners.value = banners.value.filter(b => b.id !== banner.id)
    ElMessage.success('Banner deleted')
  })
}

const toggleStatus = (banner) => {
  ElMessage.success(`Banner ${banner.active ? 'activated' : 'deactivated'}`)
}

const saveBanner = () => {
  ElMessage.success('Banner saved')
  dialogVisible.value = false
}
</script>

<style scoped>
.banner-list h2 {
  margin-bottom: 20px;
}
</style>