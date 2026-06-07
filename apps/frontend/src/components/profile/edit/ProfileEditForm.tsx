'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { profileEditSchema, ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { Button } from '@/components/ui/Button'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { AddressSection } from './sections/AddressSection'
import { LinksSection } from './sections/LinksSection'
import { SkillsSection } from './sections/SkillsSection'
import { useProfile } from '@/hooks/profile/useProfile'

type Props = {}

export const ProfileEditForm = ({}: Props) => {
  const { profile, loading, error, updateProfile } = useProfile()
  const [saved, setSaved] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: '',
      bio: '',
      address: { prefecture: '', city: '', street: '' },
      links: [],
      skills: [],
    },
  })

  // useProfile の useEffect で fetchProfile が自動的に呼ばれる
  // profile が取得されたら form の値を同期
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        bio: profile.bio,
        address: profile.address,
        links: Object.entries(profile.links).map(([key, value]) => ({ key, value })),
        skills: profile.skills,
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileEditValues) => {
    setSaved(false)
    // { key, value }[] → Record<string, string> に変換してから送信
    await updateProfile({
      ...data,
      links: Object.fromEntries(data.links.map(({ key, value }) => [key, value])),
    })
    setSaved(true)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <FormErrorMessage message={error} />
  if (!profile) return <FormErrorMessage message="プロフィール情報が見つかりません" />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && <FormErrorMessage message={error} />}
      {saved && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">✓ 保存しました</p>}

      {/* ① シンプルフィールド */}
      <BasicInfoSection email={profile.email} register={register} errors={errors} />

      {/* ② ネスト構造 */}
      <AddressSection register={register} errors={errors} />

      {/* ③ マップ（動的 key-value） */}
      <LinksSection control={control} register={register} errors={errors} />

      {/* ④ リスト（追加・削除可） */}
      <SkillsSection control={control} register={register} errors={errors} />

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        保存する
      </Button>
    </form>
  )
}
