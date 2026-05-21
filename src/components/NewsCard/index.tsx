import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import FavoriteButton from '@/components/FavoriteButton'
import ReadBadge from '@/components/ReadBadge'
import type { NewsItem } from '@/types/news'
import { formatTime } from '@/utils/format'
import './index.scss'

interface NewsCardProps {
  item: NewsItem
  onFavorite?: (id: string) => void
}

export default function NewsCard({ item, onFavorite }: NewsCardProps) {
  function openDetail() {
    Taro.navigateTo({ url: `/pages/news-detail/index?id=${item.id}` })
  }

  return (
    <View className={`news-card ${item.isRead ? 'news-card--read' : ''}`} onClick={openDetail}>
      <View className='news-card__category-card'>
        <Text className='news-card__category-icon'>AI</Text>
      </View>
      <View className='news-card__content'>
        <Text className='news-card__title'>{item.title}</Text>
        <Text className='news-card__summary'>{item.summary}</Text>
      </View>
      <View className='news-card__meta'>
        <View className='news-card__source'>
          <Text>来源：{item.sourceName}</Text>
          <ReadBadge read={item.isRead} />
        </View>
        <Text className='news-card__time'>{formatTime(item.publishedAt)}</Text>
        <FavoriteButton active={item.isFavorite} onClick={() => onFavorite?.(item.id)} />
      </View>
    </View>
  )
}
