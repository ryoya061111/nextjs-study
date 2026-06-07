'use client'

import { useRouter } from 'next/navigation'
import { Todo } from '@/types/todo.types'
import { TodoForm } from './TodoForm'
import { todoService } from '@/services/todoService'
import { TodoFormValues } from '@/types/todo.schema'

interface Props {
  todo: Todo
}

export const TodoEditForm = ({ todo }: Props) => {
  // useRouter = クライアントサイドでページ遷移を行うフック（'next/navigation' は App Router 用）
  const router = useRouter()

  const handleSubmit = async (data: TodoFormValues) => {
    await todoService.update(todo.id, data)
    router.push('/todos') // 更新後に一覧ページへ戻る
    router.refresh() // Server Component のデータキャッシュを破棄して再フェッチする
  }

  return (
    <TodoForm
      defaultValues={{ title: todo.title, description: todo.description }}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/todos')}
    />
  )
}
