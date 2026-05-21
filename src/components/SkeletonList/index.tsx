import { View } from '@tarojs/components'
import './index.scss'

interface SkeletonListProps {
  count?: number
}

export default function SkeletonList({ count = 3 }: SkeletonListProps) {
  return (
    <View className='skeleton-list'>
      {Array.from({ length: count }).map((_, index) => (
        <View className='skeleton-card' key={index}>
          <View className='skeleton-line skeleton-line--title' />
          <View className='skeleton-line' />
          <View className='skeleton-line skeleton-line--short' />
        </View>
      ))}
    </View>
  )
}
