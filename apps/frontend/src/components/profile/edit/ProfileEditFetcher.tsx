import { profileRepository } from '@/services/profile/shared/profileRepository'
import { ProfileEditForm } from './ProfileEditForm'

export const ProfileEditFetcher = async () => {
  const profile = profileRepository.get()
  return <ProfileEditForm profile={profile} />
}
