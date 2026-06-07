'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export const LogoutButton = () => (
  <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
    ログアウト
  </Button>
)
