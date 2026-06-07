import { describe, it, expect } from 'vitest'
import { profileEditService } from '@/services/profile/edit/profileService'

describe('profileEditService', () => {
  it('プロフィール情報を取得できる', async () => {
    const response = await fetch('/api/profile')
    expect(response.ok).toBe(true)
    const profile = await response.json()

    expect(profile.id).toBeDefined()
    expect(profile.name).toBeDefined()
    expect(profile.email).toBeDefined()
  })

  it('プロフィール情報を更新できる', async () => {
    const updateData = {
      name: '更新されたユーザー',
      bio: '更新されたバイオ',
      address: {
        prefecture: '大阪府',
        city: '大阪市',
        street: '北区1-1-1',
      },
      links: {
        GitHub: 'https://github.com/updated',
        Twitter: 'https://twitter.com/updated',
      },
      skills: [
        { name: 'Go', level: 'expert' as const },
        { name: 'Rust', level: 'beginner' as const },
      ],
    }

    const updated = await profileEditService.update(updateData)

    expect(updated.name).toBe('更新されたユーザー')
    expect(updated.bio).toBe('更新されたバイオ')
    expect(updated.address.prefecture).toBe('大阪府')
  })

  it('ネストされた address を更新できる', async () => {
    const updateData = {
      name: 'テストユーザー',
      bio: 'テスト',
      address: {
        prefecture: '東京都',
        city: '千代田区',
        street: '丸の内1-1-1',
      },
      links: {},
      skills: [],
    }

    const updated = await profileEditService.update(updateData)

    expect(updated.address).toEqual({
      prefecture: '東京都',
      city: '千代田区',
      street: '丸の内1-1-1',
    })
  })

  it('Record 形式の links を更新できる', async () => {
    const updateData = {
      name: 'テストユーザー',
      bio: 'テスト',
      address: {
        prefecture: '東京都',
        city: '渋谷区',
        street: '渋谷1-1-1',
      },
      links: {
        GitHub: 'https://github.com/test',
        LinkedIn: 'https://linkedin.com/in/test',
        Portfolio: 'https://portfolio.test',
      },
      skills: [],
    }

    const updated = await profileEditService.update(updateData)

    expect(updated.links.GitHub).toBe('https://github.com/test')
    expect(updated.links.LinkedIn).toBe('https://linkedin.com/in/test')
    expect(updated.links.Portfolio).toBe('https://portfolio.test')
  })

  it('リスト形式の skills を更新できる', async () => {
    const updateData = {
      name: 'テストユーザー',
      bio: 'テスト',
      address: {
        prefecture: '東京都',
        city: '渋谷区',
        street: '渋谷1-1-1',
      },
      links: {},
      skills: [
        { name: 'TypeScript', level: 'expert' as const },
        { name: 'React', level: 'intermediate' as const },
        { name: 'Next.js', level: 'intermediate' as const },
      ],
    }

    const updated = await profileEditService.update(updateData)

    expect(updated.skills).toHaveLength(3)
    expect(updated.skills[0].name).toBe('TypeScript')
    expect(updated.skills[0].level).toBe('expert')
  })

  it('すべてのフィールドを一度に更新できる', async () => {
    const updateData = {
      name: 'フルアップデート',
      bio: 'すべてのフィールドを更新します',
      address: {
        prefecture: '京都府',
        city: '京都市',
        street: '中京区1-1-1',
      },
      links: {
        GitHub: 'https://github.com/full',
        Twitter: 'https://twitter.com/full',
      },
      skills: [{ name: 'Kubernetes', level: 'beginner' as const }],
    }

    const updated = await profileEditService.update(updateData)

    expect(updated.name).toBe('フルアップデート')
    expect(updated.bio).toBe('すべてのフィールドを更新します')
    expect(updated.address.prefecture).toBe('京都府')
    expect(Object.keys(updated.links)).toContain('GitHub')
    expect(updated.skills).toHaveLength(1)
  })

  it('更新後の値が正しく反映されている', async () => {
    const updateData = {
      name: '新しい名前',
      bio: '新しいバイオ',
      address: {
        prefecture: '兵庫県',
        city: '神戸市',
        street: '中央区1-1-1',
      },
      links: {},
      skills: [],
    }

    const updated = await profileEditService.update(updateData)

    // 返り値で更新されたデータが返っているか確認
    expect(updated.name).toBe('新しい名前')
    expect(updated.bio).toBe('新しいバイオ')

    // API から取得した値でも確認
    const retrieved = await fetch('/api/profile').then((res) => res.json())
    expect(retrieved.name).toBe('新しい名前')
    expect(retrieved.bio).toBe('新しいバイオ')
  })
})
