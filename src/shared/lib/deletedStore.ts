import { useSyncExternalStore } from 'react'

// Хранилище id удалённых объектов в localStorage — по образцу
// shared/auth/tokenStorage.ts. Подписка нужна для useSyncExternalStore.

const EMPTY: readonly string[] = []

function createDeletedStore(storageKey: string) {
  const listeners = new Set<() => void>()

  function read(): readonly string[] {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return EMPTY

      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed)
        ? parsed.filter((value): value is string => typeof value === 'string')
        : EMPTY
    } catch {
      return EMPTY
    }
  }

  let ids: readonly string[] = read()

  function commit(next: readonly string[]) {
    ids = next
    try {
      if (next.length === 0) localStorage.removeItem(storageKey)
      else localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // Приватный режим: держим список только в памяти, как и токен.
    }
    listeners.forEach((listener) => listener())
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    getSnapshot: () => ids,

    hide(id: string) {
      if (ids.includes(id)) return
      commit([...ids, id])
    },

    restore(id: string) {
      if (!ids.includes(id)) return
      commit(ids.filter((value) => value !== id))
    },
  }
}

export type DeletedStore = ReturnType<typeof createDeletedStore>

export const deletedRoutes = createDeletedStore('admin-panel.deleted.routes')
export const deletedReviews = createDeletedStore('admin-panel.deleted.reviews')

/** Список удалённых id; обновляет компонент при hide/restore. */
export const useDeletedIds = (store: DeletedStore): readonly string[] =>
  useSyncExternalStore(store.subscribe, store.getSnapshot, () => EMPTY)
