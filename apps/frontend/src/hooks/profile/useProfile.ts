'use client'

import { useCallback, useEffect, useState } from 'react'
import { Profile } from '@/types/profile/shared/profile.types'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'

type UpdatePayload = Omit<ProfileEditValues, 'links'> & { links: Record<string, string> }

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
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
  }, [])

  const updateProfile = useCallback(async (data: UpdatePayload) => {
    setError(null)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('更新に失敗しました')
      const updated = await response.json()
      setProfile(updated)
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '更新に失敗しました'
      setError(errorMsg)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return { profile, loading, error, fetchProfile, updateProfile }
}
