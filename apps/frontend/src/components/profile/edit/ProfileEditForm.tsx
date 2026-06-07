'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Profile } from '@/types/profile/shared/profile.types'
import { profileEditSchema, ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { profileEditService } from '@/services/profile/edit/profileService'
import { Button } from '@/components/ui/Button'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { AddressSection } from './sections/AddressSection'
import { LinksSection } from './sections/LinksSection'
import { SkillsSection } from './sections/SkillsSection'

type Props = { profile: Profile }

export const ProfileEditForm = ({ profile }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio,
      address: profile.address,
      // Record<string, string> → { key, value }[] に変換してフォームで扱えるようにする
      links: Object.entries(profile.links).map(([key, value]) => ({ key, value })),
      skills: profile.skills,
    },
  })

  const onSubmit = async (data: ProfileEditValues) => {
    setServerError(null)
    setSaved(false)
    try {
      // { key, value }[] → Record<string, string> に変換してから送信
      await profileEditService.update({
        ...data,
        links: Object.fromEntries(data.links.map(({ key, value }) => [key, value])),
      })
      setSaved(true)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : '更新に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && <FormErrorMessage message={serverError} />}
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
