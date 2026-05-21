import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { wechatLogin } from '@/api/auth'
import type { UserProfile } from '@/types/news'
import { getStorage, setStorage } from '@/utils/storage'

const USER_KEY = 'user_profile'

let user = getStorage<UserProfile | null>(USER_KEY, null)
const listeners = new Set<() => void>()

function emit() {
  setStorage(USER_KEY, user)
  listeners.forEach((listener) => listener())
}

export function useUserStore() {
  const [, setVersion] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const listener = () => setVersion((value) => value + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  async function login() {
    setLoading(true)
    try {
      const result = await wechatLogin()
      Taro.setStorageSync('token', result.token)
      user = result.user
      emit()
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch (error) {
      Taro.removeStorageSync('token')
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    user = null
    Taro.removeStorageSync('token')
    emit()
  }

  return {
    user,
    loading,
    isLoggedIn: Boolean(user),
    login,
    logout
  }
}
