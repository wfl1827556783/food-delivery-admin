<template>
  <div class="dashboard">
    <h1>仪表板概览</h1>

    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card glass-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#409eff"><ShoppingCart /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card glass-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#67c23a"><Money /></el-icon>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.revenue }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card glass-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#e6a23c"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card glass-card">
          <div class="stat-content">
            <el-icon class="stat-icon" color="#f56c6c"><Food /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.menuItems }}</div>
              <div class="stat-label">菜单项目</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="glass-card">
          <h3>订单趋势</h3>
          <div ref="orderChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="glass-card">
          <h3>状态分布</h3>
          <div ref="statusChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Orders Table -->
    <el-card class="recent-orders glass-card">
      <h3>最近订单</h3>
      <el-table :data="recentOrders" stripe>
        <el-table-column prop="id" label="订单号" width="100" />
        <el-table-column prop="customer" label="客户名" />
        <el-table-column prop="items" label="商品" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { analyticsService } from '../api/services/analyticsService'
import { orderService } from '../api/services/orderService'

const stats = reactive({
  totalOrders: 0,
  revenue: 0,
  completed: 0,
  totalUsers: 0,
  menuItems: 0,
  avgOrder: 0
})

const recentOrders = ref([])

const mapStatus = (s) => {
  const map = {
    'Delivered': '已送达',
    'Processing': '处理中',
    'Pending': '待处理',
    'Cancelled': '已取消'
  }
  return map[s] || s
}

const orderChartRef = ref(null)
const statusChartRef = ref(null)

const getStatusType = (status) => {
  const types = {
    '已送达': 'success',
    '处理中': 'warning',
    '待处理': 'info',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

const initCharts = (trend = [], statusDistribution = {}) => {
  // Order Trends Chart
  const orderChart = echarts.init(orderChartRef.value)
  orderChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trend.map(t => t.day) },
    yAxis: { type: 'value' },
    series: [{
      data: trend.map(t => t.count),
      type: 'line',
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: { color: 'rgba(64, 158, 255, 0.2)' }
    }]
  })

  // Status Distribution Chart
  const statusChart = echarts.init(statusChartRef.value)
  const statusEntries = Object.entries(statusDistribution || {})
  statusChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: '0%' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      data: statusEntries.map(([name, value]) => ({ name, value }))
    }]
  })

  window.addEventListener('resize', () => {
    orderChart.resize()
    statusChart.resize()
  })
}

onMounted(() => {
  analyticsService.getDashboardStats().then(res => {
    if (res && typeof res === 'object') {
      stats.totalOrders = res.totalOrders ?? stats.totalOrders
      stats.revenue = res.revenue ?? stats.revenue
      stats.totalUsers = res.totalUsers ?? stats.totalUsers
      stats.menuItems = res.menuItems ?? stats.menuItems
      stats.completed = res.completed ?? stats.completed
      stats.avgOrder = res.avgOrder ?? stats.avgOrder
      recentOrders.value = (res.recentOrders || []).map(o => ({
        id: o.id,
        customer: o.customer_name || o.customer || '-',
        items: o.items,
        amount: o.total,
        status: mapStatus(o.status),
        time: o.created_at
      }))
      initCharts(res.trend || [], res.statusDistribution || {})
    }
  }).catch(() => {
    initCharts([], {})
  })

  orderService.getAllOrders().then(res => {
    if (Array.isArray(res) && recentOrders.value.length === 0) {
      recentOrders.value = res.slice(0, 5).map(o => ({
        id: o.id,
        customer: o.customer_name || o.customer || '-',
        items: o.items,
        amount: o.total,
        status: mapStatus(o.status),
        time: o.created_at || o.time || '-'
      }))
    }
  }).catch(() => {})
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
  box-shadow: 0 10px 28px rgba(0,0,0,0.28);
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
  font-weight: 700;
  color: #1f2933;
}

.stat-label {
  font-size: 14px;
  color: #4b5563;
  margin-top: 5px;
}

.charts-row {
  margin-bottom: 20px;
}

.charts-row h3 {
  margin-bottom: 15px;
  color: #e5e7eb;
}

.recent-orders h3 {
  margin-bottom: 15px;
  color: #e5e7eb;
}
</style>