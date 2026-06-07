// [Next.js お約束] route.ts = API エンドポイント定義ファイル
// 関数名が HTTP メソッド名に対応する（GET/POST/PUT/DELETE/PATCH）
// このファイルの URL = app/api/todos/ → /api/todos
// GET /api/todos  → 一覧取得
// POST /api/todos → 新規作成
import { NextResponse } from 'next/server'
import { mockTodos } from '@/services/todo/shared/mockData'
import { CreateTodoRequest } from '@/types/todo/list/todo.types'

export async function GET() {
  return NextResponse.json(mockTodos)
}

export async function POST(request: Request) {
  const body: CreateTodoRequest = await request.json()

  const newTodo = {
    id: Date.now().toString(), // 簡易ID生成（本番では UUID を使う）
    title: body.title,
    description: body.description,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockTodos.push(newTodo) // メモリ上の配列に追加
  return NextResponse.json(newTodo, { status: 201 }) // 201: Created
}
