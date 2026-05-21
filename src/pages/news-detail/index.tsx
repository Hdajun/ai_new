import { useEffect, useState } from 'react'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { favoriteNews, getNewsDetail, markNewsRead, unfavoriteNews } from '@/api/news'
import FavoriteButton from '@/components/FavoriteButton'
import EmptyState from '@/components/EmptyState'
import SkeletonList from '@/components/SkeletonList'
import { getCategoryLabel } from '@/constants/categories'
import { isFavorite, useFavoriteStore } from '@/store/favoriteStore'
import { markRead } from '@/store/newsStore'
import type { NewsItem } from '@/types/news'
import { formatTime } from '@/utils/format'
import './index.scss'

export default function NewsDetailPage() {
  const router = useRouter()
  const id = router.params.id || ''
  const [item, setItem] = useState<NewsItem>()
  const [loading, setLoading] = useState(true)
  const favoriteStore = useFavoriteStore()
  const active = id ? isFavorite(id) : false

  async function loadData() {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const detail = await getNewsDetail(id)
      setItem(detail)
      markRead(id)
      markNewsRead(id).catch(() => undefined)
    } finally {
      setLoading(false)
    }
  }

  function handleFavorite() {
    if (!id) return
    const nextActive = !active
    favoriteStore.setFavorite(id, nextActive)
    const request = nextActive ? favoriteNews(id) : unfavoriteNews(id)
    request.catch(() => favoriteStore.setFavorite(id, !nextActive))
  }

  function copyOriginalUrl() {
    if (!item?.originalUrl) {
      Taro.showToast({ title: '暂无原文链接', icon: 'none' })
      return
    }
    Taro.setClipboardData({ data: item.originalUrl })
  }

  useEffect(() => {
    loadData()
  }, [id])

  useShareAppMessage(() => ({
    title: item?.title || 'AI 简报',
    path: `/pages/news-detail/index?id=${id}`
  }))

  if (loading) {
    return (
      <View className='page'>
        <SkeletonList count={1} />
      </View>
    )
  }

  if (!item) {
    return (
      <View className='page'>
        <EmptyState title='没有找到这条资讯' description='可能已经被移除，返回列表看看别的内容。' />
      </View>
    )
  }

  return (
    <View className='page detail-page'>
      <View className='detail-article'>
        <View className='detail-article__meta'>
          <Text className='detail-article__category'>{getCategoryLabel(item.category)}</Text>
          <Text className='detail-article__time'>{formatTime(item.publishedAt)}</Text>
        </View>
        <Text className='detail-article__title'>{item.title}</Text>
        <Text className='detail-article__summary'>{item.summary}</Text>
        <View className='detail-article__source'>
          <Text className='detail-article__source-name'>{item.sourceName}</Text>
          {item.tags.map((tag) => (
            <Text className='detail-article__tag' key={tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text className='detail-article__content'>{item.content}</Text>
      </View>

      <View className='detail-actions'>
        <FavoriteButton active={favoriteStore.isFavorite(id)} onClick={handleFavorite} />
        <Button className='detail-actions__button' onClick={copyOriginalUrl}>
          复制原文链接
        </Button>
      </View>
    </View>
  )
}
