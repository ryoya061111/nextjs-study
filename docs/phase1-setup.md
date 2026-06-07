# フェーズ1 手順書：基礎セットアップ

## 目的

Next.js + TypeScript プロジェクトの初期構築と、実務を想定したコード品質ツール・テスト基盤のセットアップを行う。

## 前提条件

- Node.js 18以上がインストールされていること
- npm 9以上がインストールされていること
- 作業ディレクトリ：`apps/frontend/`

---

## 実施手順

### Step 1：Next.jsプロジェクト初期化

`apps/frontend/` 配下に Next.js アプリを作成する。

```bash
cd apps/frontend
npx create-next-app@latest . \
  --typescript \       # TypeScript有効
  --eslint \           # ESLint有効
  --tailwind \         # Tailwind CSS有効
  --src-dir \          # src/ディレクトリ構成
  --app \              # App Router使用
  --import-alias "@/*" # パスエイリアス設定
  --no-git             # git管理はルートで行うため無効
```

**確認事項**
- `apps/frontend/src/app/` が生成されていること
- `npm run dev` でローカルサーバーが起動すること（http://localhost:3000）

---

### Step 2：追加パッケージインストール

```bash
cd apps/frontend

# 本番依存・開発依存をまとめてインストール
npm install react-hook-form zod @hookform/resolvers next-auth@beta
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test husky lint-staged prettier eslint-config-prettier
```

---

### Step 3：Prettier設定

`apps/frontend/.prettierrc` を作成する。

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

### Step 4：ESLint設定更新

`apps/frontend/.eslintrc.json` に Prettier との競合を除去する設定を追加する。

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

---

### Step 5：lint-staged設定

`apps/frontend/.lintstagedrc.js` を作成する。

```js
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,md}': ['prettier --write'],
}
```

---

### Step 6：Husky設定

```bash
cd apps/frontend
npx husky init
```

`.husky/pre-commit` を以下の内容にする。

```bash
npx lint-staged
```

---

### Step 7：Vitest設定

`apps/frontend/vitest.config.ts` を作成する。

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

`apps/frontend/src/test/setup.ts` を作成する。

```ts
import '@testing-library/jest-dom'
```

---

### Step 8：Playwright設定

```bash
cd apps/frontend
npx playwright install
```

`apps/frontend/playwright.config.ts` を作成する。

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
})
```

---

### Step 9：ErrorBoundaryコンポーネント実装

`apps/frontend/src/components/common/ErrorBoundary.tsx` を作成する。

```tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

// クラスコンポーネント：Error Boundaryはクラス形式でしか実装できない（React の制約）
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // エラーが発生したときに呼ばれる静的メソッド
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>予期しないエラーが発生しました。</p>
    }
    return this.props.children
  }
}
```

---

### Step 10：package.jsonスクリプト更新

`apps/frontend/package.json` の `scripts` に以下を追加する。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  }
}
```

---

### Step 11：動作確認

```bash
# 開発サーバー起動確認
npm run dev

# Lint確認
npm run lint

# テスト確認
npm run test
```

---

## 完了条件

- [ ] `npm run dev` で http://localhost:3000 が表示される
- [ ] `npm run lint` がエラーなく通る
- [ ] `npm run test` がパスする
- [ ] git commit 時に lint-staged が自動実行される
- [ ] `ErrorBoundary` コンポーネントが配置されている
