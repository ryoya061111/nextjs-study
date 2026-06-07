'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { loginFormSchema, LoginFormValues } from '@/types/auth/login/auth.schema'
import { loginAction } from '@/app/(auth)/login/actions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'

export const LoginForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)
    // Server Action を呼び出す（Client Component から Server Action へ）
    // loginAction は signIn（Auth.js）を実行
    const result = await loginAction(values.email, values.password)
    // 認証失敗時のエラーメッセージを表示
    if (result?.error) {
      setServerError(result.error)
    }
    // 認証成功時は loginAction 内で自動的に /todos へリダイレクト
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && <FormErrorMessage message={serverError} />}

      <Input
        label="メールアドレス"
        type="email"
        placeholder="test@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="パスワード"
        type="password"
        placeholder="パスワードを入力"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        ログイン
      </Button>
    </form>
  )
}
