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
import { auditSafeText } from '@/utils/auditText'
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
      if (Taro.getStorageSync('token')) {
        markNewsRead(id).catch(() => undefined)
      }
    } finally {
      setLoading(false)
    }
  }

  function handleFavorite() {
    if (!id) return
    if (!Taro.getStorageSync('token')) {
      Taro.showToast({ title: '请先登录后收藏', icon: 'none' })
      return
    }

    const nextActive = !active
    favoriteStore.setFavorite(id, nextActive)
    const request = nextActive ? favoriteNews(id) : unfavoriteNews(id)
    request.catch(() => favoriteStore.setFavorite(id, !nextActive))
  }

  function copyOriginalUrl() {
    if (!item?.originalUrl) {
      Taro.showToast({ title: '暂无来源链接', icon: 'none' })
      return
    }
    Taro.setClipboardData({ data: item.originalUrl })
  }

  useEffect(() => {
    loadData()
  }, [id])

  useShareAppMessage(() => ({
    title: auditSafeText(item?.title) || 'AI 小报',
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
        <EmptyState title='没有找到这条内容' description='可能已经被移除，返回列表看看别的内容。' />
      </View>
    )
  }

  return (
    <View className='page detail-page'>
      <View className='detail-card'>
        <View className='detail-card__top'>
          <View>
            <Text className='detail-card__eyebrow'>AI 小报</Text>
            <Text className='detail-card__category'>{getCategoryLabel(item.category)}</Text>
          </View>
          <Text className='detail-card__time'>{formatTime(item.publishedAt)}</Text>
        </View>
        <Text className='detail-card__title'>{auditSafeText(item.title)}</Text>
        <View className='detail-card__note'>
          <Text className='detail-card__note-title'>小报摘要</Text>
          <Text className='detail-card__summary'>{auditSafeText(item.summary)}</Text>
        </View>
        <View className='detail-card__source'>
          <Text className='detail-card__source-name'>{auditSafeText(item.sourceName)}</Text>
          {item.tags.map((tag) => (
            <Text className='detail-card__tag' key={tag}>
              {auditSafeText(tag)}
            </Text>
          ))}
        </View>
        <View className='detail-card__body'>
          <Text className='detail-card__body-title'>完整记录</Text>
          <Text className='detail-card__content'>{auditSafeText(item.content)}</Text>
        </View>
      </View>

      <View className='detail-actions'>
        <FavoriteButton active={favoriteStore.isFavorite(id)} onClick={handleFavorite} />
        <Button className='detail-actions__button' onClick={copyOriginalUrl}>
          复制来源链接
        </Button>
      </View>
    </View>
  )
}
