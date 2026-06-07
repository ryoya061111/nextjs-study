// 編集ページ（Server Component）
// URL: /todos/[id]/edit
import { notFound } from 'next/navigation'
import { todoRepository } from '@/services/todoRepository'
import { TodoEditForm } from '@/components/todos/TodoEditForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditTodoPage({ params }: Props) {
  const { id } = await params

  // Server Component からデータソースに直接アクセス
  const todo = todoRepository.getById(id)

  // 存在しない ID の場合は 404 ページを表示する
  if (!todo) notFound()

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      <TodoEditForm todo={todo} />
    </div>
  )
}
