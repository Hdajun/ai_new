import Taro from '@tarojs/taro'

export function getStorage<T>(key: string, fallback: T): T {
  try {
    const value = Taro.getStorageSync(key)
    return value || fallback
  } catch (error) {
    return fallback
  }
}

export function setStorage<T>(key: string, value: T) {
  try {
    Taro.setStorageSync(key, value)
  } catch (error) {
    console.warn(`Failed to set storage: ${key}`, error)
  }
}
