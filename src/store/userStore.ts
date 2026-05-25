import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { wechatLogin } from '@/api/auth'
import { clearSessionState, getCurrentUser, setCurrentUser, subscribeUser } from '@/store/sessionStore'

export function useUserStore() {
  const [, setVersion] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const listener = () => setVersion((value) => value + 1)
    return subscribeUser(listener)
  }, [])

  async function login() {
    setLoading(true)
    try {
      const result = await wechatLogin()
      Taro.setStorageSync('token', result.token)
      setCurrentUser(result.user)
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch (error) {
      clearSessionState()
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    clearSessionState()
  }

  return {
    user: getCurrentUser(),
    loading,
    isLoggedIn: Boolean(getCurrentUser()),
    login,
    logout
  }
}
