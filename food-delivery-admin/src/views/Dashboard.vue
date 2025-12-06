<template>
  <div class="dashboard">
    <h1>Dashboard Overview</h1>

    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#409eff"><ShoppingCart /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">Total Orders</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#67c23a"><Money /></el-icon>
            <div class="stat-info">
              <div class="stat-value">${{ stats.revenue }}</div>
              <div class="stat-label">Revenue</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#e6a23c"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">Total Users</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#f56c6c"><Food /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.menuItems }}</div>
              <div class="stat-label">Menu Items</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card>
          <h3>Order Trends</h3>
          <div ref="orderChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <h3>Revenue by Category</h3>
          <div ref="revenueChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Orders Table -->
    <el-card class="recent-orders">
      <h3>Recent Orders</h3>
      <el-table :data="recentOrders" stripe>
        <el-table-column prop="id" label="Order ID" width="100" />
        <el-table-column prop="customer" label="Customer" />
        <el-table-column prop="items" label="Items" />
        <el-table-column prop="amount" label="Amount" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="Time" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'

const stats = reactive({
  totalOrders: 1247,
  revenue: 45280,
  totalUsers: 3456,
  menuItems: 89
})

const recentOrders = ref([
  { id: '#1234', customer: 'John Doe', items: 'Burger, Fries', amount: '$25.50', status: 'Delivered', time: '10 mins ago' },
  { id: '#1235', customer: 'Jane Smith', items: 'Pizza, Coke', amount: '$32.00', status: 'Processing', time: '15 mins ago' },
  { id: '#1236', customer: 'Bob Johnson', items: 'Salad, Juice', amount: '$18.50', status: 'Pending', time: '20 mins ago' },
  { id: '#1237', customer: 'Alice Brown', items: 'Pasta, Wine', amount: '$45.00', status: 'Delivered', time: '25 mins ago' },
  { id: '#1238', customer: 'Charlie Wilson', items: 'Sushi Set', amount: '$52.00', status: 'Cancelled', time: '30 mins ago' }
])

const orderChartRef = ref(null)
const revenueChartRef = ref(null)

const getStatusType = (status) => {
  const types = {
    'Delivered': 'success',
    'Processing': 'warning',
    'Pending': 'info',
    'Cancelled': 'danger'
  }
  return types[status] || 'info'
}

const initCharts = () => {
  // Order Trends Chart
  const orderChart = echarts.init(orderChartRef.value)
  orderChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 180, 220, 280, 250],
      type: 'line',
      smooth: true,
      itemStyle: {
        color: '#409eff'
      },
      areaStyle: {
        color: 'rgba(64, 158, 255, 0.2)'
      }
    }]
  })

  // Revenue Chart
  const revenueChart = echarts.init(revenueChartRef.value)
  revenueChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0%'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: 1048, name: 'Burgers' },
        { value: 735, name: 'Pizza' },
        { value: 580, name: 'Salads' },
        { value: 484, name: 'Drinks' },
        { value: 300, name: 'Desserts' }
      ]
    }]
  })

  // Handle window resize
  window.addEventListener('resize', () => {
    orderChart.resize()
    revenueChart.resize()
  })
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.dashboard h1 {
  margin-bottom: 20px;
  color: #303133;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.charts-row {
  margin-bottom: 20px;
}

.charts-row h3 {
  margin-bottom: 15px;
  color: #606266;
}

.recent-orders h3 {
  margin-bottom: 15px;
  color: #606266;
}
</style>