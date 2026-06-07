# フェーズ1 手順書：基礎セットアップ

## 目的

Next.js + TypeScript プロジェクトの初期構築と、実務を想定したコード品質ツール・テスト基盤のセットアップを行う。

## 前提条件

- Node.js 18以上がインストールされていること
- npm 9以上がインストールされていること
- **作業ディレクトリ：`apps/frontend/`**（以降のコマンドはすべてここで実行する）

---

## 実施手順

### Step 1：Next.jsプロジェクト初期化

#### 役割

`create-next-app` は Next.js 公式の初期化ツール。手動でファイルを作る代わりに、必要なファイル・設定・依存パッケージを一括で生成してくれる。

#### コマンド

```bash
cd apps/frontend
npx create-next-app@latest . \
  --typescript \        # TypeScript を有効にする。型安全なコードが書けるようになる
  --eslint \            # ESLint を有効にする。コードの構文チェックが自動で入る
  --tailwind \          # Tailwind CSS を有効にする。クラス名でスタイルを書けるようになる
  --src-dir \           # ソースコードを src/ 配下にまとめる。設定ファイルと分離できて見通しが良くなる
  --app \               # App Router を使用する（Pages Router より新しい方式）
  --import-alias "@/*"  # @/ でsrc/配下を絶対パス参照できるようにする（例：@/components/Button）
  --no-git              # gitの初期化をスキップする。モノレポのルートで管理するため
```

**確認事項**
- `apps/frontend/src/app/` が生成されていること
- `npm run dev` でローカルサーバーが起動すること（http://localhost:3000）

---

### Step 2：追加パッケージインストール

#### 役割

`create-next-app` では入らない、このプロジェクト固有のパッケージを追加する。

#### インストールするパッケージの説明

| パッケージ | 種別 | 役割 |
|-----------|------|------|
| `react-hook-form` | 本番依存 | フォームの状態管理・バリデーション。入力値の管理を効率化する |
| `zod` | 本番依存 | スキーマ定義によるバリデーションライブラリ。TypeScript の型と連携できる |
| `@hookform/resolvers` | 本番依存 | React Hook Form と Zod を連携させるアダプター |
| `next-auth@beta` | 本番依存 | Next.js 向け認証ライブラリ（Auth.js）。JWTをHttpOnly Cookieで安全に管理する |
| `vitest` | 開発依存 | テストランナー。Vite ベースで高速に動く |
| `@vitejs/plugin-react` | 開発依存 | Vitest で React コンポーネントをテストするためのプラグイン |
| `jsdom` | 開発依存 | ブラウザ環境をNode.js上でシミュレートする。テスト時にDOMを操作できるようにする |
| `@testing-library/react` | 開発依存 | Reactコンポーネントのレンダリングとインタラクションをテストするライブラリ |
| `@testing-library/jest-dom` | 開発依存 | `toBeInTheDocument()` などのDOM用カスタムマッチャーを追加する |
| `@testing-library/user-event` | 開発依存 | クリック・入力などのユーザー操作をテストでシミュレートする |
| `@playwright/test` | 開発依存 | ブラウザを実際に動かしてテストするE2Eテストフレームワーク |
| `husky` | 開発依存 | git のフック（commit時などのイベント）にスクリプトを登録できるツール |
| `lint-staged` | 開発依存 | git にステージングされたファイルだけに対してlintを実行するツール。全ファイルに実行するより高速 |
| `prettier` | 開発依存 | コードフォーマッター。インデントや引用符の形式を自動で統一する |
| `eslint-config-prettier` | 開発依存 | ESLint と Prettier のルールが衝突しないよう、Prettier と重複するESLintルールを無効化する |

#### コマンド

```bash
cd apps/frontend

# 本番依存（アプリの動作に必要）
npm install react-hook-form zod @hookform/resolvers next-auth@beta

# 開発依存（開発時のみ必要。-D フラグで devDependencies に追加される）
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test husky lint-staged prettier eslint-config-prettier
```

> **`-D` フラグとは**：`devDependencies` に追加するフラグ。本番ビルドには含まれないパッケージに使う。テストツールやフォーマッターは本番環境では不要なため `-D` で管理する。

---

### Step 3：Prettier設定

