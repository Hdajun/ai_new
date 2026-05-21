import { useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { favoriteNews, getTodayNews, unfavoriteNews } from '@/api/news'
import NewsCard from '@/components/NewsCard'
import SkeletonList from '@/components/SkeletonList'
import EmptyState from '@/components/EmptyState'
import type { TodayNewsResponse } from '@/types/news'
import { useFavoriteStore } from '@/store/favoriteStore'
import { withLocalNewsState } from '@/store/newsStore'
import todayBrand from '@/assets/ued/today-brand-cut.png'
import todayCalendar from '@/assets/ued/today-calendar-card-tight.png'
import todayHeroRobot from '@/assets/ued/today-hero-robot-cut.png'
import './index.scss'

export default function TodayPage() {
  const [today, setToday] = useState<TodayNewsResponse>()
  const [loading, setLoading] = useState(true)
  const favorites = useFavoriteStore()

  async function loadData() {
    setLoading(true)
    try {
      const data = await getTodayNews()
      setToday(data)
    } catch (error) {
      setToday(undefined)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  usePullDownRefresh(loadData)

  const items = today ? withLocalNewsState(today.items, favorites.favoriteIds) : []
  const [, calendarMonth, calendarDay] = (today?.date || '').split('-')
  const displayMonth = `${Number(calendarMonth) || new Date().getMonth() + 1}月`
  const displayDay = `${Number(calendarDay) || new Date().getDate()}`

  async function handleFavorite(id: string) {
    if (!Taro.getStorageSync('token')) {
      Taro.showToast({ title: '请先登录后收藏', icon: 'none' })
      return
    }

    const nextActive = !favorites.isFavorite(id)
    favorites.setFavorite(id, nextActive)
    try {
      if (nextActive) {
        await favoriteNews(id)
      } else {
        await unfavoriteNews(id)
      }
    } catch (error) {
      favorites.setFavorite(id, !nextActive)
    }
  }

  return (
    <View className='page today-page'>
      <View className='today-hero'>
        <View className='today-hero__copy'>
          <Image className='today-hero__brand' src={todayBrand} mode='aspectFit' />
          <View className='today-hero__title'>
            <Text>今天为你收集了</Text>
            <View className='today-hero__count-wrap'>
              <Text className='today-hero__count'>{today ? items.length : '--'}</Text>
              <View className='today-hero__underline' />
            </View>
            <Text>条动态</Text>
          </View>
        </View>
        <Image className='today-hero__robot' src={todayHeroRobot} mode='aspectFit' />
      </View>
      {today ? (
        <View className='today-summary'>
          <View className='today-summary__calendar'>
            <Image className='today-summary__calendar-bg' src={todayCalendar} mode='aspectFit' />
            <Text className='today-summary__calendar-day'>{displayDay}</Text>
            <Text className='today-summary__calendar-month'>{displayMonth}</Text>
          </View>
          <View className='today-summary__content'>
            <View className='today-summary__head'>
              <Text className='today-summary__label'>每日AI摘要</Text>
              <Text className='today-summary__button'>一键速览</Text>
            </View>
            <Text className='today-summary__text'>{today.summary}</Text>
          </View>
        </View>
      ) : null}
      {!loading ? (
        <View className='today-section-title'>
          <Text>今日AI快讯</Text>
          <Text className='today-section-title__all'>全部</Text>
        </View>
      ) : null}
      {loading ? <SkeletonList /> : null}
      {!loading && items.length === 0 ? <EmptyState title='暂无资讯' description='下拉刷新试试。' /> : null}
      {!loading
        ? items.map((item) => <NewsCard item={item} key={item.id} onFavorite={handleFavorite} />)
        : null}
    </View>
  )
}
