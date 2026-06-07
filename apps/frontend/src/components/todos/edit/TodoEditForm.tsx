'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TodoForm } from '../shared/TodoForm'
import { TodoFormValues } from '@/types/todo/shared/todo.schema'
import { useTodoDetail } from '@/hooks/todo/edit/useTodoDetail'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'

interface Props {
  id: string
}

export const TodoEditForm = ({ id }: Props) => {
  const router = useRouter()
  const { todo, loading, error, fetchTodo, updateTodo } = useTodoDetail(id)

  // マウント時に TODO を取得
  useEffect(() => {
    fetchTodo()
  }, [fetchTodo])

  const handleSubmit = async (data: TodoFormValues) => {
    if (!todo) return
    // hooks の updateTodo を呼び出す
    await updateTodo(data)
    router.push('/todos')
    router.refresh()
  }

  if (loading) return <LoadingSpinner />
  if (error) return <FormErrorMessage message={error} />
  if (!todo) return <FormErrorMessage message="TODO が見つかりません" />

  return (
    <TodoForm
      defaultValues={{ title: todo.title, description: todo.description }}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/todos')}
    />
  )
}
