// Auth.js 設定
// - handlers：/api/auth/[...nextauth]/route.ts にエクスポート
// - signIn：Server Action から呼び出し
// - signOut：ログアウト処理
// - auth：セッション取得（Server Component/Action で使用）

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// モック認証用の固定ユーザー
// 本番では DB から検証する
const MOCK_USER = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  password: 'password123',
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Credentials Provider：メール＋パスワード認証
  // MSW では モック不要（Auth.js が直接処理）
  providers: [
    Credentials({
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      // 認証ロジック：ユーザー検証
      authorize: async (credentials) => {
        if (credentials.email === MOCK_USER.email && credentials.password === MOCK_USER.password) {
          return { id: MOCK_USER.id, name: MOCK_USER.name, email: MOCK_USER.email }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/login', // ログインページ
  },
  session: {
    strategy: 'jwt', // JWT でセッション管理
  },
})
