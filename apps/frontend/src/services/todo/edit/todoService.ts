// 編集ページ専用の API 呼び出し層（更新）
// 一覧ページの完了切替（トグル）も更新操作のため、こちらを使用する
import { Todo } from '@/types/todo/shared/todo.types'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

const BASE = '/api/todos'

export const todoEditService = {
  // 更新（編集フォームからの保存 / 一覧画面の完了トグル 両方で使用）
  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新に失敗しました')
    return res.json()
  },
}
