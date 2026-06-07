# nextjs-study

Next.js + TypeScript 学習用サンプルアプリケーション。

## 技術スタック

- **フロントエンド**：Next.js 16 / React 19 / TypeScript
- **スタイリング**：Tailwind CSS
- **フォーム**：React Hook Form + Zod
- **認証**：Auth.js（next-auth）
- **テスト**：Vitest + Testing Library / Playwright

## クイックスタート

```bash
# 1. リポジトリをクローン
git clone https://github.com/ryoya061111/nextjs-study.git
cd nextjs-study

# 2. 依存パッケージをインストール（全ワークスペース一括）
npm install

# 3. 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## E2Eテストを実行する場合

初回のみブラウザドライバのダウンロードが必要。

```bash
npm run setup:e2e  # Playwrightブラウザをインストール
npm run test:e2e   # E2Eテスト実行
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバーを起動（http://localhost:3000） |
| `npm run build` | 本番用ビルド |
| `npm run lint` | ESLintでコードチェック |
| `npm run format` | Prettierでコードフォーマット |
| `npm run test` | 単体テストを実行（ウォッチモード） |
| `npm run test:ui` | ブラウザUIでテスト結果を確認 |
| `npm run test:e2e` | E2Eテストを実行 |
| `npm run setup:e2e` | Playwrightブラウザを初回インストール |

## プロジェクト構成

```
nextjs-study/
├── apps/
│   ├── frontend/   # Next.jsアプリ
│   └── backend/    # Go/gin（後対応）
├── packages/
│   └── shared/     # BE/FE共有型定義（後対応）
├── infra/
│   ├── redis/      # Redis設定（後対応）
│   └── mysql/      # MySQL設定（後対応）
└── docs/           # 手順書
```
