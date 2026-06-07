'use client'

import Link from 'next/link'
import { Todo } from '@/types/todo/shared/todo.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'

interface Props {
  todo: Todo
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}

export const TodoItem = ({ todo, onDelete, onToggle }: Props) => {
  const handleDelete = () => {
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      onDelete(todo.id)
    }
  }

  return (
    <Card className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Checkbox checked={todo.completed} onChange={(e) => onToggle(todo.id, e.target.checked)} />
        <div>
          <p
            className={`font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}
          >
            {todo.title}
          </p>
          <p className="text-sm text-gray-500">{todo.description}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Link コンポーネント = Next.js のクライアントサイドナビゲーション（ページ全体をリロードしない） */}
        <Link
          href={`/todos/${todo.id}/edit`}
          className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          編集
        </Link>
        <Button size="sm" variant="danger" onClick={handleDelete}>
          削除
        </Button>
      </div>
    </Card>
  )
}
