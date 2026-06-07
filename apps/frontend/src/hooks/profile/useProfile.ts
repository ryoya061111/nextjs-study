'use client'

import { useEffect, useState } from 'react'
import { Profile } from '@/types/profile/shared/profile.types'

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) throw new Error('取得に失敗しました')
        const data = await response.json()
        setProfile(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'エラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { profile, loading, error }
}
