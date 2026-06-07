import { http, HttpResponse } from 'msw'
import { mockTodos } from '@/services/todo/shared/mockData'
import { mockProfile } from '@/services/profile/shared/mockProfile'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

// ここに書いたハンドラが API Route の代わりにリクエストを処理する
// API Route ファイルが存在していても、MSW が先にリクエストを横取りする
export const handlers = [
  // ─── Todo ───────────────────────────────────────────

  http.get('/api/todos', () => {
    return HttpResponse.json(mockTodos)
  }),

  http.post('/api/todos', async ({ request }) => {
    const body = (await request.json()) as CreateTodoRequest
    const newTodo = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockTodos.push(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  http.get('/api/todos/:id', ({ params }) => {
    const todo = mockTodos.find((t) => t.id === params.id)
    if (!todo) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    return HttpResponse.json(todo)
  }),

  http.put('/api/todos/:id', async ({ params, request }) => {
    const body = (await request.json()) as UpdateTodoRequest
    const index = mockTodos.findIndex((t) => t.id === params.id)
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    mockTodos[index] = { ...mockTodos[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json(mockTodos[index])
  }),

  http.delete('/api/todos/:id', ({ params }) => {
    const index = mockTodos.findIndex((t) => t.id === params.id)
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    mockTodos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Profile ────────────────────────────────────────

  http.get('/api/profile', () => {
    return HttpResponse.json(mockProfile)
  }),

  http.put('/api/profile', async ({ request }) => {
    const body = await request.json()
    Object.assign(mockProfile, body)
    return HttpResponse.json(mockProfile)
  }),
]
