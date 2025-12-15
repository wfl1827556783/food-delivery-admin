<template>
  <div class="menu-list">
    <div class="header-row">
      <h2>{{ isAdmin ? '菜单管理' : '点餐菜单' }}</h2>
      <div v-if="isAdmin">
        <el-button type="primary" @click="dialogVisible = true">
          <el-icon><Plus /></el-icon> 添加菜单项
        </el-button>
      </div>
    </div>

    <!-- 管理视图（管理员） -->
    <el-card v-if="isAdmin" class="glass-card">
      <el-table :data="menuItems" style="margin-top: 20px;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-switch v-model="row.available" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editItem(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点餐视图（普通用户） -->
    <div v-else class="customer-view">
      <el-card v-if="banners.length" class="banner-card glass-card" shadow="never">
        <el-carousel :interval="4000" type="card" height="240px">
          <el-carousel-item v-for="item in banners" :key="item.id">
            <div class="banner-item" @click="openBanner(item.link)">
              <img :src="item.image" alt="" />
              <div class="banner-caption">
                <div class="banner-title">{{ item.title }}</div>
                <div class="banner-desc" v-if="item.description">{{ item.description }}</div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-card>

      <el-row :gutter="16">
        <el-col v-for="item in availableMenu" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card shadow="hover" class="menu-card">
            <div class="menu-card__title">{{ item.name }}</div>
            <div class="menu-card__meta">{{ item.category || '未分类' }}</div>
            <div class="menu-card__price">¥ {{ Number(item.price || 0).toFixed(2) }}</div>
            <el-button type="primary" size="small" :disabled="!item.available" @click="addToCart(item)">
              加入购物车
            </el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="cart-card glass-card" v-if="cart.length">
        <div class="cart-header">购物车</div>
        <el-table :data="cart" size="small">
          <el-table-column prop="name" label="商品" />
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">¥ {{ Number(row.price || 0).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="数量" width="140">
            <template #default="{ row }">
              <el-input-number v-model="row.qty" :min="1" :max="99" size="small" @change="updateQty(row)" />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">¥ {{ (Number(row.price || 0) * row.qty).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button link type="danger" size="small" @click="removeFromCart(row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="cart-footer">
          <div class="cart-total">合计：¥ {{ totalPrice.toFixed(2) }}</div>
          <el-button type="primary" :disabled="cart.length === 0" @click="submitOrder">提交订单</el-button>
        </div>
      </el-card>
      <el-empty v-else description="购物车空空如也，先去加点东西吧" />
    </div>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" title="添加菜单项" width="500px">
      <el-form :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category">
            <el-option label="汉堡" value="Burgers" />
            <el-option label="披萨" value="Pizza" />
            <el-option label="沙拉" value="Salads" />
            <el-option label="饮料" value="Drinks" />
            <el-option label="其它" value="Other" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveItem">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { menuService } from '../../api/services/menuService'
import { orderService } from '../../api/services/orderService'
import { useUserStore } from '../../store'
import { bannerService } from '../../api/services/bannerService'

const userStore = useUserStore()
const role = computed(() => userStore.userInfo?.role)
const isAdmin = computed(() => role.value === 'Admin')
const isCustomer = computed(() => role.value === 'Customer')

const dialogVisible = ref(false)
const form = ref({
  name: '',
  category: 'Burgers',
  price: 0
})

const menuItems = ref([])
const cart = ref([])
const banners = ref([])

const availableMenu = computed(() =>
  menuItems.value.filter(item => item.available !== false)
)

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + Number(item.price || 0) * item.qty, 0)
)

const loadMenu = () => {
  menuService.getAllMenuItems().then(res => {
    if (Array.isArray(res)) menuItems.value = res
  }).catch(() => {
    ElMessage.error('加载菜单失败')
  })
}

const loadBanners = () => {
  bannerService.getAllBanners().then(res => {
    if (Array.isArray(res)) {
      banners.value = res.filter(b => b.active !== false)
    }
  }).catch(() => {
    // 轮播获取失败时不阻断页面
  })
}

onMounted(() => loadMenu())
onMounted(() => loadBanners())

const editItem = (item) => {
  form.value = { ...item }
  dialogVisible.value = true
}

const deleteItem = (item) => {
  ElMessageBox.confirm('确定要删除该菜单项吗?', '警告', {
    type: 'warning'
  }).then(() => {
    menuService.deleteMenuItem(item.id).then(() => {
      menuItems.value = menuItems.value.filter(i => i.id !== item.id)
      ElMessage.success('菜单项已删除')
    }).catch(() => ElMessage.error('删除失败'))
  })
}

const toggleStatus = (item) => {
  menuService.toggleMenuItemStatus(item.id, item.available).then(() => {
    ElMessage.success(`${item.name} 状态已更新`)
  }).catch(() => ElMessage.error('更新状态失败'))
}

const saveItem = () => {
  if (form.value.id) {
    menuService.updateMenuItem(form.value.id, form.value).then(() => {
      ElMessage.success('菜单项已更新')
      dialogVisible.value = false
      loadMenu()
    }).catch(() => ElMessage.error('保存失败'))
  } else {
    menuService.createMenuItem(form.value).then(() => {
      ElMessage.success('菜单项已创建')
      dialogVisible.value = false
      loadMenu()
    }).catch(() => ElMessage.error('创建失败'))
  }
}

// 购物车相关
const addToCart = (item) => {
  const exists = cart.value.find(i => i.id === item.id)
  if (exists) {
    exists.qty += 1
  } else {
    cart.value.push({ ...item, qty: 1 })
  }
}

const updateQty = (row) => {
  if (row.qty <= 0) {
    cart.value = cart.value.filter(i => i.id !== row.id)
  }
}

const removeFromCart = (row) => {
  cart.value = cart.value.filter(i => i.id !== row.id)
}

const submitOrder = () => {
  if (!cart.value.length) return
  const items = cart.value.flatMap(i => Array(i.qty).fill(i.name))
  const total = totalPrice.value
  orderService.createOrder({ items, total }).then(() => {
    ElMessage.success('下单成功')
    cart.value = []
  }).catch(err => {
    ElMessage.error(err?.response?.data?.message || '下单失败')
  })
}

const openBanner = (link) => {
  if (link) window.open(link, '_blank')
}
</script>

<style scoped>
.menu-list h2 {
  margin-bottom: 20px;
  color: #e5e7eb;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.customer-view {
  margin-top: 8px;
}

.banner-card {
  margin-bottom: 16px;
}

.banner-item {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.55));
  color: #fff;
}

.banner-title {
  font-weight: 700;
  font-size: 16px;
}

.banner-desc {
  font-size: 13px;
  margin-top: 4px;
  opacity: 0.9;
}

.menu-card {
  margin-bottom: 16px;
}

.menu-card__title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
}

.menu-card__meta {
  color: #666;
  margin-bottom: 6px;
}

.menu-card__price {
  color: #f56c6c;
  font-weight: 600;
  margin-bottom: 10px;
}

.cart-card {
  margin-top: 12px;
}

.cart-header {
  font-weight: 600;
  margin-bottom: 8px;
}

.cart-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-total {
  font-weight: 700;
  color: #333;
}
</style>