'use server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string } | void> {
  try {
    await signIn('credentials', { email, password, redirectTo: '/todos' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'メールアドレスまたはパスワードが正しくありません' }
    }
    // NEXT_REDIRECT は再スローが必要
    throw error
  }
}
