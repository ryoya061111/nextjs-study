import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

// エラーを意図的に発生させる子コンポーネント
const ThrowError = () => {
  throw new Error('test error')
}

// コンソールエラーを抑制（テスト実行時の出力を綺麗にする）
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErrorBoundary', () => {
  it('エラーが発生したときデフォルトメッセージを表示する', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('予期しないエラーが発生しました。')).toBeInTheDocument()
  })

  it('fallbackが指定されているときfallbackを表示する', () => {
    render(
      <ErrorBoundary fallback={<p>カスタムエラー</p>}>
        <ThrowError />
      </ErrorBoundary>
    )
    expect(screen.getByText('カスタムエラー')).toBeInTheDocument()
  })
})
