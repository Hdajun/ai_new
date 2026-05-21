import { View } from '@tarojs/components'
import './index.scss'

interface FavoriteButtonProps {
  active?: boolean
  onClick?: () => void
}

export default function FavoriteButton({ active, onClick }: FavoriteButtonProps) {
  return (
    <View
      className={`favorite-button ${active ? 'favorite-button--active' : ''}`}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      {active ? '已藏' : '收藏'}
    </View>
  )
}
