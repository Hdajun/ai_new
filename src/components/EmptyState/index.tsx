import { Text, View } from '@tarojs/components'
import './index.scss'

interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className='empty-state'>
      <View className='empty-state__mascot'>
        <View className='empty-state__face' />
        <View className='empty-state__paper' />
      </View>
      <Text className='empty-state__title'>{title}</Text>
      {description ? <Text className='empty-state__description'>{description}</Text> : null}
    </View>
  )
}
