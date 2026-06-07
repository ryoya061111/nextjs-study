'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

// Error BoundaryはReactの制約上、クラスコンポーネントでしか実装できない
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // 子コンポーネントでエラーが発生したときに呼ばれる静的メソッド
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      // fallbackが渡されていればそれを表示、なければデフォルトメッセージ
      return this.props.fallback ?? <p>予期しないエラーが発生しました。</p>
    }
    return this.props.children
  }
}
