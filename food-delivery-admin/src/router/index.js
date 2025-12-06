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
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'Users',
        component: () => import('../views/Users/UserList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/drivers',
        name: 'Drivers',
        component: () => import('../views/Users/DriverList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('../views/Orders/OrderList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/menu',
        name: 'Menu',
        component: () => import('../views/Menu/MenuList.vue'),
        meta: { requiresAuth: true }
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
    const isAuthenticated = localStorage.getItem('token')
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router