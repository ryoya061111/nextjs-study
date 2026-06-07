'use client'

import { useState, useCallback } from 'react'
import { Todo } from '@/types/todo/shared/todo.types'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'
import { todoListService } from '@/services/todo/list/todoService'
import { todoEditService } from '@/services/todo/edit/todoService'

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
  // useCallback：関数を再生成しないようにメモ化する。依存配列が空 = 初回のみ生成
  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    setLoading(true)
    try {
      const newTodo = await todoListService.create(data)
      setTodos((prev) => [...prev, newTodo]) // 既存リストの末尾に追加
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false) // 成功・失敗どちらでも loading を解除
    }
  }, [])

  // 完了状態の切り替え
  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      const updated = await todoEditService.update(id, { completed })
      // map で該当 id のものだけ更新し、残りはそのまま返す
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // 削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoListService.delete(id)
      setTodos((prev) => prev.filter((t) => t.id !== id)) // IDが一致しない項目だけ残す
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // フック利用側が必要なものだけ取り出せるようにオブジェクトで返す
  return { todos, loading, error, fetchTodos, createTodo, toggleTodo, deleteTodo }
}
