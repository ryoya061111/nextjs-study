import Link from 'next/link'

type PageLink = { href: string; label: string; description: string }

const PAGES: PageLink[] = [
  { href: '/auth/login', label: 'ログイン', description: 'メールアドレスとパスワードで認証' },
  {
    href: '/todos',
    label: 'TODO 一覧',
    description: '一覧表示・新規作成・完了切替・削除（要ログイン）',
  },
  {
    href: '/profile/edit',
    label: 'プロフィール編集',
    description: 'ネスト・マップ・リストのフォームパターン（要ログイン）',
  },
]

const DEV_PAGES: PageLink[] = [
  { href: '/ui', label: 'UI コンポーネント一覧', description: '共通パーツのサンプル' },
]

function Section({ title, pages }: { title: string; pages: PageLink[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </h2>
      <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {pages.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-blue-50"
            >
              <div>
                <p className="font-semibold text-gray-900">{page.label}</p>
                <p className="mt-0.5 text-sm text-gray-500">{page.description}</p>
              </div>
              <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 font-mono text-xs text-gray-500">
                {page.href}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">サンプルリンク集</h1>
          <p className="mt-1 text-sm text-gray-500">各ページへのリンク一覧です。</p>
        </div>
        <Section title="ページ" pages={PAGES} />
        <Section title="開発ツール" pages={DEV_PAGES} />
      </div>
    </div>
  )
}
