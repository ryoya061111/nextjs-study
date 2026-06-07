import { z } from 'zod'

export const profileEditSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  bio: z.string().max(200, '200文字以内で入力してください'),

  // ネスト構造：z.object() をネストするだけで対応できる
  address: z.object({
    prefecture: z.string().min(1, '都道府県を入力してください'),
    city: z.string().min(1, '市区町村を入力してください'),
    street: z.string(),
  }),

  // マップ：RHF は Record を直接扱えないため、フォーム内部は { key, value } 配列で持つ
  // 保存時に Object.fromEntries() で Record<string, string> に変換する
  links: z.array(
    z.object({
      key: z.string().min(1, 'キーを入力してください'),
      value: z.string().min(1, 'URLを入力してください'),
    })
  ),

  // リスト：{ name, level } オブジェクトの配列として定義
  skills: z.array(
    z.object({
      name: z.string().min(1, 'スキル名を入力してください'),
      level: z.enum(['beginner', 'intermediate', 'expert']),
    })
  ),
})

export type ProfileEditValues = z.infer<typeof profileEditSchema>
