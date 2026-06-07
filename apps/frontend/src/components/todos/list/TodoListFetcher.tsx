import { todoRepository } from '@/services/todo/shared/todoRepository'
import { TodoList } from './TodoList'

export const TodoListFetcher = async () => {
  const todos = todoRepository.getAll()
  return <TodoList initialTodos={todos} />
}
