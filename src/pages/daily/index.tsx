import { useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getDailyByDate, getLatestDaily } from '@/api/news'
import DailyCard from '@/components/DailyCard'
import DatePickerBar from '@/components/DatePickerBar'
import EmptyState from '@/components/EmptyState'
import PageHeader from '@/components/PageHeader'
import SkeletonList from '@/components/SkeletonList'
import type { DailyReport } from '@/types/news'
import { formatDate } from '@/utils/format'
import dailyHeroRobot from '@/assets/ued/daily-hero-robot-cut.png'

function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00+08:00`)
  value.setDate(value.getDate() + days)
  return formatDate(value)
}

function today() {
  return formatDate(new Date())
}

export default function DailyPage() {
  const [selectedDate, setSelectedDate] = useState(today())
  const [latestDate, setLatestDate] = useState(today())
  const [report, setReport] = useState<DailyReport>()
  const [loading, setLoading] = useState(true)

  async function loadLatest() {
    setLoading(true)
    try {
      const data = await getLatestDaily()
      setReport(data)
      setSelectedDate(data.date)
      setLatestDate(data.date)
    } catch (error) {
      setReport(undefined)
      setSelectedDate(today())
      setLatestDate(today())
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }

  async function loadByDate(date: string) {
    if (date > today()) {
      Taro.showToast({ title: '未来还没有日报', icon: 'none' })
      return
    }

    setSelectedDate(date)
    setLoading(true)
    try {
      setReport(await getDailyByDate(date))
    } catch (error) {
      setReport(undefined)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLatest()
  }, [])

  usePullDownRefresh(loadLatest)

  const nextDate = shiftDate(selectedDate, 1)
  const disableNext = nextDate > latestDate || nextDate > today()

  return (
    <View className='page'>
      <PageHeader title='日报' subtitle='按日期回看 AI HOT 每日简报' image={dailyHeroRobot} />
      <DatePickerBar
        date={selectedDate}
        disableNext={disableNext}
        onPrev={() => loadByDate(shiftDate(selectedDate, -1))}
        onNext={() => loadByDate(nextDate)}
      />
      {loading ? <SkeletonList /> : null}
      {!loading && !report ? <EmptyState title='当日暂无日报' description='这个日期还没有同步到日报，可以切回最近一天。' /> : null}
      {!loading && report ? <DailyCard report={report} /> : null}
    </View>
  )
}
