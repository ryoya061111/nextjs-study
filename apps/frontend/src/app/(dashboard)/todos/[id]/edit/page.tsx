import { TodoEditFetcher } from '@/components/todos/edit/TodoEditFetcher'

type Props = { params: Promise<{ id: string }> }

export default async function EditTodoPage({ params }: Props) {
  const { id } = await params
  return <TodoEditFetcher id={id} />
}
