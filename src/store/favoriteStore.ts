import { useEffect, useState } from 'react'
import { getStorage, setStorage } from '@/utils/storage'

const FAVORITE_KEY = 'favorite_ids'

let favoriteIds = new Set<string>(getStorage<string[]>(FAVORITE_KEY, []))
const listeners = new Set<() => void>()

function emit() {
  setStorage(FAVORITE_KEY, Array.from(favoriteIds))
  listeners.forEach((listener) => listener())
}

export function setFavorite(id: string, active: boolean) {
  if (active) {
    favoriteIds.add(id)
  } else {
    favoriteIds.delete(id)
  }
  emit()
}

export function syncFavoriteIds(ids: string[]) {
  favoriteIds = new Set(ids)
  emit()
}

export function toggleFavorite(id: string) {
  setFavorite(id, !favoriteIds.has(id))
}

export function isFavorite(id: string) {
  return favoriteIds.has(id)
}

export function useFavoriteStore() {
  const [, setVersion] = useState(0)

  useEffect(() => {
    const listener = () => setVersion((value) => value + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const ids = Array.from(favoriteIds)
  return {
    favoriteIds: ids,
    favoriteCount: ids.length,
    isFavorite,
    setFavorite,
    syncFavoriteIds,
    toggleFavorite
  }
}
