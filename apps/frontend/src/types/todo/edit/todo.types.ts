// 更新リクエストの型（すべての項目が任意 = Partial）
export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
}
