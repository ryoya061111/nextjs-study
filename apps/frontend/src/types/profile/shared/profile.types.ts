export type SkillLevel = 'beginner' | 'intermediate' | 'expert'

export type Profile = {
  id: string
  name: string
  email: string
  bio: string
  // ネスト構造：住所オブジェクト
  address: {
    prefecture: string
    city: string
    street: string
  }
  // マップ：キーがユーザー定義の key-value。{ GitHub: 'https://...', Twitter: '...' } の形で保持
  links: Record<string, string>
  // リスト：スキル一覧（追加・削除可）
  skills: Array<{
    name: string
    level: SkillLevel
  }>
}
