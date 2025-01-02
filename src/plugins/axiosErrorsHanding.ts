import type { AxiosError, AxiosResponse } from 'axios'
import { useToastStore } from '@/stores/toast'
import { AuthStorageUtils } from '@/utils/auth/auth-storage-utils'

function errorResponseHandler(response: AxiosResponse): AxiosResponse {
  return response
}

function errorResponseRejectHandler(error: AxiosError) {
  if (error.code === 'ERR_CANCELED') return

  const toastStore = useToastStore()

  if (error.response?.status === 401) {
    toastStore.addToast({
      message: 'Unauthorized : Please login again',
      type: 'error',
    })
    AuthStorageUtils.logout()
  } else if (error.response?.status === 400) {
    toastStore.addToast({
      message: `${error.response?.data?.error?.message ?? 'Bad Request'}`,
      type: 'error',
    })
  } else if (error.response?.status === 403) {
    toastStore.addToast({
      message: `${error.response.data?.error?.message ?? 'Forbidden'}`,
      type: 'error',
    })
  } else if (error.response?.status === 404) {
    toastStore.addToast({
      message: `${error.response.data?.error?.message ?? 'Not Found'}`,
      type: 'error',
    })
  } else if (error.response?.status === 500) {
    toastStore.addToast({ message: 'Internal Server Error', type: 'error' })
  } else {
    toastStore.addToast({ message: error.message, type: 'error' })
  }

  return Promise.reject(error)
}
export { errorResponseRejectHandler, errorResponseHandler }