#### 役割

Prettier はコードフォーマッターで、チームで書き方を統一するために使う。`.prettierrc` でルールを定義しておくことで、エディタやCLIで同じフォーマットが適用される。

#### 設定ファイル：`apps/frontend/.prettierrc`

```json
{
  "semi": false,          // 文末のセミコロンを省略する（true にすると付ける）
  "singleQuote": true,    // 文字列をシングルクォートで統一する（false にするとダブルクォート）
  "tabWidth": 2,          // インデントをスペース2つにする
  "trailingComma": "es5", // ES5で有効な箇所（配列・オブジェクトの末尾）にだけ末尾カンマを付ける
  "printWidth": 100       // 1行の最大文字数。これを超えると自動で折り返す
}
```

---

### Step 4：ESLint設定更新

#### 役割

ESLint はコードの構文チェックツール。Next.js のデフォルト設定に加えて、Prettier との競合を防ぐ設定を追加する。

> **なぜ競合するか**：ESLint にも「セミコロンを付けろ」などのフォーマット系ルールがある。Prettier でセミコロンを省略する設定にしていると、ESLint が「セミコロンがない」とエラーを出す。`eslint-config-prettier` はこの衝突を防ぐために、Prettier が管理するルールを ESLint 側で無効化する。

#### 設定ファイル：`apps/frontend/eslint.config.mjs`（Next.js 16 のフラット設定形式）

```js
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"  // Prettierと競合するルールを無効化

const eslintConfig = defineConfig([
  ...nextVitals,   // Next.js 推奨ルール（パフォーマンス・アクセシビリティを含む）
  ...nextTs,       // TypeScript 向けの追加ルール
  prettier,        // Prettier と競合するESLintルールを上書きで無効化（必ず最後に置く）
  globalIgnores([
    ".next/**",    // ビルド成果物は除外
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
```

---

### Step 5：lint-staged設定

#### 役割

`lint-staged` は git にステージングされた（`git add` された）ファイルだけを対象に Lint・フォーマットを実行するツール。プロジェクト全体に実行すると時間がかかるため、変更したファイルだけに絞ることでコミットを速くする。

#### 設定ファイル：`apps/frontend/.lintstagedrc.js`

```js
module.exports = {
  // TypeScript/TSXファイルに対して：ESLintで自動修正 → Prettierでフォーマット
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],

  // JSON/CSS/Markdownに対して：Prettierでフォーマットのみ（ESLintは不要）
  '*.{json,css,md}': ['prettier --write'],
}
```

> **`--fix` フラグ**：ESLint が自動で修正できるルール違反を自動修正する。修正できないものはエラーとして残る。
> **`--write` フラグ**：Prettier が整形した内容をファイルに上書き保存する（付けないと差分の表示だけで保存されない）。

---

### Step 6：Husky設定

#### 役割

`husky` は git のライフサイクルイベント（commit・push など）にフック（hook）を登録できるツール。`pre-commit` フックを使うことで、コミット前に自動で lint-staged を実行し、品質を保証する。

> **フックとは**：git が特定の操作を行う前後に自動で実行されるスクリプト。`pre-commit` はコミット確定前に走る。フックがエラーを返すとコミットを中止できる。

#### 初期化（gitルートで実行）

```bash
# モノレポのgitルートで実行する（apps/frontend ではない）
cd ../../  # ← プロジェクトルートに移動
npx husky init
```

> **なぜgitルートか**：Husky は `.git/` ディレクトリと同じ場所に設定が必要なため、`apps/frontend` ではなくモノレポのルートで初期化する。

#### フックファイル：`.husky/pre-commit`

```bash
# コミット前に apps/frontend の lint-staged を実行する
cd apps/frontend && npx lint-staged
```

---

### Step 7：Vitest設定

#### 役割

`vitest` は Vite をベースにした高速なテストランナー。Jest と互換性のある API を持ちつつ、Next.js の TypeScript 環境とそのまま統合できる。`jsdom` を使ってブラウザ環境を再現し、React コンポーネントの単体テストができる。

