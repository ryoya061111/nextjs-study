import { describe, it, expect } from 'vitest'
import { todoFormSchema } from '@/types/todo/shared/todo.schema'
import { loginFormSchema } from '@/types/auth/login/auth.schema'
import { profileEditSchema } from '@/types/profile/edit/profile.schema'

describe('todoFormSchema', () => {
  it('有効な値でパスする', () => {
    expect(() => todoFormSchema.parse({ title: 'テスト', description: '' })).not.toThrow()
  })

  it('タイトルが空のときエラー', () => {
    const result = todoFormSchema.safeParse({ title: '', description: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('タイトルは必須です')
    }
  })

  it('タイトルが101文字でエラー', () => {
    const result = todoFormSchema.safeParse({
      title: 'a'.repeat(101),
      description: '',
    })
    expect(result.success).toBe(false)
  })

  it('説明が501文字でエラー', () => {
    const result = todoFormSchema.safeParse({
      title: 'テスト',
      description: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('loginFormSchema', () => {
  it('有効な値でパスする', () => {
    expect(() =>
      loginFormSchema.parse({ email: 'test@example.com', password: 'password' })
    ).not.toThrow()
  })

  it('emailが空のときエラー', () => {
    const result = loginFormSchema.safeParse({
      email: '',
      password: 'password',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('メールアドレスを入力してください')
    }
  })

  it('不正なemailでエラー', () => {
    const result = loginFormSchema.safeParse({
      email: 'not-email',
      password: 'password',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('正しいメールアドレスを入力してください')
    }
  })

  it('passwordが空のときエラー', () => {
    const result = loginFormSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('パスワードを入力してください')
    }
  })
})

describe('profileEditSchema', () => {
  const validData = {
    name: 'テストユーザー',
    bio: 'これはテストです',
    address: {
      prefecture: '東京都',
      city: '渋谷区',
      street: '渋谷1-1-1',
    },
    links: [{ key: 'GitHub', value: 'https://github.com/example' }],
    skills: [{ name: 'TypeScript', level: 'intermediate' as const }],
  }

  it('有効な値でパスする', () => {
    expect(() => profileEditSchema.parse(validData)).not.toThrow()
  })

  it('nameが空のときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      name: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('名前を入力してください')
    }
  })

  it('bioが201文字でエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      bio: 'a'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('prefectureが空のときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      address: { prefecture: '', city: '渋谷区', street: '' },
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('都道府県を入力してください')
    }
  })

  it('linksのkeyが空のときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      links: [{ key: '', value: 'https://github.com' }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('キーを入力してください')
    }
  })

  it('linksのvalueが空のときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      links: [{ key: 'GitHub', value: '' }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('URLを入力してください')
    }
  })

  it('skillのnameが空のときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      skills: [{ name: '', level: 'intermediate' }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('スキル名を入力してください')
    }
  })

  it('skillのlevelが不正なときエラー', () => {
    const result = profileEditSchema.safeParse({
      ...validData,
      skills: [{ name: 'Go', level: 'master' }],
    })
    expect(result.success).toBe(false)
  })
})
