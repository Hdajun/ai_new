import Taro from '@tarojs/taro'
import { request } from './request'
import type { UserProfile } from '@/types/news'

interface LoginResponse {
  token: string
  user: UserProfile
}

interface WechatLoginPayload {
  code: string
  nickname?: string
  avatarUrl?: string
}

export async function wechatLogin(): Promise<LoginResponse> {
  const loginResult = await Taro.login()
  let profile: Taro.UserInfo | undefined

  try {
    const result = await Taro.getUserProfile({
      desc: '用于展示昵称和头像'
    })
    profile = result.userInfo
  } catch (error) {
    profile = undefined
  }

  return request<LoginResponse, WechatLoginPayload>({
    url: '/api/auth/wechat-login',
    method: 'POST',
    data: {
      code: loginResult.code,
      nickname: profile?.nickName,
      avatarUrl: profile?.avatarUrl
    },
    showLoading: true
  })
}
