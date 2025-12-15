<template>
  <div class="order-list">
    <h2>{{ isDriver ? '接单派送' : '订单管理' }}</h2>

    <el-alert
        v-if="isCustomer"
        type="info"
        :closable="false"
        show-icon
        class="info-tip"
        title="请在“点餐菜单”页面添加商品后提交订单，这里仅展示您的订单进度。"
    >
      <template #default>
        <el-link type="primary" @click="goMenu">去点餐菜单</el-link>
      </template>
    </el-alert>

    <el-card class="glass-card">
      <el-table :data="orders" :empty-text="emptyText">
        <el-table-column prop="id" label="订单号" width="100" />
        <el-table-column prop="customer_name" label="客户" />
        <el-table-column prop="itemsText" label="商品" />
        <el-table-column prop="total" label="金额" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <template v-if="canEditStatus && isAdmin">
              <el-select v-model="row.status" size="small" @change="updateStatus(row)">
                <el-option label="待处理" value="Pending" />
                <el-option label="处理中" value="Processing" />
                <el-option label="已送达" value="Delivered" />
                <el-option label="已取消" value="Cancelled" />
              </el-select>
            </template>
            <template v-else>
              <el-tag size="small">{{ row.status }}</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" />
        <el-table-column v-if="isAdmin" prop="driver_id" label="配送员ID" width="100" />
        <el-table-column v-if="isDriver" label="操作" width="240">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                size="small"
                type="primary"
                plain
                :disabled="!canTake(row)"
                @click="acceptOrder(row)"
              >接单</el-button>
              <el-button
                size="small"
                type="success"
                plain
                :disabled="!canDeliver(row)"
                @click="markDelivered(row)"
              >送达</el-button>
              <el-button
                size="small"
                type="warning"
                plain
                :disabled="!canFail(row)"
                @click="markFailed(row)"
              >无法派送</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { orderService } from '../../api/services/orderService'
import { useUserStore } from '../../store'

const orders = ref([])

const router = useRouter()
const userStore = useUserStore()
const role = computed(() => userStore.userInfo?.role)
const userId = computed(() => userStore.userInfo?.id)
const isAdmin = computed(() => role.value === 'Admin')
const isDriver = computed(() => role.value === 'Driver')
const isCustomer = computed(() => role.value === 'Customer')
const canEditStatus = computed(() => isAdmin.value || isDriver.value)
const emptyText = computed(() => (isDriver.value ? '暂无可接订单' : '暂无订单'))

const loadOrders = () => {
  orderService.getAllOrders().then(res => {
    if (Array.isArray(res)) {
      orders.value = res.map(o => ({
        ...o,
        itemsText: Array.isArray(o.items) ? o.items.join(', ') : (() => {
          try {
            const arr = typeof o.items === 'string' ? JSON.parse(o.items) : []
            return Array.isArray(arr) ? arr.join(', ') : ''
          } catch {
            return ''
          }
        })()
      }))
    }
  }).catch(err => {
    ElMessage.error('加载订单失败')
    console.error(err)
  })
}

onMounted(() => {
  loadOrders()
})

const updateStatus = (order) => {
  orderService.updateOrderStatus(order.id, order.status).then(() => {
    ElMessage.success(`订单 ${order.id} 状态已更新为 ${order.status}`)
  }).catch(() => {
    ElMessage.error('更新状态失败')
  })
}

// 接单：仅待处理；送达：仅处理中；取消/失败：处理中或待处理
const canTake = (row) => isDriver.value && row.status === 'Pending'
const canDeliver = (row) => isDriver.value && row.status === 'Processing'
const canFail = (row) => isDriver.value && ['Pending', 'Processing'].includes(row.status)

const acceptOrder = (row) => {
  orderService.updateOrderStatus(row.id, 'Processing').then(() => {
    ElMessage.success(`已接单 #${row.id}`)
    loadOrders()
  }).catch(() => ElMessage.error('接单失败'))
}

const markDelivered = (row) => {
  orderService.updateOrderStatus(row.id, 'Delivered').then(() => {
    ElMessage.success(`订单 #${row.id} 已送达`)
    loadOrders()
  }).catch(() => ElMessage.error('更新失败'))
}

const markFailed = (row) => {
  orderService.updateOrderStatus(row.id, 'Cancelled').then(() => {
    ElMessage.success(`订单 #${row.id} 已标记无法派送/取消`)
    loadOrders()
  }).catch(() => ElMessage.error('更新失败'))
}

const goMenu = () => router.push('/menu')
</script>

<style scoped>
.order-list h2 {
  margin-bottom: 20px;
  color: #e5e7eb;
}

.info-tip {
  margin-bottom: 12px;
}

.action-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>