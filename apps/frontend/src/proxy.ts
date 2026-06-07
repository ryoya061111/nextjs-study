import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
})

// /todos 配下を認証必須に設定（将来のダッシュボードルートも追加していく）
export const config = {
  matcher: ['/todos/:path*'],
}
