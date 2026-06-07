'use client'

import { useState, useCallback } from 'react'
import { Todo } from '@/types/todo/shared/todo.types'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

// 引数：初期データを受け取る（SSR か空配列）
export const useTodos = (initialTodos: Todo[] = []) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [loading, setLoading] = useState(initialTodos.length === 0)
  const [error, setError] = useState<string | null>(null)

  // 一覧取得
  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error('一覧取得に失敗しました')
      const data = await response.json()
      setTodos(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // 作成
  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    setLoading(true)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('作成に失敗しました')
      const newTodo = await res.json()
      setTodos((prev) => [...prev, newTodo])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // 完了状態の切り替え
  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (!res.ok) throw new Error('更新に失敗しました')
      const updated = await res.json()
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // 削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('削除に失敗しました')
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // フック利用側が必要なものだけ取り出せるようにオブジェクトで返す
  return { todos, loading, error, fetchTodos, createTodo, toggleTodo, deleteTodo }
}
