import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// モック認証用の固定ユーザー
const MOCK_USER = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  password: 'password123',
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials.email === MOCK_USER.email && credentials.password === MOCK_USER.password) {
          return { id: MOCK_USER.id, name: MOCK_USER.name, email: MOCK_USER.email }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
})
