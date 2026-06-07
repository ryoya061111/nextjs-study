// [Next.js お約束] page.tsx = そのURLのページ本体
// このファイルのURL: app/(dashboard)/todos/[id]/edit/page.tsx → /todos/:id/edit
// [id] = 動的セグメント。URLの該当部分が params.id として受け取れる
// 例: /todos/123/edit にアクセスすると params.id = "123"

// [Next.js お約束] notFound() = next/navigation からインポートするサーバー関数
// 呼ぶと not-found.tsx が表示される（なければデフォルトの404）
import { notFound } from 'next/navigation'
import { todoRepository } from '@/services/todo/todoRepository'
import { TodoEditForm } from '@/components/todos/edit/TodoEditForm'

// [Next.js お約束] Next.js 15 から params は Promise 型 → await 必須
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
