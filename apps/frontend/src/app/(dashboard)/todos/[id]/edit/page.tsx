import { TodoEditForm } from '@/components/todos/edit/TodoEditForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditTodoPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      <TodoEditForm id={id} />
    </div>
  )
}
