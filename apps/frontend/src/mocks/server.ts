import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node.js 用のモックサーバー（テスト専用）
// Vitest などのテスト環境でコンポーネントが fetch を呼ぶとき、
// 実際のサーバーを起動せずにここで定義したハンドラがレスポンスを返す
export const server = setupServer(...handlers)
