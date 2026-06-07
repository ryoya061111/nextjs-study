// 'use client' を付けない = Server Component（サーバーサイドで実行される）
import { todoService } from '@/services/todoService'
import { TodoList } from '@/components/todos/TodoList'

// async 関数にすることで、サーバー上で await を使ったデータ取得ができる
export default async function TodosPage() {
  // サーバー上で fetch を実行 → HTML 生成時に初期データが埋め込まれる（SSR）
  const initialTodos = await todoService.getAll()

  // 取得したデータを Client Component に props として渡す
  // Server Component → Client Component へのデータの橋渡し
  return <TodoList initialTodos={initialTodos} />
}
