'use client'

import { useState, useCallback } from 'react'
import { Todo, CreateTodoRequest } from '@/types/todo.types'
import { todoService } from '@/services/todoService'

// 引数：SSR で取得した初期データを受け取る
export const useTodos = (initialTodos: Todo[]) => {
  // useState の初期値に SSR データを使うことで、画面表示がサーバーとクライアントで一致する
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 作成
  // useCallback：関数を再生成しないようにメモ化する。依存配列が空 = 初回のみ生成
  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    setLoading(true)
    try {
      const newTodo = await todoService.create(data)
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
      const updated = await todoService.update(id, { completed })
      // map で該当 id のものだけ更新し、残りはそのまま返す
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // 削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoService.delete(id)
      setTodos((prev) => prev.filter((t) => t.id !== id)) // IDが一致しない項目だけ残す
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // フック利用側が必要なものだけ取り出せるようにオブジェクトで返す
  return { todos, loading, error, createTodo, toggleTodo, deleteTodo }
}
