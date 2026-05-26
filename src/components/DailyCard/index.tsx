import Taro from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import type { DailyReport } from '@/types/news'
import { auditSafeText } from '@/utils/auditText'
import dailyCardRobot from '@/assets/ued/daily-card-robot-cut.png'
import './index.scss'

interface DailyContentItem {
  title?: string
  summary?: string
  sourceName?: string
  sourceUrl?: string
}

interface DailyCardProps {
  report: DailyReport
}

function parseSectionItems(content?: string): DailyContentItem[] {
  if (!content) return []
  try {
    const value = JSON.parse(content)
    return Array.isArray(value) ? value : []
  } catch (error) {
    return []
  }
}

function renderSectionTitle(title: string) {
  const safeTitle = auditSafeText(title)
  if (safeTitle.length === 4) {
    return (
      <>
        <Text className='daily-card__section-title-line'>{safeTitle.slice(0, 2)}</Text>
        <Text className='daily-card__section-title-line'>{safeTitle.slice(2)}</Text>
      </>
    )
  }
  return safeTitle
}

export default function DailyCard({ report }: DailyCardProps) {
  return (
    <View className='daily-card'>
      <View className='daily-card__hero'>
        <View>
          <Text className='daily-card__date'>{report.date}</Text>
          <Text className='daily-card__title'>{auditSafeText(report.title || '今日AI日报')}</Text>
          <Text className='daily-card__tagline'>AI 领域每日摘要，一文读览全局</Text>
        </View>
        <Image className='daily-card__image' src={dailyCardRobot} mode='aspectFit' />
      </View>
      <Text className='daily-card__summary'>{auditSafeText(report.summary)}</Text>
      {report.sections.map((section) => (
        <View className='daily-card__section' key={section.id}>
          <View className='daily-card__section-title'>{renderSectionTitle(section.title)}</View>
          <View className='daily-card__section-body'>
          {parseSectionItems(section.content).length > 0
            ? parseSectionItems(section.content).map((item, index) => (
                <View className='daily-card__item' key={`${section.id}-${index}`}>
                  <Text className='daily-card__item-title'>{auditSafeText(item.title || '未命名条目')}</Text>
                  {item.summary ? <Text className='daily-card__item-summary'>{auditSafeText(item.summary)}</Text> : null}
                  {item.sourceName ? <Text className='daily-card__item-source'>{auditSafeText(item.sourceName)}</Text> : null}
                </View>
              ))
            : section.content ? <Text className='daily-card__section-content'>{auditSafeText(section.content)}</Text> : null}
          {section.items?.map((item) => (
            <View
              className='daily-card__item'
              key={item.id}
              onClick={() => Taro.navigateTo({ url: `/pages/news-detail/index?id=${item.id}` })}
            >
              <Text className='daily-card__item-title'>{auditSafeText(item.title)}</Text>
              <Text className='daily-card__item-source'>{auditSafeText(item.sourceName)}</Text>
            </View>
          ))}
          </View>
        </View>
      ))}
    </View>
  )
}
