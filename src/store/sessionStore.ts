import Taro from '@tarojs/taro'
import { clearFavoriteIds } from '@/store/favoriteStore'
import { clearReadIds } from '@/store/newsStore'
import type { UserProfile } from '@/types/news'
import { getStorage, setStorage } from '@/utils/storage'

const USER_KEY = 'user_profile'

let user = getStorage<UserProfile | null>(USER_KEY, null)
const listeners = new Set<() => void>()

function emit() {
  setStorage(USER_KEY, user)
  listeners.forEach((listener) => listener())
}

export function getCurrentUser() {
  return user
}

export function setCurrentUser(nextUser: UserProfile) {
  user = nextUser
  emit()
}

export function clearSessionState() {
  user = null
  Taro.removeStorageSync('token')
  clearFavoriteIds()
  clearReadIds()
  emit()
}

export function subscribeUser(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
