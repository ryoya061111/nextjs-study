'use client'

import { useRouter } from 'next/navigation'
import { Todo } from '@/types/todo/shared/todo.types'
import { TodoForm } from '../shared/TodoForm'
import { todoEditService } from '@/services/todo/edit/todoService'
import { TodoFormValues } from '@/types/todo/shared/todo.schema'

interface Props {
  todo: Todo
}

export const TodoEditForm = ({ todo }: Props) => {
  // [Next.js お約束] useRouter は 'next/navigation' からインポートする（App Router 用）
  // 'next/router' は Pages Router 用で App Router では使えない
  const router = useRouter()

  const handleSubmit = async (data: TodoFormValues) => {
    await todoEditService.update(todo.id, data)
    router.push('/todos') // 別ページへ遷移（ブラウザの履歴に追加される）
    // [Next.js お約束] router.refresh() = Server Component のキャッシュを破棄して再フェッチ
    // push だけでは Server Component のデータが古いまま表示されることがある
    router.refresh()
  }

  return (
    <TodoForm
      defaultValues={{ title: todo.title, description: todo.description }}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/todos')}
    />
  )
}
