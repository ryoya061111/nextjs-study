import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '@/components/todos/list/TodoList'

// window.confirm をモック
vi.stubGlobal('confirm', vi.fn(() => true))

describe('TodoList', () => {
  it('TODO リストがレンダーされる', async () => {
    render(<TodoList />)

    // useTodos が fetch で初期データを取得するまで待つ
    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })
  })

  it('新規作成ボタンを押すとフォームが表示される', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    const createButton = screen.getByRole('button', { name: /新規作成/i })
    await user.click(createButton)

    expect(screen.getByText(/新しい TODO を作成/i)).toBeInTheDocument()
  })

  it('フォーム表示中にキャンセルボタンでフォームが隠れる', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    const createButton = screen.getByRole('button', { name: /新規作成/i })
    await user.click(createButton)

    expect(screen.getByText(/新しい TODO を作成/i)).toBeInTheDocument()

    const cancelButtons = screen.getAllByRole('button', { name: /キャンセル/i })
    const formCancelButton = cancelButtons[1]
    await user.click(formCancelButton)

    await waitFor(() => {
      expect(screen.queryByText(/新しい TODO を作成/i)).not.toBeInTheDocument()
    })
  })

  it('初期データが空でないときメッセージが表示されない', async () => {
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    expect(screen.queryByText(/TODO がありません/i)).not.toBeInTheDocument()
  })

  it('各 TODO に編集リンクと削除ボタンがある', async () => {
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    const editLinks = screen.getAllByText('編集')
    const deleteButtons = screen.getAllByRole('button', { name: /削除/i })

    expect(editLinks.length >= 1).toBe(true)
    expect(deleteButtons.length >= 1).toBe(true)
  })

  it('TODO を作成できる', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

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
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    const checkboxes = screen.getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0] as HTMLInputElement

    await user.click(firstCheckbox)

    await waitFor(() => {
      expect(firstCheckbox.checked).toBe(true)
    })
  })

  it('削除ボタンをクリックして確認するとTODOが削除される', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /削除/i })
    const firstDeleteButton = deleteButtons[0]
    await user.click(firstDeleteButton)

    await waitFor(() => {
      expect(screen.queryByText(/Next.js を学ぶ/i)).not.toBeInTheDocument()
    })
  })

  it('API エラーが表示されない（正常な状態）', async () => {
    render(<TodoList />)

    await waitFor(() => {
      expect(screen.getByText(/Next.js を学ぶ/i)).toBeInTheDocument()
    })

    expect(screen.queryByText(/エラーが発生/i)).not.toBeInTheDocument()
  })
})
