import { z } from 'zod'

// フォーム入力値のバリデーションルール定義
export const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください'),
})

// Zod スキーマから TypeScript の型を自動生成する
// → 型定義とバリデーション定義が常に一致する
export type TodoFormValues = z.infer<typeof todoFormSchema>
