'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoFormSchema, TodoFormValues } from '@/types/todo.schema'

interface Props {
  defaultValues?: TodoFormValues // 渡された場合は編集モード
  onSubmit: (data: TodoFormValues) => Promise<void>
  onCancel: () => void
}

export const TodoForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const {
    register, // input 要素を React Hook Form に登録する関数
    handleSubmit, // フォーム送信時にバリデーション実行 → 通過したら onSubmit を呼ぶラッパー
    formState: { errors, isSubmitting }, // errors: バリデーションエラー / isSubmitting: 送信中フラグ
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema), // Zod をバリデーターとして使用
    defaultValues: defaultValues ?? { title: '', description: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">タイトル</label>
        {/* ...register('title') = name・onChange・onBlur・ref を一括で設定する */}
        <input
          {...register('title')}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="タイトルを入力"
        />
        {/* errors.title が存在する場合のみエラーメッセージを表示 */}
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">説明</label>
        <textarea
          {...register('description')}
          className="mt-1 w-full rounded border px-3 py-2"
          rows={3}
          placeholder="説明を入力（任意）"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting} // 送信中は二重送信を防ぐ
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : defaultValues ? '更新' : '作成'}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
          キャンセル
        </button>
      </div>
    </form>
  )
}
