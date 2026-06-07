// Server Component 専用のデータアクセス層
// API Route を経由せず mockData に直接アクセスする
// → Server Component はデータソースに直接アクセスできる（fetchを使う必要がない）
// ※ 将来 DB（MySQL）に繋ぐ場合もここだけ書き換えればよい
import { mockTodos } from '@/services/mockData'
import { Todo } from '@/types/todo.types'

export const todoRepository = {
  // 全件取得（配列のコピーを返す）
  getAll: (): Todo[] => [...mockTodos],

  // 1件取得（見つからない場合は null）
  getById: (id: string): Todo | null => mockTodos.find((t) => t.id === id) ?? null,
}
