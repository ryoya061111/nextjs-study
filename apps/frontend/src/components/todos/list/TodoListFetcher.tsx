import { TodoList } from './TodoList'

export const TodoListFetcher = async () => {
  // SSR で API から初期データを取得
  const response = await fetch('http://localhost:3000/api/todos', {
    cache: 'no-store', // SSR 毎回取得
  })
  const initialTodos = response.ok ? await response.json() : []

  return <TodoList initialTodos={initialTodos} />
}
