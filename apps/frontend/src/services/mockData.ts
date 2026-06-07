import { Todo } from '@/types/todo.types'

// モジュールレベルで宣言 → サーバー起動中はメモリ上に保持される
// ※ サーバー再起動でリセットされる。本番では DB（MySQL）に置き換える
export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Next.js の App Router を学ぶ',
    description: 'Server Component と Client Component の違いを理解する',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'React Hook Form + Zod を試す',
    description: 'フォームバリデーションの実装方法を学ぶ',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
