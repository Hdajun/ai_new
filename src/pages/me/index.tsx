import { useEffect, useState } from 'react'
import { Button, Image, Text, View } from '@tarojs/components'
import { getMyStats } from '@/api/news'
import PageHeader from '@/components/PageHeader'
import { useFavoriteStore } from '@/store/favoriteStore'
import { useNewsStore } from '@/store/newsStore'
import { useUserStore } from '@/store/userStore'
import type { UserStats } from '@/types/news'
import iconCalendar from '@/assets/ued/icon-calendar.png'
import iconRead from '@/assets/ued/icon-read.png'
import iconStar from '@/assets/ued/icon-star.png'
import iconWechat from '@/assets/ued/icon-wechat.png'
import meAvatar from '@/assets/ued/me-avatar-cut.png'
import meHeroRobot from '@/assets/ued/me-hero-robot-cut.png'
import './index.scss'

export default function MePage() {
  const userStore = useUserStore()
  const newsStore = useNewsStore()
  const favoriteStore = useFavoriteStore()
  const [stats, setStats] = useState<UserStats>()

  async function loadStats() {
    if (!userStore.isLoggedIn) {
      setStats(undefined)
      return
    }

    try {
      setStats(await getMyStats())
    } catch (error) {
      setStats(undefined)
    }
  }

  useEffect(() => {
    loadStats()
  }, [userStore.isLoggedIn])

  const readCount = stats?.readCount ?? newsStore.readCount
  const favoriteCount = stats?.favoriteCount ?? favoriteStore.favoriteCount
  const streakDays = stats?.streakDays ?? 0

  return (
    <View className='page me-page'>
      <PageHeader title='我的' subtitle='登录后同步收藏与阅读状态' image={meHeroRobot} imageSize='large' />
      <View className='me-profile'>
        <Image className='me-profile__avatar' src={meAvatar} mode='aspectFill' />
        <View className='me-profile__copy'>
          <Text className='me-profile__name'>{userStore.user?.nickname || '未登录'}</Text>
          <Text className='me-profile__desc'>{userStore.isLoggedIn ? '已连接后端账号数据' : '登录后同步收藏与阅读状态'}</Text>
        </View>
        {userStore.isLoggedIn ? (
          <Button className='me-profile__button' onClick={userStore.logout}>
            退出
          </Button>
        ) : (
          <Button className='me-profile__button me-profile__button--primary' loading={userStore.loading} onClick={userStore.login}>
            <View className='me-profile__button-icon-wrap'>
              <Image className='me-profile__button-icon' src={iconWechat} mode='aspectFit' />
            </View>
            <Text>微信登录</Text>
          </Button>
        )}
      </View>

      <View className='me-stats'>
        <View className='me-stat'>
          <View className='me-stat__inner me-stat__inner--read'>
            <Image className='me-stat__icon' src={iconRead} mode='aspectFit' />
            <Text className='me-stat__label'>已读</Text>
            <Text className='me-stat__value'>{readCount}</Text>
          </View>
        </View>
        <View className='me-stat'>
          <View className='me-stat__inner me-stat__inner--favorite'>
            <Image className='me-stat__icon' src={iconStar} mode='aspectFit' />
            <Text className='me-stat__label'>收藏</Text>
            <Text className='me-stat__value'>{favoriteCount}</Text>
          </View>
        </View>
        <View className='me-stat'>
          <View className='me-stat__inner me-stat__inner--streak'>
            <Image className='me-stat__icon' src={iconCalendar} mode='aspectFit' />
            <Text className='me-stat__label'>连续天数</Text>
            <Text className='me-stat__value'>{streakDays}</Text>
          </View>
        </View>
      </View>

      <View className='me-list'>
        <View className='me-list__item'>
          <Text>关于项目</Text>
          <Text>AI 简报小程序 MVP</Text>
        </View>
        <View className='me-list__item'>
          <Text>隐私协议</Text>
          <Text>记录 openid、收藏和已读状态</Text>
        </View>
        <View className='me-list__item'>
          <Text>备案信息</Text>
          <Text>hdajun.me 已完成 ICP，小程序需单独备案</Text>
        </View>
      </View>
    </View>
  )
}
