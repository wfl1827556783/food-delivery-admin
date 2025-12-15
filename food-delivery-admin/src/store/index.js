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
            localStorage.setItem('userInfo', JSON.stringify(user))
        },
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.userInfo = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
        }
    }
})

export const pinia = createPinia()