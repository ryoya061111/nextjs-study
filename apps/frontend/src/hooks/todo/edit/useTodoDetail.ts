'use client'

import { useCallback, useEffect, useState } from 'react'
import { Todo } from '@/types/todo/shared/todo.types'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

export const useTodoDetail = (id: string) => {
  const [todo, setTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodo = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/todos/${id}`)
      if (!response.ok) throw new Error('取得に失敗しました')
      const data = await response.json()
      setTodo(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [id])

  // TODO を更新
  const updateTodo = useCallback(
    async (data: UpdateTodoRequest) => {
      if (!todo) throw new Error('TODO が見つかりません')
      try {
        const res = await fetch(`/api/todos/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('更新に失敗しました')
        const updated = await res.json()
        setTodo(updated)
        return updated
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'エラーが発生しました'
        setError(errorMsg)
        throw new Error(errorMsg)
      }
    },
    [todo]
  )

  return { todo, loading, error, fetchTodo, updateTodo }
}
