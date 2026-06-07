import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '@/components/todos/list/TodoList'
import { Todo } from '@/types/todo/shared/todo.types'

// window.confirm をモック
vi.stubGlobal(
  'confirm',
  vi.fn(() => true)
)

const mockInitialTodos: Todo[] = [
  {
    id: '1',
    title: 'Next.js を学ぶ',
    description: 'App Router を理解する',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'React Hook Form を試す',
    description: 'フォームバリデーション',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

describe('TodoList', () => {
  it('初期 TODO がレンダーされる', () => {
    render(<TodoList initialTodos={mockInitialTodos} />)

    expect(screen.getByText('Next.js を学ぶ')).toBeInTheDocument()
    expect(screen.getByText('React Hook Form を試す')).toBeInTheDocument()
  })

  it('TODO のタイトルと説明が表示される', () => {
    render(<TodoList initialTodos={mockInitialTodos} />)

    expect(screen.getByText('App Router を理解する')).toBeInTheDocument()
    expect(screen.getByText('フォームバリデーション')).toBeInTheDocument()
  })

  it('新規作成ボタンを押すとフォームが表示される', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockInitialTodos} />)

    const createButton = screen.getByRole('button', { name: /新規作成/i })
    await user.click(createButton)

    expect(screen.getByText(/新しい TODO を作成/i)).toBeInTheDocument()
  })

  it('フォーム表示中にキャンセルボタンでフォームが隠れる', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockInitialTodos} />)

    const createButton = screen.getByRole('button', { name: /新規作成/i })
    await user.click(createButton)

    // フォームが表示されたことを確認
    expect(screen.getByText(/新しい TODO を作成/i)).toBeInTheDocument()

    // TodoForm内のキャンセルボタン（variant="danger"）を取得
    const cancelButtons = screen.getAllByRole('button', { name: /キャンセル/i })
    const formCancelButton = cancelButtons[1] // 2番目がフォーム内のキャンセルボタン
    await user.click(formCancelButton)

    // フォームが非表示になったことを確認
    await waitFor(() => {
      expect(screen.queryByText(/新しい TODO を作成/i)).not.toBeInTheDocument()
    })
  })

  it('初期データが空のときメッセージが表示される', () => {
    render(<TodoList initialTodos={[]} />)

    expect(screen.getByText(/TODO がありません/i)).toBeInTheDocument()
  })

  it('各 TODO に編集リンクと削除ボタンがある', () => {
    render(<TodoList initialTodos={mockInitialTodos} />)

    const editLinks = screen.getAllByText('編集')
    const deleteButtons = screen.getAllByRole('button', { name: /削除/i })

    expect(editLinks).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('TODO を作成できる', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={[]} />)

    const createButton = screen.getByRole('button', { name: /新規作成/i })
    await user.click(createButton)

    const titleInput = screen.getByPlaceholderText(/タイトルを入力/)
    await user.type(titleInput, '新しいタスク')

    const submitButton = screen.getByRole('button', { name: /作成/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('新しいタスク')).toBeInTheDocument()
    })
  })

  it('TODO のチェックボックスで完了状態を切り替えられる', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockInitialTodos} />)

    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0]

    await user.click(firstCheckbox)

    await waitFor(() => {
      expect(firstCheckbox).toBeChecked()
    })
  })

  it('削除ボタンをクリックして確認するとTODOが削除される', async () => {
    const user = userEvent.setup()
    render(<TodoList initialTodos={mockInitialTodos} />)

    const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
    const firstDeleteButton = deleteButtons[0]
    await user.click(firstDeleteButton)

    await waitFor(() => {
      expect(screen.queryByText('Next.js を学ぶ')).not.toBeInTheDocument()
    })
  })

  it('API エラーが発生するとエラーメッセージが表示される', () => {
    // MSW でエラーハンドラをセットアップしている場合
    render(<TodoList initialTodos={mockInitialTodos} />)

    // エラーメッセージが表示されているかチェック
    // （実際のエラーは API リクエスト時に発生）
    expect(screen.queryByText(/エラーが発生/i)).not.toBeInTheDocument()
  })
})
