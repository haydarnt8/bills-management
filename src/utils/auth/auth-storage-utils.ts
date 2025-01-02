import router from '@/router'

export const AuthStorageUtils = {
  saveAccessTokenToLocalStorage: (accessToken: string) => {
    localStorage.setItem('accessToken', JSON.stringify(accessToken))
  },
  removeAccessTokenFromLocalStorage: () => {
    localStorage.removeItem('accessToken')
  },
  getAccessTokenFromLocalStorage: (): string | null => {
    return JSON.parse(localStorage.getItem('accessToken') || 'null')
  },
  logout: () => {
    localStorage.clear()
    router.push('/login')
  },
}
