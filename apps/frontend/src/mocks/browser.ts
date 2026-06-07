import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// ブラウザ用の Service Worker セットアップ
// start() を呼ぶと public/mockServiceWorker.js が登録され、
// 以降のすべての fetch リクエストを Service Worker が横取りできるようになる
export const worker = setupWorker(...handlers)
