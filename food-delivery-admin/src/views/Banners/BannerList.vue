<template>
  <div class="banner-list">
    <h2>轮播图管理</h2>
    <el-card class="glass-card">
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon> 添加轮播图
      </el-button>

      <el-table :data="banners" style="margin-top: 20px;">
        <el-table-column label="预览" width="150">
          <template #default="{ row }">
            <el-image :src="row.image" style="width: 120px; height: 60px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="position" label="位置" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.active" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editBanner(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteBanner(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="添加轮播图" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="form.image" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="form.position">
            <el-option label="首页顶部" value="Home Top" />
            <el-option label="首页中部" value="Home Middle" />
            <el-option label="分类页面" value="Category Page" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接URL">
          <el-input v-model="form.link" placeholder="https://..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBanner">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bannerService } from '../../api/services/bannerService'

const dialogVisible = ref(false)
const form = ref({
  title: '',
  description: '',
  image: '',
  position: 'Home Top',
  link: ''
})

const banners = ref([])

const loadBanners = () => {
  bannerService.getAllBanners().then(res => {
    if (Array.isArray(res)) banners.value = res
  }).catch(() => ElMessage.error('加载轮播图失败'))
}

onMounted(() => loadBanners())

const editBanner = (banner) => {
  form.value = { ...banner }
  dialogVisible.value = true
}

const deleteBanner = (banner) => {
  ElMessageBox.confirm('确定要删除该轮播图吗?', '警告', {
    type: 'warning'
  }).then(() => {
    // 若后端支持删除接口则调用，否则仅从本地移除
    bannerService.deleteBanner(banner.id).then(() => {
      banners.value = banners.value.filter(b => b.id !== banner.id)
      ElMessage.success('轮播图已删除')
    }).catch(() => {
      // 兜底：本地删除
      banners.value = banners.value.filter(b => b.id !== banner.id)
      ElMessage.success('轮播图已删除（本地）')
    })
  })
}

const toggleStatus = (banner) => {
  bannerService.toggleBannerStatus(banner.id, banner.active).then(() => {
    ElMessage.success(`轮播图${banner.active ? '已激活' : '已停用'}`)
  }).catch(() => ElMessage.error('更新状态失败'))
}

const saveBanner = () => {
  if (form.value.id) {
    bannerService.updateBanner(form.value.id, form.value).then(() => {
      ElMessage.success('轮播图已更新')
      dialogVisible.value = false
      loadBanners()
    }).catch(() => ElMessage.error('更新失败'))
  } else {
    bannerService.createBanner(form.value).then(() => {
      ElMessage.success('轮播图已创建')
      dialogVisible.value = false
      loadBanners()
    }).catch(() => ElMessage.error('创建失败'))
  }
}
</script>

<style scoped>
.banner-list h2 {
  margin-bottom: 20px;
  color: #e5e7eb;
}
</style>