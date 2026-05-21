import { Text, View } from '@tarojs/components'
import './index.scss'

interface DatePickerBarProps {
  date: string
  disableNext?: boolean
  onPrev: () => void
  onNext: () => void
}

export default function DatePickerBar({ date, disableNext, onPrev, onNext }: DatePickerBarProps) {
  return (
    <View className='date-picker-bar'>
      <Text className='date-picker-bar__button' onClick={onPrev}>
        前一天
      </Text>
      <Text className='date-picker-bar__date'>{date}</Text>
      <Text className={`date-picker-bar__button ${disableNext ? 'date-picker-bar__button--disabled' : ''}`} onClick={() => !disableNext && onNext()}>
        后一天
      </Text>
    </View>
  )
}
