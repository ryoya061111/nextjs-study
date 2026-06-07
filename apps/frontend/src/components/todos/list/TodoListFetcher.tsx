import { TodoList } from './TodoList'

export const TodoListFetcher = () => {
  // クライアント側で useTodos を使って管理
  // SSR データなし → クライアント側で初期化時に fetchTodos を実行
  return <TodoList initialTodos={[]} />
}
