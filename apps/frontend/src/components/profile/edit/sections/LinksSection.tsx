'use client'
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type Props = {
  control: Control<ProfileEditValues>
  register: UseFormRegister<ProfileEditValues>
  errors: FieldErrors<ProfileEditValues>
}

// マップパターン：ユーザーが「キー（ラベル）」と「バリュー（URL）」を自由に追加できる
// useFieldArray でフィールドの追加・削除を管理する
// key には field.id を使う（配列インデックスだと削除時に React が誤った要素を再利用する）
export const LinksSection = ({ control, register, errors }: Props) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'links' })

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        リンク
        <span className="ml-2 rounded bg-purple-100 px-2 py-0.5 text-xs font-normal text-purple-700">
          マップ
        </span>
      </h2>
      <Card className="space-y-3">
        {/* カラムヘッダー */}
        {fields.length > 0 && (
          <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <p className="text-xs font-medium text-gray-500">ラベル</p>
            <p className="text-xs font-medium text-gray-500">URL</p>
            <span />
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_2fr_auto] items-start gap-2">
            <Input
              placeholder="GitHub"
              error={errors.links?.[index]?.key?.message}
              {...register(`links.${index}.key`)}
            />
            <Input
              placeholder="https://..."
              error={errors.links?.[index]?.value?.message}
              {...register(`links.${index}.value`)}
            />
            <Button type="button" variant="danger" size="sm" onClick={() => remove(index)}>
              削除
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ key: '', value: '' })}
        >
          + リンクを追加
        </Button>
      </Card>
    </section>
  )
}