#### 設定ファイル：`apps/frontend/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],  // ReactのJSX変換を有効にする。これがないとTSXファイルを解析できない

  test: {
    environment: 'jsdom',           // テスト実行環境をブラウザ相当に設定する（Node.jsのデフォルトはDOMがない）
    globals: true,                  // describe/it/expect などをimportなしで使えるようにする
    setupFiles: './src/test/setup.ts', // テスト実行前に必ず読み込むファイルを指定する
  },

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }, // @/ が src/ を指すようにする（Next.jsの設定と合わせる）
  },
})
```

#### セットアップファイル：`apps/frontend/src/test/setup.ts`

```ts
// @testing-library/jest-dom のカスタムマッチャーを全テストで使えるようにする
// 例：toBeInTheDocument()、toHaveTextContent() など
import '@testing-library/jest-dom'
```

---

### Step 8：Playwright設定

#### 役割

`Playwright` はブラウザを実際に操作してテストするE2E（End-to-End）テストフレームワーク。単体テスト（Vitest）では確認できない「ログインして画面遷移する」「フォームを送信してリストに追加される」といったユーザー操作全体の流れを検証する。

#### ブラウザドライバのインストール

```bash
# Chromium / Firefox / WebKit のバイナリをダウンロードする
npx playwright install
```

#### 設定ファイル：`apps/frontend/playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',  // E2Eテストファイルを置くディレクトリ

  use: {
    baseURL: 'http://localhost:3000',  // テスト内で page.goto('/todos') と書くと http://localhost:3000/todos になる
  },
})
```

---

### Step 9：ErrorBoundaryコンポーネント実装

#### 役割

`ErrorBoundary` は子コンポーネントで予期しないエラーが発生したとき、アプリ全体がクラッシュするのを防いでフォールバック UI を表示するコンポーネント。

> **なぜクラスコンポーネントか**：React の `getDerivedStateFromError` と `componentDidCatch` というライフサイクルメソッドはクラスコンポーネントにしか実装できない（React の仕様）。そのため Error Boundary だけはクラスコンポーネントで書く必要がある。

#### ファイル：`apps/frontend/src/components/common/ErrorBoundary.tsx`

```tsx
'use client'  // Error Boundary はクライアント側のエラーを捕捉するためClient Componentにする

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode   // エラーを監視する子コンポーネント
  fallback?: ReactNode  // エラー発生時に代わりに表示するUI（省略可）
}

interface State {
  hasError: boolean  // エラーが発生したかどうかのフラグ
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // 子コンポーネントでエラーが発生したとき React が呼び出すライフサイクルメソッド
  // 戻り値で state を更新できる（setState は使えない）
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      // fallbackが渡されていればそれを表示、なければデフォルトメッセージ
      return this.props.fallback ?? <p>予期しないエラーが発生しました。</p>
    }
    // エラーがなければ子コンポーネントをそのまま描画する
    return this.props.children
  }
}
```

---

### Step 10：package.jsonスクリプト更新

#### 役割

`package.json` の `scripts` に `npm run ○○` で実行できるコマンドを登録する。長いコマンドを短い名前で呼び出せるようにする。

#### 設定：`apps/frontend/package.json`

```json
{
  "scripts": {
    "dev": "next dev",              // 開発サーバーを起動する（ホットリロード付き）
    "build": "next build",          // 本番用にビルドする
    "start": "next start",          // ビルド済みアプリを本番モードで起動する
    "lint": "eslint",               // ESLint でコード全体をチェックする
    "format": "prettier --write .", // プロジェクト全体をPrettierでフォーマットする
    "test": "vitest",               // テストをウォッチモードで実行する（ファイル変更を検知して再実行）
    "test:ui": "vitest --ui",       // ブラウザUIでテスト結果を確認する
    "test:e2e": "playwright test"   // E2Eテストを実行する
  }
}
```

---

### Step 11：動作確認

```bash
# 開発サーバー起動確認（http://localhost:3000 が表示されればOK）
npm run dev

# Lintエラーがないことを確認
npm run lint

# テストがパスすることを確認
npm run test
```

---

## 完了条件

- [ ] `npm run dev` で http://localhost:3000 が表示される
- [ ] `npm run lint` がエラーなく通る
- [ ] `npm run test` がパスする
- [ ] git commit 時に lint-staged が自動実行される
- [ ] `ErrorBoundary` コンポーネントが配置されている
