import { createPinia } from 'pinia'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null,
        token: localStorage.getItem('token') || null
    }),
    actions: {
        setUser(user) {
            this.userInfo = user
        },
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.userInfo = null
            this.token = null
            localStorage.removeItem('token')
        }
    }
})

export const pinia = createPinia()