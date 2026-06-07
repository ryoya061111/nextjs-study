import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm'

export const metadata = { title: 'プロフィール編集' }

export default function ProfileEditPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">プロフィール編集</h1>
      <ProfileEditForm />
    </div>
  )
}
