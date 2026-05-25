import { Image, Text, View } from '@tarojs/components'
import brandImage from '@/assets/ued/today-brand-cut.png'
import './index.scss'

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: string
  image?: string
  imageSize?: 'normal' | 'large'
}

export default function PageHeader({ title, subtitle, extra, image, imageSize = 'normal' }: PageHeaderProps) {
  return (
    <View className={`page-header ${image ? 'page-header--visual' : ''} ${image ? `page-header--image-${imageSize}` : ''}`}>
      <View className='page-header__copy'>
        {image ? <Image className='page-header__brand' src={brandImage} mode='aspectFit' /> : null}
        <Text className='page-header__title'>{title}</Text>
        {subtitle ? <Text className='page-header__subtitle'>{subtitle}</Text> : null}
      </View>
      {extra ? <Text className='page-header__extra'>{extra}</Text> : null}
      {image ? <Image className='page-header__image' src={image} mode='aspectFit' /> : null}
    </View>
  )
}
