import { Profile } from '@/types/profile/shared/profile.types'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'

// links は変換済み（Record<string, string>）の形で受け取る
type UpdatePayload = Omit<ProfileEditValues, 'links'> & { links: Record<string, string> }

export const profileEditService = {
  update: async (data: UpdatePayload): Promise<Profile> => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新に失敗しました')
    return res.json()
  },
}
