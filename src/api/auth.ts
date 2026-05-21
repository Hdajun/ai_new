import Taro from '@tarojs/taro'
import { request } from './request'
import type { UserProfile } from '@/types/news'

interface LoginResponse {
  token: string
  user: UserProfile
}

export async function wechatLogin(): Promise<LoginResponse> {
  const loginResult = await Taro.login()
  return request<LoginResponse, { code: string }>({
    url: '/api/auth/wechat-login',
    method: 'POST',
    data: { code: loginResult.code },
    showLoading: true
  })
}
