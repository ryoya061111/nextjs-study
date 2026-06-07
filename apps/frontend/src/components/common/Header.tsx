import { auth } from '@/auth'
import Link from 'next/link'
import { LogoutButton } from './LogoutButton'

export const Header = async () => {
  const session = await auth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link href="/todos" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
          TODO アプリ
        </Link>

        <div className="flex items-center gap-4">
          {session?.user?.email && (
            <span className="text-sm text-gray-500">{session.user.email}</span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
