'use client'

import Link from 'next/link'
import { Todo } from '@/types/todo.types'

interface Props {
  todo: Todo
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}

export const TodoItem = ({ todo, onDelete, onToggle }: Props) => {
  const handleDelete = () => {
    // 誤削除を防ぐため確認ダイアログを表示
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      onDelete(todo.id)
    }
  }

  return (
    <div className="flex items-center justify-between rounded border p-4">
      <div className="flex items-center gap-3">
        {/* チェックボックスで完了状態をトグル */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="h-4 w-4 cursor-pointer"
        />
        <div>
          {/* 完了済みの場合は打ち消し線とグレーで表示 */}
          <p className={`font-medium ${todo.completed ? 'text-gray-400 line-through' : ''}`}>
            {todo.title}
          </p>
          <p className="text-sm text-gray-500">{todo.description}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Link コンポーネント = Next.js のクライアントサイドナビゲーション（ページ全体をリロードしない） */}
        <Link
          href={`/todos/${todo.id}/edit`}
          className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
        >
          編集
        </Link>
        <button
          onClick={handleDelete}
          className="rounded bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
        >
          削除
        </button>
      </div>
    </div>
  )
}
