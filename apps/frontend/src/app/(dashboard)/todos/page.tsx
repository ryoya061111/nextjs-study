// 'use client' を付けない = Server Component（サーバーサイドで実行される）
import { todoRepository } from '@/services/todoRepository'
import { TodoList } from '@/components/todos/TodoList'

export default async function TodosPage() {
  // Server Component はデータソースに直接アクセスできる（fetch を経由する必要がない）
  // fetch('/api/todos') は相対URLのためサーバー側では解決できずエラーになる
  const initialTodos = todoRepository.getAll()

  // 取得したデータを Client Component に props として渡す
  return <TodoList initialTodos={initialTodos} />
}
