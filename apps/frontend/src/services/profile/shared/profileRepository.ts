import { mockProfile } from './mockProfile'
import { Profile } from '@/types/profile/shared/profile.types'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'

export const profileRepository = {
  get: (): Profile => ({ ...mockProfile, address: { ...mockProfile.address } }),

  update: (data: ProfileEditValues): Profile => {
    Object.assign(mockProfile, data)
    return profileRepository.get()
  },
}
