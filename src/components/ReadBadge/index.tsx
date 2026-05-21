import { Text } from '@tarojs/components'
import './index.scss'

interface ReadBadgeProps {
  read?: boolean
}

export default function ReadBadge({ read }: ReadBadgeProps) {
  if (!read) return null
  return <Text className='read-badge'>已读</Text>
}
