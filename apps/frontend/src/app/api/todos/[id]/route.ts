// [Next.js お約束] [id] フォルダ = 動的セグメント
// 角括弧内の名前がURLパラメータ名になる
// /api/todos/123 にアクセスすると params.id = "123" になる
// GET    /api/todos/[id] → 1件取得
// PUT    /api/todos/[id] → 更新
// DELETE /api/todos/[id] → 削除
import { NextResponse } from 'next/server'
import { mockTodos } from '@/services/todo/shared/mockData'
import { UpdateTodoRequest } from '@/types/todo/edit/todo.types'

// [Next.js お約束] Next.js 15 から params は Promise 型 → await が必要
type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const todo = mockTodos.find((t) => t.id === id)
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(todo)
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const body: UpdateTodoRequest = await request.json()
  const index = mockTodos.findIndex((t) => t.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // 既存データと更新データをマージする（Partial なので undefined の項目は変更しない）
  mockTodos[index] = { ...mockTodos[index], ...body, updatedAt: new Date().toISOString() }
  return NextResponse.json(mockTodos[index])
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const index = mockTodos.findIndex((t) => t.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  mockTodos.splice(index, 1) // 配列から削除
  return new NextResponse(null, { status: 204 }) // 204: No Content（削除成功）
}
