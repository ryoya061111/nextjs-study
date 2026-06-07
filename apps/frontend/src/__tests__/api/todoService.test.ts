import { describe, it, expect, beforeEach } from 'vitest'
import { todoListService } from '@/services/todo/list/todoService'
import { todoEditService } from '@/services/todo/edit/todoService'

describe('todoListService', () => {
  it('TODO 一覧を取得できる', async () => {
    // MSW がこのリクエストを拦截して mockTodos を返す
    const response = await fetch('/api/todos')
    expect(response.ok).toBe(true)
    const todos = await response.json()
    expect(Array.isArray(todos)).toBe(true)
  })

  it('TODO を作成できる', async () => {
    const newTodo = {
      title: 'テストタスク',
      description: 'これはテストです',
    }

    const todo = await todoListService.create(newTodo)

    expect(todo.id).toBeDefined()
    expect(todo.title).toBe('テストタスク')
    expect(todo.description).toBe('これはテストです')
    expect(todo.completed).toBe(false)
  })

  it('空のタイトルでも TODO を作成できる', async () => {
    // API はバリデーションをしないため、空のタイトルでも作成される
    const todo = await todoListService.create({
      title: '',
      description: '',
    })

    expect(todo.id).toBeDefined()
    expect(todo.title).toBe('')
  })

  it('TODO を削除できる', async () => {
    // 最初に TODO を作成
    const created = await todoListService.create({
      title: ' 削除対象',
      description: '',
    })

    // 削除
    await expect(todoListService.delete(created.id)).resolves.not.toThrow()
  })

  it('存在しない TODO を削除しようとするとエラーを投げる', async () => {
    await expect(todoListService.delete('nonexistent-id')).rejects.toThrow()
  })
})

describe('todoEditService', () => {
  let testTodoId: string

  beforeEach(async () => {
    const todo = await todoListService.create({
      title: 'テストタスク',
      description: 'テスト用',
    })
    testTodoId = todo.id
  })

  it('TODO を取得できる', async () => {
    const response = await fetch(`/api/todos/${testTodoId}`)
    expect(response.ok).toBe(true)
    const todo = await response.json()
    expect(todo.id).toBe(testTodoId)
  })

  it('存在しない TODO を取得しようとすると 404 を返す', async () => {
    const response = await fetch('/api/todos/nonexistent-id')
    expect(response.status).toBe(404)
  })

  it('TODO を更新できる', async () => {
    const updated = await todoEditService.update(testTodoId, {
      title: '更新されたタイトル',
      completed: true,
    })

    expect(updated.title).toBe('更新されたタイトル')
    expect(updated.completed).toBe(true)
  })

  it('完了状態をトグルできる', async () => {
    const updated = await todoEditService.update(testTodoId, {
      completed: true,
    })

    expect(updated.completed).toBe(true)

    const toggled = await todoEditService.update(testTodoId, {
      completed: false,
    })

    expect(toggled.completed).toBe(false)
  })

  it('存在しない TODO を更新しようとするとエラーを投げる', async () => {
    await expect(todoEditService.update('nonexistent-id', { completed: true })).rejects.toThrow()
  })
})
