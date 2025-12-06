import { ElLoading } from 'element-plus'

let loadingInstance = null

export const showLoading = (text = 'Loading...') => {
    loadingInstance = ElLoading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export const hideLoading = () => {
    if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
    }
}