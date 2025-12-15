<template>
  <div class="analytics">
    <h2>数据分析与报告</h2>

    <!-- Date Range Picker -->
    <el-card class="filter-card glass-card">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchAnalytics"
      />
      <el-button type="primary" style="margin-left: 10px;" @click="exportReport">
        <el-icon><Download /></el-icon> 导出报告
      </el-button>
    </el-card>

    <!-- KPI Cards -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="6">
        <el-card class="kpi-card glass-card">
          <el-statistic title="总收入" :value="analytics.revenue" prefix="¥" />
          <div class="trend">
            <el-icon color="#67c23a"><CaretTop /></el-icon>
            <span class="trend-text">+12.5%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card glass-card">
          <el-statistic title="已完成订单" :value="analytics.ordersCompleted" />
          <div class="trend">
            <el-icon color="#67c23a"><CaretTop /></el-icon>
            <span class="trend-text">+8.3%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card glass-card">
          <el-statistic title="平均订单价值" :value="analytics.avgOrderValue" prefix="¥" />
          <div class="trend">
            <el-icon color="#f56c6c"><CaretBottom /></el-icon>
            <span class="trend-text">-2.1%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="kpi-card glass-card">
          <el-statistic title="客户满意度" :value="analytics.satisfaction" suffix="%" />
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
        <el-card class="glass-card">
          <h3>收入趋势（最近30天）</h3>
          <div ref="revenueTrendRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="glass-card">
          <h3>订单状态分布</h3>
          <div ref="orderStatusRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="glass-card">
          <h3>热卖商品排行</h3>
          <div ref="topItemsRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="glass-card">
          <h3>高峰时段分析</h3>
          <div ref="peakHoursRef" style="width: 100%; height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Top Performers Table -->
    <el-card class="performers-card glass-card">
      <h3>优秀司机排行</h3>
      <el-table :data="topDrivers">
        <el-table-column prop="rank" label="排名" width="80" />
        <el-table-column prop="name" label="司机姓名" />
        <el-table-column prop="deliveries" label="配送数" />
        <el-table-column prop="rating" label="评分">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="earnings" label="收入" />
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
  { rank: 1, name: '张三', deliveries: 156, rating: 4.9, earnings: '¥3,420' },
  { rank: 2, name: '李四', deliveries: 142, rating: 4.8, earnings: '¥3,120' },
  { rank: 3, name: '王五', deliveries: 138, rating: 4.7, earnings: '¥3,050' }
])

const revenueTrendRef = ref(null)
const orderStatusRef = ref(null)
const topItemsRef = ref(null)
const peakHoursRef = ref(null)

const fetchAnalytics = () => {
  ElMessage.success('数据已更新')
}

const exportReport = () => {
  ElMessage.success('报告导出成功')
}

const initCharts = () => {
  // Revenue Trend Chart
  const revenueTrend = echarts.init(revenueTrendRef.value)
  revenueTrend.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['第1周', '第2周', '第3周', '第4周']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [8500, 10200, 12400, 14180],
      type: 'bar',
      itemStyle: { color: '#409eff' },
      label: {
        show: true,
        position: 'top',
        formatter: '¥{c}'
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
        { value: 856, name: '已送达', itemStyle: { color: '#67c23a' } },
        { value: 234, name: '处理中', itemStyle: { color: '#e6a23c' } },
        { value: 98, name: '待处理', itemStyle: { color: '#909399' } },
        { value: 59, name: '已取消', itemStyle: { color: '#f56c6c' } }
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
      data: ['经典汉堡', '玛格丽特披萨', '凯撒沙拉', '鸡翅', '薯条']
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
  margin-bottom: 16px;
  color: #e5e7eb;
}

.filter-card {
  margin-bottom: 16px;
}

.kpi-row {
  margin-bottom: 16px;
}

.kpi-card {
  text-align: center;
}

.trend {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.trend-text {
  font-size: 12px;
  font-weight: 600;
  color: #c7f9cc;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-row h3,
.performers-card h3 {
  margin-bottom: 12px;
  color: #e5e7eb;
}

.performers-card {
  margin-top: 12px;
}
</style>