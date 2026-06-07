// Server Action: 認証ロジック
//
// なぜ Server Action で定義するのか：
// - signIn（Auth.js）は サーバー専用関数
// - HTTP-only Cookie へのアクセスが必要
// - Client Component（hooks）からは呼べない
//
// なぜ hooks にしないのか：
// - useState/useCallback のメリットがない
// - signIn が成功するとリダイレクトされる
// - state 管理が不要
//
// 認証フロー：
// LoginForm（Client） → loginAction（Server Action） → signIn（Auth.js） → Session Cookie

'use server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(
  email: string,
  password: string
): Promise<{ error: string } | void> {
  try {
    // Auth.js の signIn：認証を実行してセッションを作成
    // 成功時は自動的に redirectTo（/todos）へリダイレクト
    await signIn('credentials', { email, password, redirectTo: '/todos' })
  } catch (error) {
    if (error instanceof AuthError) {
      // 認証失敗：エラーメッセージをクライアントに返す
      return { error: 'メールアドレスまたはパスワードが正しくありません' }
    }
    // NEXT_REDIRECT は再スローが必要（signIn の内部でリダイレクト）
    throw error
  }
}
