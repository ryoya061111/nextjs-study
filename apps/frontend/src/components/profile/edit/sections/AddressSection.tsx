'use client'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

type Props = {
  register: UseFormRegister<ProfileEditValues>
  errors: FieldErrors<ProfileEditValues>
}

// ネスト構造パターン：オブジェクトの中のフィールドを編集する
// register('address.prefecture') のようにドット記法でネストにアクセスできる
// Zod スキーマも z.object({ address: z.object({...}) }) でネストを表現している
export const AddressSection = ({ register, errors }: Props) => (
  <section>
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
      住所
      <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-normal text-blue-700">
        ネスト構造
      </span>
    </h2>
    <Card className="space-y-4">
      <Input
        label="都道府県"
        placeholder="東京都"
        error={errors.address?.prefecture?.message}
        {...register('address.prefecture')}
      />
      <Input
        label="市区町村"
        placeholder="渋谷区"
        error={errors.address?.city?.message}
        {...register('address.city')}
      />
      <Input
        label="番地・建物名"
        placeholder="渋谷1-1-1"
        error={errors.address?.street?.message}
        {...register('address.street')}
      />
    </Card>
  </section>
)
