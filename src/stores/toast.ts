import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const addToast = ({
    message,
    type = 'info',
    duration = 3000,
  }: {
    message: string
    type?: Toast['type']
    duration?: number
  }) => {
    const id = Date.now().toString()
    toasts.value.push({
      id,
      message,
      type,
      duration,
    })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  watch(toasts, (newVal) => {}, { deep: true })

  return {
    toasts,
    addToast,
    removeToast,
  }
})
