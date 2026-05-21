import { useEffect, useState } from 'react'
import type { NewsItem } from '@/types/news'
import { getStorage, setStorage } from '@/utils/storage'

const READ_KEY = 'read_ids'

let readIds = new Set<string>(getStorage<string[]>(READ_KEY, []))
const listeners = new Set<() => void>()

function emit() {
  setStorage(READ_KEY, Array.from(readIds))
  listeners.forEach((listener) => listener())
}

export function markRead(id: string) {
  if (!readIds.has(id)) {
    readIds.add(id)
    emit()
  }
}

export function isRead(id: string) {
  return readIds.has(id)
}

export function withLocalNewsState<T extends NewsItem>(items: T[], favoriteIds: string[]) {
  const favoriteSet = new Set(favoriteIds)
  return items.map((item) => ({
    ...item,
    isRead: readIds.has(item.id),
    isFavorite: favoriteSet.has(item.id)
  }))
}

export function useNewsStore() {
  const [, setVersion] = useState(0)

  useEffect(() => {
    const listener = () => setVersion((value) => value + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    readIds: Array.from(readIds),
    readCount: readIds.size,
    isRead,
    markRead
  }
}
