// 編集ページ（Server Component）
// URL: /todos/[id]/edit
import { todoService } from '@/services/todoService'
import { TodoEditForm } from '@/components/todos/TodoEditForm'

// Next.js App Router では動的ルートのパラメータは Promise 型
type Props = { params: Promise<{ id: string }> }

export default async function EditTodoPage({ params }: Props) {
  // params を await して id を取り出す（Next.js 15 からの仕様）
  const { id } = await params

  // サーバー上で対象 TODO を取得（SSR）
  const todo = await todoService.getById(id)

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      {/* 取得した todo データを Client Component に渡す */}
      <TodoEditForm todo={todo} />
    </div>
  )
}
