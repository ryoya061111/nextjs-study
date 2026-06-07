'use client'

import { useEffect, useState } from 'react'
import { Todo } from '@/types/todo/shared/todo.types'
import { TodoFormValues } from '@/types/todo/shared/todo.schema'
import { TodoItem } from './TodoItem'
import { TodoForm } from '../shared/TodoForm'
import { useTodos } from '@/hooks/todo/list/useTodos'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'

export const TodoList = () => {
  const { todos, loading, error, fetchTodos, createTodo, toggleTodo, deleteTodo } = useTodos()
  const [showForm, setShowForm] = useState(false)

  // 初期化時に fetchTodos を実行
  useEffect(() => {
    fetchTodos()
  }, [])

  const handleCreate = async (data: TodoFormValues) => {
    await createTodo(data)
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">TODO リスト</h1>
        <Button
          onClick={() => setShowForm((prev) => !prev)}
          variant={showForm ? 'secondary' : 'primary'}
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </Button>
      </div>

      {error && <FormErrorMessage message={error} />}

      {showForm && (
        <Card className="mb-6">
          <h2 className="mb-3 font-medium text-gray-900">新しい TODO を作成</h2>
          <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      {loading && <LoadingSpinner />}

      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-400">TODO がありません。作成してみましょう！</p>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} onToggle={toggleTodo} />
          ))
        )}
      </div>
    </div>
  )
}
