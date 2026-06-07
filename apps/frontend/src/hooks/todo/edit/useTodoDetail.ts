'use client'

import { useEffect, useState } from 'react'
import { Todo } from '@/types/todo/shared/todo.types'

export const useTodoDetail = (id: string) => {
  const [todo, setTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodo = async () => {
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
    }

    fetchTodo()
  }, [id])

  return { todo, loading, error }
}
