export type NewsCategory = string

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: NewsCategory
  tags: string[]
  sourceName: string
  sourceUrl?: string
  originalUrl?: string
  publishedAt: string
  isRead?: boolean
  isFavorite?: boolean
}

export interface DailySection {
  id: string
  title: string
  content?: string
  items?: NewsItem[]
}

export interface DailyReport {
  id: string
  date: string
  title: string
  summary: string
  content?: string
  sections: DailySection[]
}

export interface TodayNewsResponse {
  date: string
  summary: string
  items: NewsItem[]
}

export interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
}

export interface UserStats {
  readCount: number
  favoriteCount: number
  streakDays: number
}
