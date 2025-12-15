import axios from 'axios'
import { ElMessage } from 'element-plus'

// Vite exposes env vars via import.meta.env. Support both VITE_APP_API_URL and VITE_API_URL
const baseURL = (typeof import.meta !== 'undefined' && (import.meta.env.VITE_APP_API_URL || import.meta.env.VITE_API_URL)) || 'http://localhost:3000/api'

const apiClient = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
apiClient.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.message || '请求失败'

            // 登录后有些接口可能返回 500，为避免干扰用户体验，此处不弹出“服务器错误”提示
            // 仅在需要重新登录时清理 token 并跳转
            if (status === 401) {
                ElMessage.error('未授权，请重新登录')
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default apiClient