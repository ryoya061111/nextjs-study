// Auth.js API Routes
// - GET/POST /api/auth/callback/credentials：認証リクエスト処理
// - GET/POST /api/auth/signin, /api/auth/signout：セッション管理
// - GET /api/auth/session：セッション確認
//
// auth.ts から handlers（Auth.js が生成）をエクスポート
// 削除不可：Auth.js の基盤

import { handlers } from '@/auth'

export const { GET, POST } = handlers
