'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo.types'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { useTodos } from '@/hooks/useTodos'
import { TodoFormValues } from '@/types/todo.schema'

interface Props {
  initialTodos: Todo[] // SSR で取得した初期データ
}

export const TodoList = ({ initialTodos }: Props) => {
  // カスタムフックに初期データを渡して CRUD 操作を取得
  const { todos, loading, error, createTodo, toggleTodo, deleteTodo } = useTodos(initialTodos)

  // フォームの表示・非表示を管理するローカル状態
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (data: TodoFormValues) => {
    await createTodo(data)
    setShowForm(false) // 作成後にフォームを閉じる
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">TODO リスト</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-600">{error}</p>}

      {/* 新規作成フォーム（showForm が true のときだけ表示） */}
      {showForm && (
        <div className="mb-6 rounded border p-4">
          <h2 className="mb-3 font-medium">新しい TODO を作成</h2>
          <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* API 処理中のインジケーター */}
      {loading && <p className="text-gray-500">処理中...</p>}

      {/* TODO 一覧 */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-400">TODO がありません。作成してみましょう！</p>
        ) : (
          todos.map((todo) => (
            // key は React がリストの変化を追跡するために必要
            <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} onToggle={toggleTodo} />
          ))
        )}
      </div>
    </div>
  )
}
