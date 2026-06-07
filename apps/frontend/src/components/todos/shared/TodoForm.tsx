'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoFormSchema, TodoFormValues } from '@/types/todo/shared/todo.schema'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface Props {
  defaultValues?: TodoFormValues // 渡された場合は編集モード
  onSubmit: (data: TodoFormValues) => Promise<void>
  onCancel: () => void
}

export const TodoForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: defaultValues ?? { title: '', description: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register('title')}
        label="タイトル"
        placeholder="タイトルを入力"
        error={errors.title?.message}
      />
      <Textarea
        {...register('description')}
        label="説明"
        placeholder="説明を入力（任意）"
        rows={3}
        error={errors.description?.message}
      />
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {defaultValues ? '更新' : '作成'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  )
}
