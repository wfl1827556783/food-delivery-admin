<template>
  <div class="driver-list">
    <h2>配送员管理</h2>
    <el-card class="glass-card">
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> 添加配送员
      </el-button>

      <el-table :data="drivers" style="margin-top: 20px;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="vehicle" label="车型" />
        <el-table-column prop="deliveries" label="总配送数" />
        <el-table-column prop="rating" label="评分">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetails(row)">详情</el-button>
            <el-button size="small" type="danger" @click="deleteDriver(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add Driver Dialog -->
        <el-dialog v-model="dialogVisible" title="添加配送员" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="form.vehicle" placeholder="如: 摩托车, 汽车" />
        </el-form-item>
        <el-form-item label="证件">
          <el-input v-model="form.license" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDriver">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { driverService } from '../../api/services/driverService'

const dialogVisible = ref(false)
const form = ref({
  name: '',
  phone: '',
  vehicle: '',
  license: ''
})

const drivers = ref([])

const loadDrivers = () => {
  driverService.getAllDrivers().then(res => {
    if (Array.isArray(res)) drivers.value = res
  }).catch(() => ElMessage.error('加载司机失败'))
}

onMounted(() => loadDrivers())

const getStatusType = (status) => {
  const types = {
    'Active': 'success',
    'Online': 'success',
    '离线': 'info',
    'Offline': 'info',
    'Suspended': 'danger',
    '已停用': 'danger'
  }
  return types[status] || 'info'
}

const viewDetails = (driver) => {
  ElMessage.info(`查看 ${driver.name} 的详情`)
}

const deleteDriver = (driver) => {
  ElMessageBox.confirm('确定要删除该司机吗?', '警告', {
    type: 'warning'
  }).then(() => {
    driverService.deleteDriver(driver.id).then(() => {
      drivers.value = drivers.value.filter(d => d.id !== driver.id)
      ElMessage.success('司机已删除')
    }).catch(() => ElMessage.error('删除失败'))
  })
}

const saveDriver = () => {
  const payload = { ...form.value }
  driverService.createDriver(payload).then(() => {
    ElMessage.success('司机已添加')
    dialogVisible.value = false
    form.value = { name: '', phone: '', vehicle: '', license: '' }
    loadDrivers()
  }).catch(() => ElMessage.error('添加司机失败'))
}
</script>

<style scoped>
.driver-list h2 {
  margin-bottom: 20px;
  color: #e5e7eb;
}
</style>