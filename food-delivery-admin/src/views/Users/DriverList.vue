<template>
  <div class="driver-list">
    <h2>Driver Management</h2>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> Add Driver
      </el-button>

      <el-table :data="drivers" style="margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="vehicle" label="Vehicle" />
        <el-table-column prop="deliveries" label="Total Deliveries" />
        <el-table-column prop="rating" label="Rating">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetails(row)">Details</el-button>
            <el-button size="small" type="danger" @click="deleteDriver(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add Driver Dialog -->
    <el-dialog v-model="dialogVisible" title="Add Driver" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="Vehicle">
          <el-input v-model="form.vehicle" placeholder="e.g., Motorcycle, Car" />
        </el-form-item>
        <el-form-item label="License">
          <el-input v-model="form.license" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveDriver">Save</el-button>
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
  phone: '',
  vehicle: '',
  license: ''
})

const drivers = ref([
  { id: 1, name: 'Mike Johnson', phone: '555-0101', vehicle: 'Motorcycle', deliveries: 156, rating: 4.9, status: 'Active' },
  { id: 2, name: 'Sarah Lee', phone: '555-0102', vehicle: 'Car', deliveries: 142, rating: 4.8, status: 'Active' },
  { id: 3, name: 'David Chen', phone: '555-0103', vehicle: 'Motorcycle', deliveries: 138, rating: 4.7, status: 'Offline' }
])

const getStatusType = (status) => {
  const types = {
    'Active': 'success',
    'Offline': 'info',
    'Suspended': 'danger'
  }
  return types[status] || 'info'
}

const viewDetails = (driver) => {
  ElMessage.info(`Viewing details for ${driver.name}`)
}

const deleteDriver = (driver) => {
  ElMessageBox.confirm('Delete this driver?', 'Warning', {
    type: 'warning'
  }).then(() => {
    drivers.value = drivers.value.filter(d => d.id !== driver.id)
    ElMessage.success('Driver deleted')
  })
}

const saveDriver = () => {
  ElMessage.success('Driver added successfully')
  dialogVisible.value = false
}
</script>

<style scoped>
.driver-list h2 {
  margin-bottom: 20px;
}
</style>