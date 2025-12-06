<template>
  <div class="analytics">
    <h2>Analytics & Reports</h2>

    <!-- Date Range Picker -->
    <el-card class="filter-card">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="fetchAnalytics"
      />
      <el-button type="primary" style="margin-left: 10px;" @click="exportReport">
        <el-icon><Download /></el-icon> Export Report
      </el-button>
    </el-card>

    <!-- KPI Cards -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6">
        <el-card class="kpi-card">
          <el-statistic title="Total Revenue" :value="analytics.revenue" prefix="$" />
          <div class="trend">
            <el-icon color="#67c23a"><CaretTop /></el-icon>
            <span class="trend-text">+12.5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <el-statistic title="Orders Completed" :value="analytics.ordersCompleted" />
          <div class="trend">
            <el-icon color="#67c23a"><CaretTop /></el-icon>
            <span class="trend-text">+8.3%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <el-statistic title="Average Order Value" :value="analytics.avgOrderValue" prefix="$" />
          <div class="trend">
            <el-icon color="#f56c6c"><CaretBottom /></el-icon>
            <span class="trend-text">-2.1%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card">
          <el-statistic title="Customer Satisfaction" :value="analytics.satisfaction" suffix="%" />
          <div class="trend">
            <el-icon color="#67c23a"><CaretTop /></el-icon>
            <span class="trend-text">+5.2%</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card>
          <h3>Revenue Trend (Last 30 Days)</h3>
          <div ref="revenueTrendRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <h3>Order Status Distribution</h3>
          <div ref="orderStatusRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <h3>Top Selling Items</h3>
          <div ref="topItemsRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h3>Peak Hours Analysis</h3>
          <div ref="peakHoursRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Top Performers Table -->
    <el-card class="performers-card">
      <h3>Top Performing Drivers</h3>
      <el-table :data="topDrivers">
        <el-table-column prop="rank" label="Rank" width="80" />
        <el-table-column prop="name" label="Driver Name" />
        <el-table-column prop="deliveries" label="Deliveries" />
        <el-table-column prop="rating" label="Rating">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="earnings" label="Earnings" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const analytics = ref({
  revenue: 45280,
  ordersCompleted: 1247,
  avgOrderValue: 36.32,
  satisfaction: 94
})

const topDrivers = ref([
  { rank: 1, name: 'Mike Johnson', deliveries: 156, rating: 4.9, earnings: '$3,420' },
  { rank: 2, name: 'Sarah Lee', deliveries: 142, rating: 4.8, earnings: '$3,120' },
  { rank: 3, name: 'David Chen', deliveries: 138, rating: 4.7, earnings: '$3,050' }
])

const revenueTrendRef = ref(null)
const orderStatusRef = ref(null)
const topItemsRef = ref(null)
const peakHoursRef = ref(null)

const fetchAnalytics = () => {
  ElMessage.success('Analytics updated')
}

const exportReport = () => {
  ElMessage.success('Report exported successfully')
}

const initCharts = () => {
  // Revenue Trend Chart
  const revenueTrend = echarts.init(revenueTrendRef.value)
  revenueTrend.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [8500, 10200, 12400, 14180],
      type: 'bar',
      itemStyle: { color: '#409eff' },
      label: {
        show: true,
        position: 'top',
        formatter: '${c}'
      }
    }]
  })

  // Order Status Chart
  const orderStatus = echarts.init(orderStatusRef.value)
  orderStatus.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: [
        { value: 856, name: 'Delivered', itemStyle: { color: '#67c23a' } },
        { value: 234, name: 'Processing', itemStyle: { color: '#e6a23c' } },
        { value: 98, name: 'Pending', itemStyle: { color: '#909399' } },
        { value: 59, name: 'Cancelled', itemStyle: { color: '#f56c6c' } }
      ],
      label: {
        formatter: '{b}: {c} ({d}%)'
      }
    }]
  })

  // Top Items Chart
  const topItems = echarts.init(topItemsRef.value)
  topItems.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Classic Burger', 'Margherita Pizza', 'Caesar Salad', 'Chicken Wings', 'French Fries']
    },
    series: [{
      type: 'bar',
      data: [320, 280, 245, 210, 195],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }]
  })

  // Peak Hours Chart
  const peakHours = echarts.init(peakHoursRef.value)
  peakHours.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [45, 78, 156, 98, 67, 189, 234, 123],
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0)' }
        ])
      },
      itemStyle: { color: '#67c23a' }
    }]
  })

  window.addEventListener('resize', () => {
    revenueTrend.resize()
    orderStatus.resize()
    topItems.resize()
    peakHours.resize()
  })
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.analytics h2 {
  margin-bottom: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.kpi-row {
  margin-bottom: 20px;
}

.kpi-card {
  text-align: center;
}

.trend {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.trend-text {
  font-size: 14px;
  font-weight: bold;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-row h3,
.performers-card h3 {
  margin-bottom: 15px;
  color: #606266;
}

.performers-card {
  margin-top: 20px;
}
</style>