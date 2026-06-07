import { LoginForm } from '@/components/auth/login/LoginForm'

export const metadata = { title: 'ログイン' }

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">ログイン</h1>

      <p className="mb-6 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
        test@example.com / password123
      </p>

      <LoginForm />
    </div>
  )
}
