import { request } from './request'
import type { DailyReport, DailySection, NewsCategory, NewsItem, TodayNewsResponse, UserStats } from '@/types/news'

interface NewsListResponse {
  total: number
  items: BackendNewsItem[]
}

interface BackendNewsItem {
  id: number | string
  title: string
  summary?: string | null
  content?: string | null
  category?: string | null
  tags?: string[] | unknown
  sourceName?: string | null
  sourceUrl?: string | null
  originalUrl?: string | null
  publishedAt?: string | null
  createdAt?: string | null
  isRead?: boolean
  isFavorite?: boolean
}

interface BackendDailySection {
  id: number | string
  title: string
  content?: string | null
  items?: BackendNewsItem[]
}

interface BackendDailyReport {
  id: number | string
  date: string
  title: string
  summary?: string | null
  content?: string | null
  sections?: BackendDailySection[]
}

function normalizeTags(tags: BackendNewsItem['tags']): string[] {
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === 'string') : []
}

function normalizeNewsItem(item: BackendNewsItem): NewsItem {
  return {
    id: String(item.id),
    title: item.title,
    summary: item.summary || '暂无摘要',
    content: item.content || item.summary || '暂无正文内容',
    category: item.category || 'AI 动态',
    tags: normalizeTags(item.tags),
    sourceName: item.sourceName || 'AI HOT',
    sourceUrl: item.sourceUrl || undefined,
    originalUrl: item.originalUrl || undefined,
    publishedAt: item.publishedAt || item.createdAt || new Date().toISOString(),
    isRead: Boolean(item.isRead),
    isFavorite: Boolean(item.isFavorite)
  }
}

function normalizeDate(value: string) {
  return value.includes('T') ? value.slice(0, 10) : value
}

function normalizeDailySection(section: BackendDailySection): DailySection {
  return {
    id: String(section.id),
    title: section.title,
    content: section.content || undefined,
    items: section.items?.map(normalizeNewsItem)
  }
}

function normalizeDailyReport(report: BackendDailyReport): DailyReport {
  return {
    id: String(report.id),
    date: normalizeDate(report.date),
    title: report.title,
    summary: report.summary || '暂无摘要',
    content: report.content || undefined,
    sections: report.sections?.map(normalizeDailySection) || []
  }
}

export async function getTodayNews(): Promise<TodayNewsResponse> {
  const data = await request<{ date: string; summary?: string | null; items: BackendNewsItem[] }>({ url: '/api/news/today' })
  return {
    date: normalizeDate(data.date),
    summary: data.summary || '暂无摘要',
    items: data.items.map(normalizeNewsItem)
  }
}

export async function getLatestDaily(): Promise<DailyReport> {
  return normalizeDailyReport(await request<BackendDailyReport>({ url: '/api/daily/latest' }))
}

export async function getDailyByDate(date: string): Promise<DailyReport> {
  return normalizeDailyReport(await request<BackendDailyReport>({ url: `/api/daily/${date}`, suppressErrorToast: true }))
}

export async function getNewsDetail(id: string): Promise<NewsItem> {
  return normalizeNewsItem(await request<BackendNewsItem>({ url: `/api/news/${id}` }))
}

export async function getNewsByCategory(category: NewsCategory | 'all'): Promise<NewsItem[]> {
  const query = category === 'all' ? 'take=20' : `take=20&category=${encodeURIComponent(category)}`
  const data = await request<NewsListResponse>({ url: `/api/news/latest?${query}` })
  return data.items.map(normalizeNewsItem)
}

export async function markNewsRead(id: string) {
  return request({ url: `/api/news/${id}/read`, method: 'POST' })
}

export async function favoriteNews(id: string) {
  return request({ url: `/api/news/${id}/favorite`, method: 'POST' })
}

export async function unfavoriteNews(id: string) {
  return request({ url: `/api/news/${id}/favorite`, method: 'DELETE' })
}

export async function getFavoriteNews(): Promise<NewsItem[]> {
  const data = await request<BackendNewsItem[]>({ url: '/api/me/favorites' })
  return data.map((item) => ({ ...normalizeNewsItem(item), isFavorite: true }))
}

export async function getMyStats(): Promise<UserStats> {
  const data = await request<Partial<UserStats>>({ url: '/api/me/stats' })
  return {
    readCount: data.readCount || 0,
    favoriteCount: data.favoriteCount || 0,
    streakDays: data.streakDays || 0
  }
}
