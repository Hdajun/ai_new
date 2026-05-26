import { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getFavoriteNews, unfavoriteNews } from '@/api/news'
import EmptyState from '@/components/EmptyState'
import NewsCard from '@/components/NewsCard'
import PageHeader from '@/components/PageHeader'
import SkeletonList from '@/components/SkeletonList'
import { syncFavoriteIds, useFavoriteStore } from '@/store/favoriteStore'
import { withLocalNewsState } from '@/store/newsStore'
import { useUserStore } from '@/store/userStore'
import type { NewsItem } from '@/types/news'
import favHeroRobot from '@/assets/ued/fav-hero-robot-cut.png'

export default function FavoritesPage() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const favorites = useFavoriteStore()
  const userStore = useUserStore()

  async function loadFavorites() {
    if (!userStore.isLoggedIn) {
      setItems([])
      return
    }

    setLoading(true)
    try {
      const data = await getFavoriteNews()
      setItems(data)
      syncFavoriteIds(data.map((item) => item.id))
    } catch (error) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function removeFavorite(id: string) {
    const nextItems = items.filter((item) => item.id !== id)
    setItems(nextItems)
    syncFavoriteIds(nextItems.map((item) => item.id))
    try {
      await unfavoriteNews(id)
    } catch (error) {
      Taro.showToast({ title: '取消收藏失败', icon: 'none' })
      loadFavorites()
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [userStore.isLoggedIn])

  useDidShow(() => {
    loadFavorites()
  })

  const news = withLocalNewsState(items, favorites.favoriteIds)

  return (
    <View className='page'>
      <PageHeader title='收藏' subtitle='你收藏的精华内容' extra={`${news.length} 条`} image={favHeroRobot} imageSize='large' />
      {loading ? <SkeletonList /> : null}
      {!loading && !userStore.isLoggedIn ? <EmptyState title='登录后查看收藏' description='请先在“我的”页面完成微信登录。' /> : null}
      {!loading && userStore.isLoggedIn && news.length === 0 ? <EmptyState title='还没有收藏' description='在条目卡片或详情页点击收藏后，会出现在这里。' /> : null}
      {!loading ? news.map((item) => <NewsCard item={item} key={item.id} onFavorite={removeFavorite} />) : null}
    </View>
  )
}
