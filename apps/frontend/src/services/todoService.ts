import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo.types'

const BASE = '/api/todos'

export const todoService = {
  // 一覧取得
  getAll: async (): Promise<Todo[]> => {
    const res = await fetch(BASE, { cache: 'no-store' }) // 'no-store' = キャッシュせず毎回最新を取得
    if (!res.ok) throw new Error('一覧の取得に失敗しました')
    return res.json()
  },

  // 1件取得
  getById: async (id: string): Promise<Todo> => {
    const res = await fetch(`${BASE}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('データの取得に失敗しました')
    return res.json()
  },

  // 作成
  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('作成に失敗しました')
    return res.json()
  },

  // 更新
  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新に失敗しました')
    return res.json()
  },

  // 削除
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('削除に失敗しました')
  },
}
