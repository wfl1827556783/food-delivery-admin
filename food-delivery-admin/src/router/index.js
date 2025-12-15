import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, roles: ['Admin', 'Driver', 'Customer'] }
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users/UserList.vue'),
        meta: { requiresAuth: true, roles: ['Admin'] }
    },
    {
        path: '/drivers',
        name: 'Drivers',
        component: () => import('../views/Users/DriverList.vue'),
        meta: { requiresAuth: true, roles: ['Admin'] }
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders/OrderList.vue'),
        meta: { requiresAuth: true, roles: ['Admin', 'Driver', 'Customer'] }
    },
    {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/Menu/MenuList.vue'),
        meta: { requiresAuth: true, roles: ['Admin', 'Customer'] }
    },
    {
        path: '/banners',
        name: 'Banners',
        component: () => import('../views/Banners/BannerList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/analytics',
        name: 'Analytics',
        component: () => import('../views/Analytics/Analytics.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const rawUser = localStorage.getItem('userInfo')
    const user = rawUser ? JSON.parse(rawUser) : null
    const role = user?.role

    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }

    if (to.meta.roles && Array.isArray(to.meta.roles)) {
        if (!role || !to.meta.roles.includes(role)) {
            // 无权限访问时跳转首页
            return next('/')
        }
    }

    // 非管理员访问仪表盘时重定向到各自主页
    if (to.path === '/' || to.name === 'Dashboard') {
        if (role === 'Customer') return next('/menu')
        if (role === 'Driver') return next('/orders')
    }

        next()
})

export default router