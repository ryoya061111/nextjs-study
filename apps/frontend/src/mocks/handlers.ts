import { http, HttpResponse } from 'msw'
import { mockTodos } from './mockTodos'
import { mockProfile } from './mockProfile'
import { Todo } from '@/types/todo/shared/todo.types'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'

// MSW handlers for mock API responses
export const handlers = [
  // ─── Todo ───────────────────────────────────────────

  http.get('/api/todos', () => {
    return HttpResponse.json(mockTodos)
  }),

  http.post('/api/todos', async ({ request }) => {
    const body = (await request.json()) as CreateTodoRequest
    const newTodo: Todo = {
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
    const todo = mockTodos.find((t: Todo) => t.id === params.id)
    if (!todo) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    return HttpResponse.json(todo)
  }),

  http.put('/api/todos/:id', async ({ params, request }) => {
    const body = await request.json()
    const index = mockTodos.findIndex((t: Todo) => t.id === params.id)
    if (index === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    mockTodos[index] = { ...mockTodos[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json(mockTodos[index])
  }),

  http.delete('/api/todos/:id', ({ params }) => {
    const index = mockTodos.findIndex((t: Todo) => t.id === params.id)
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
