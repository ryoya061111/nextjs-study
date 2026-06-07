// [Next.js お約束] page.tsx = そのURLのページ本体
// このファイルのURL: app/(dashboard)/todos/page.tsx → /todos
// (dashboard) はルートグループ（URLに出ない。レイアウトのグループ分け用）

// [Next.js お約束] 'use client' を付けない = Server Component（デフォルト）
// サーバー上でのみ実行され、ブラウザには届かない
import { todoRepository } from '@/services/todoRepository'
import { TodoList } from '@/components/todos/TodoList'

export default async function TodosPage() {
  // Server Component はデータソースに直接アクセスできる（fetch を経由する必要がない）
  // fetch('/api/todos') は相対URLのためサーバー側では解決できずエラーになる
  const initialTodos = todoRepository.getAll()

  // 取得したデータを Client Component に props として渡す
  return <TodoList initialTodos={initialTodos} />
}
