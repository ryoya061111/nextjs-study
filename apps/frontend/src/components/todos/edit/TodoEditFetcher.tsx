import { notFound } from 'next/navigation'
import { todoRepository } from '@/services/todo/shared/todoRepository'
import { TodoEditForm } from './TodoEditForm'

type Props = { id: string }

export const TodoEditFetcher = async ({ id }: Props) => {
  const todo = todoRepository.getById(id)
  if (!todo) notFound()

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      <TodoEditForm todo={todo} />
    </div>
  )
}
