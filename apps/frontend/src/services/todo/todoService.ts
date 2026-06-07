// Client Component 専用の API 呼び出し層
// Server Component からは todoRepository を使うこと（相対URLはサーバー側で解決できない）
import { Todo } from '@/types/todo/shared/todo.types'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

const BASE = '/api/todos'

export const todoService = {
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
