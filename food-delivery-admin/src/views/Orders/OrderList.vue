<template>
  <div class="order-list">
    <h2>Order Management</h2>
    <el-card>
      <el-table :data="orders">
        <el-table-column prop="id" label="Order ID" width="100" />
        <el-table-column prop="customer" label="Customer" />
        <el-table-column prop="items" label="Items" />
        <el-table-column prop="amount" label="Amount" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-select v-model="row.status" size="small" @change="updateStatus(row)">
              <el-option label="Pending" value="Pending" />
              <el-option label="Processing" value="Processing" />
              <el-option label="Delivered" value="Delivered" />
              <el-option label="Cancelled" value="Cancelled" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="Time" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const orders = ref([
  { id: '#1234', customer: 'John Doe', items: 'Burger, Fries', amount: '$25.50', status: 'Delivered', time: '10 mins ago' },
  { id: '#1235', customer: 'Jane Smith', items: 'Pizza, Coke', amount: '$32.00', status: 'Processing', time: '15 mins ago' },
  { id: '#1236', customer: 'Bob Johnson', items: 'Salad, Juice', amount: '$18.50', status: 'Pending', time: '20 mins ago' }
])

const updateStatus = (order) => {
  ElMessage.success(`Order ${order.id} status updated to ${order.status}`)
}
</script>

<style scoped>
.order-list h2 {
  margin-bottom: 20px;
}
</style>