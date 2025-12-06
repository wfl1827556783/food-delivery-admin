import axios from 'axios'
import { ElMessage } from 'element-plus'

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Change this to your actual API endpoint
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    ElMessage.error('Unauthorized. Please login again.')
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                    break
                case 403:
                    ElMessage.error('Access denied')
                    break
                case 404:
                    ElMessage.error('Resource not found')
                    break
                case 500:
                    ElMessage.error('Server error')
                    break
                default:
                    ElMessage.error(error.response.data.message || 'An error occurred')
            }
        } else {
            ElMessage.error('Network error')
        }
        return Promise.reject(error)
    }
)

// API methods
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout')
}

export const userAPI = {
    getList: (params) => apiClient.get('/users', { params }),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`)
}

export const orderAPI = {
    getList: (params) => apiClient.get('/orders', { params }),
    getById: (id) => apiClient.get(`/orders/${id}`),
    updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status })
}

export const menuAPI = {
    getList: (params) => apiClient.get('/menu', { params }),
    create: (data) => apiClient.post('/menu', data),
    update: (id, data) => apiClient.put(`/menu/${id}`, data),
    delete: (id) => apiClient.delete(`/menu/${id}`)
}

export const analyticsAPI = {
    getDashboard: () => apiClient.get('/analytics/dashboard'),
    getRevenue: (params) => apiClient.get('/analytics/revenue', { params })
}

export default apiClient