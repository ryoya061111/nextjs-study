'use client'
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'
import { ProfileEditValues } from '@/types/profile/edit/profile.schema'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const LEVEL_OPTIONS = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'expert', label: '上級' },
]

type Props = {
  control: Control<ProfileEditValues>
  register: UseFormRegister<ProfileEditValues>
  errors: FieldErrors<ProfileEditValues>
}

// リストパターン：同じ構造のアイテムを動的に追加・削除できる
// マップとの違い：各アイテムのキー（ラベル）は固定（name / level）
// useFieldArray の append に defaultValues を渡すとフォームの初期値になる
export const SkillsSection = ({ control, register, errors }: Props) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'skills' })

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        スキル
        <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs font-normal text-green-700">
          リスト（追加可）
        </span>
      </h2>
      <Card className="space-y-3">
        {fields.length > 0 && (
          <div className="grid grid-cols-[2fr_1fr_auto] gap-2">
            <p className="text-xs font-medium text-gray-500">スキル名</p>
            <p className="text-xs font-medium text-gray-500">レベル</p>
            <span />
          </div>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_1fr_auto] items-start gap-2">
            <Input
              placeholder="TypeScript"
              error={errors.skills?.[index]?.name?.message}
              {...register(`skills.${index}.name`)}
            />
            <Select
              options={LEVEL_OPTIONS}
              error={errors.skills?.[index]?.level?.message}
              {...register(`skills.${index}.level`)}
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
          onClick={() => append({ name: '', level: 'beginner' })}
        >
          + スキルを追加
        </Button>
      </Card>
    </section>
  )
}
