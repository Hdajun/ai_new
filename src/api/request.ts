import Taro from '@tarojs/taro'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions<T> {
  url: string
  method?: Method
  data?: T
  showLoading?: boolean
  suppressErrorToast?: boolean
}

interface ApiResponse<T> {
  success?: boolean
  message?: string
  data?: T
}

const API_BASE_URL = process.env.TARO_APP_API_BASE_URL || 'https://api.hdajun.me'

export async function request<T = unknown, D = unknown>(options: RequestOptions<D>): Promise<T> {
  const token = Taro.getStorageSync('token')

  if (options.showLoading) {
    Taro.showLoading({ title: '加载中', mask: true })
  }

  try {
    const response = await Taro.request<ApiResponse<T> | T>({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (response.statusCode === 401) {
      Taro.removeStorageSync('token')
      Taro.showToast({ title: '登录已过期', icon: 'none' })
      throw new Error('Unauthorized')
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new Error(`Request failed: ${response.statusCode}`)
    }

    const body = response.data as ApiResponse<T>
    if (typeof body === 'object' && body && 'success' in body) {
      if (body.success === false) {
        throw new Error(body.message || '请求失败')
      }
      return body.data as T
    }

    return response.data as T
  } catch (error) {
    const message = error instanceof Error ? error.message : '网络异常'
    if (message !== 'Unauthorized' && !options.suppressErrorToast) {
      Taro.showToast({ title: message || '请求失败', icon: 'none' })
    }
    throw error
  } finally {
    if (options.showLoading) {
      Taro.hideLoading()
    }
  }
}
