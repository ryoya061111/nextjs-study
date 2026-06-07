import { TodoEditForm } from './TodoEditForm'

type Props = { id: string }

export const TodoEditFetcher = ({ id }: Props) => {
  // クライアント側で useTodoDetail を使って管理
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      <TodoEditForm id={id} />
    </div>
  )
}
