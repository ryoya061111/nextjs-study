// Todo エンティティ（DB・APIレスポンスの形）
export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

// 作成リクエストの型（id・日時はサーバーで自動生成するため不要）
export interface CreateTodoRequest {
  title: string
  description: string
}

// 更新リクエストの型（すべての項目が任意 = Partial）
export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
}
