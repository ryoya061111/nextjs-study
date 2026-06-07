import { Profile } from '@/types/profile/shared/profile.types'

export const mockProfile: Profile = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  bio: 'Next.js を学習中です。',
  address: {
    prefecture: '東京都',
    city: '渋谷区',
    street: '渋谷1-1-1',
  },
  links: {
    GitHub: 'https://github.com/example',
    Twitter: 'https://twitter.com/example',
  },
  skills: [
    { name: 'TypeScript', level: 'intermediate' },
    { name: 'React', level: 'beginner' },
  ],
}
