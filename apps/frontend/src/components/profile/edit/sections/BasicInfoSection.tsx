'use client'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { Profile } from '@/types/profile/shared/profile.types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'

type Props = {
  email: Profile['email']
  register: UseFormRegister<ProfileEditValues>
  errors: FieldErrors<ProfileEditValues>
}

// シンプルなフィールド（文字列・テキストエリア）の基本パターン
export const BasicInfoSection = ({ email, register, errors }: Props) => (
  <section>
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">基本情報</h2>
    <Card className="space-y-4">
      <Input label="名前" error={errors.name?.message} {...register('name')} />

      {/* 読み取り専用フィールドの表示例 */}
      <div>
        <p className="block text-sm font-medium text-gray-700">メールアドレス</p>
        <p className="mt-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
          {email}
        </p>
        <p className="mt-1 text-xs text-gray-400">メールアドレスは変更できません</p>
      </div>

      <Textarea label="自己紹介" rows={3} error={errors.bio?.message} {...register('bio')} />
    </Card>
  </section>
)
