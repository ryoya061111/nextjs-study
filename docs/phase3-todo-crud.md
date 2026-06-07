# フェーズ3 手順書：TODO CRUD実装

## 目的

TODO の作成・一覧・編集・削除（CRUD）機能を実装する。
Next.js の SSR・App Router・Client Component の役割分担と、React Hook Form + Zod によるフォーム管理を学ぶ。

## 実装するファイル一覧

```
src/
├── types/
│   ├── todo.types.ts              # Todo の TypeScript 型定義
│   └── todo.schema.ts             # Zod バリデーションスキーマ
├── services/
│   ├── mockData.ts                # サーバー側インメモリのモックデータストア
│   └── todoService.ts             # フロント→API 呼び出し層
├── hooks/
│   └── useTodos.ts                # CRUD 操作をまとめたカスタムフック
├── components/todos/
│   ├── TodoList.tsx               # 一覧表示（Client Component）
│   ├── TodoItem.tsx               # 1件分の表示・削除ボタン（Client Component）
│   └── TodoForm.tsx               # 作成・編集フォーム（Client Component）
└── app/
    ├── (dashboard)/todos/
    │   ├── page.tsx               # 一覧ページ（Server Component / SSR）
    │   └── [id]/edit/
    │       └── page.tsx           # 編集ページ（Server Component / SSR）
    └── api/todos/
        ├── route.ts               # GET /api/todos, POST /api/todos
        └── [id]/
            └── route.ts           # GET /PUT /DELETE /api/todos/[id]
```

---

## データフロー

### Read（一覧取得 / SSR）

```
ブラウザが /todos にアクセス
  ↓
[Server Component: todos/page.tsx]
  ↓ fetch('GET /api/todos') ← サーバー側で実行
[API Route: route.ts]
  ↓ mockData から全件返却
[Server Component]
  ↓ 初期データを props として渡す
[Client Component: TodoList.tsx]
  ↓ useState で管理・画面に表示
```

### Create（新規作成）

```
「新規作成」ボタンをクリック
  ↓
[TodoForm.tsx] フォーム表示
  ↓ React Hook Form + Zod でバリデーション
  ↓ 送信 → fetch('POST /api/todos', { body: { title, description } })
[API Route]
  ↓ mockData に追加して返却
[useTodos.ts]
  ↓ useState を更新
[TodoList.tsx] 再レンダリング → 新しい TODO が表示される
```

### Update（編集）

```
「編集」ボタンをクリック
  ↓
/todos/[id]/edit に遷移
[Server Component: [id]/edit/page.tsx]
  ↓ fetch('GET /api/todos/[id]') で既存データ取得（SSR）
[TodoForm.tsx] 既存データを初期値として表示
  ↓ 送信 → fetch('PUT /api/todos/[id]', { body: 変更内容 })
[API Route] mockData を更新
  ↓ /todos に戻る
```

### Delete（削除）

```
「削除」ボタンをクリック
  ↓
確認ダイアログ（window.confirm）
  ↓ fetch('DELETE /api/todos/[id]')
[API Route] mockData から削除
[useTodos.ts] useState を更新
[TodoList.tsx] 再レンダリング → 項目が消える
```

---

## 実施手順

### Step 1：型定義・Zod スキーマ作成

**役割**：型を先に定義することで、実装全体の設計図になる。Zod スキーマから TypeScript の型を自動生成することで、バリデーション定義と型定義を一元管理する。

#### `src/types/todo.types.ts`

```typescript
// Todo エンティティ（DB・APIレスポンスの形）
export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

// 作成リクエストの型（id・日時はサーバーで自動生成するため不要）
export interface CreateTodoRequest {
  title: string
  description: string
}

// 更新リクエストの型（すべての項目が任意 = Partial）
export interface UpdateTodoRequest {
  title?: string
  description?: string
  completed?: boolean
}
```

#### `src/types/todo.schema.ts`

```typescript
import { z } from 'zod'

// フォーム入力値のバリデーションルール定義
export const todoFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください'),
})

// Zod スキーマから TypeScript の型を自動生成する
// → 型定義とバリデーション定義が常に一致する
export type TodoFormValues = z.infer<typeof todoFormSchema>
```

---

### Step 2：モックデータストア作成

**役割**：バックエンドの DB 代わりにサーバー側のメモリ上にデータを保持する。モジュールレベルの変数はサーバー起動中は保持されるため、CRUD 操作の結果が反映される。

> **注意**：この方式はサーバー再起動でデータがリセットされる。学習用途では問題ないが、本番では DB（MySQL）に置き換える。

#### `src/services/mockData.ts`

```typescript
import { Todo } from '@/types/todo.types'

// モジュールレベルで宣言 → サーバー起動中はメモリ上に保持される
export const mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Next.js の App Router を学ぶ',
    description: 'Server Component と Client Component の違いを理解する',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'React Hook Form + Zod を試す',
    description: 'フォームバリデーションの実装方法を学ぶ',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
```

---

### Step 3：API Routes 実装

**役割**：Next.js の API Routes はサーバーサイドで動くエンドポイント。バックエンドなしで HTTP 通信の学習ができる。

> **学習ポイント**：関数名（`GET` / `POST` / `PUT` / `DELETE`）が HTTP メソッドに対応する。

#### `src/app/api/todos/route.ts`

```typescript
// GET /api/todos  → 一覧取得
// POST /api/todos → 新規作成
import { NextResponse } from 'next/server'
import { mockTodos } from '@/services/mockData'
import { CreateTodoRequest } from '@/types/todo.types'

export async function GET() {
  return NextResponse.json(mockTodos)
}

export async function POST(request: Request) {
  const body: CreateTodoRequest = await request.json()

  const newTodo = {
    id: Date.now().toString(),  // 簡易ID生成（本番では UUID を使う）
    title: body.title,
    description: body.description,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockTodos.push(newTodo)  // メモリ上の配列に追加
  return NextResponse.json(newTodo, { status: 201 })  // 201: Created
}
```

#### `src/app/api/todos/[id]/route.ts`

```typescript
// GET    /api/todos/[id] → 1件取得
// PUT    /api/todos/[id] → 更新
// DELETE /api/todos/[id] → 削除
import { NextResponse } from 'next/server'
import { mockTodos } from '@/services/mockData'
import { UpdateTodoRequest } from '@/types/todo.types'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const todo = mockTodos.find((t) => t.id === id)
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(todo)
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params
  const body: UpdateTodoRequest = await request.json()
  const index = mockTodos.findIndex((t) => t.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // 既存データと更新データをマージする（Partial なので undefined の項目は変更しない）
  mockTodos[index] = { ...mockTodos[index], ...body, updatedAt: new Date().toISOString() }
  return NextResponse.json(mockTodos[index])
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const index = mockTodos.findIndex((t) => t.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  mockTodos.splice(index, 1)  // 配列から削除
  return new NextResponse(null, { status: 204 })  // 204: No Content（削除成功）
}
```

---

### Step 4：Service 層実装

**役割**：fetch の呼び出しをコンポーネントから分離する。将来 API の URL や認証ヘッダーが変わっても、ここだけ修正すればよい。

#### `src/services/todoService.ts`

```typescript
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo.types'

const BASE = '/api/todos'

export const todoService = {
  // 一覧取得
  getAll: async (): Promise<Todo[]> => {
    const res = await fetch(BASE, { cache: 'no-store' })
    if (!res.ok) throw new Error('一覧の取得に失敗しました')
    return res.json()
  },

  // 1件取得
  getById: async (id: string): Promise<Todo> => {
    const res = await fetch(`${BASE}/${id}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('データの取得に失敗しました')
    return res.json()
  },

  // 作成
  create: async (data: CreateTodoRequest): Promise<Todo> => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('作成に失敗しました')
    return res.json()
  },

  // 更新
  update: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('更新に失敗しました')
    return res.json()
  },

  // 削除
  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('削除に失敗しました')
  },
}
```

---

### Step 5：カスタムフック実装

**役割**：CRUD 操作の状態管理とロジックをコンポーネントから切り出す。コンポーネントは「どう見せるか」に集中できる。

#### `src/hooks/useTodos.ts`

```typescript
'use client'

import { useState, useCallback } from 'react'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/todo.types'
import { todoService } from '@/services/todoService'

// 引数：SSR で取得した初期データを受け取る
export const useTodos = (initialTodos: Todo[]) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 作成
  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    setLoading(true)
    try {
      const newTodo = await todoService.create(data)
      // 既存リストの末尾に追加（楽観的更新ではなくAPIレスポンスを使う）
      setTodos((prev) => [...prev, newTodo])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // 完了状態の切り替え
  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      const updated = await todoService.update(id, { completed })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  // 削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      await todoService.delete(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))  // IDが一致しない項目だけ残す
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    }
  }, [])

  return { todos, loading, error, createTodo, toggleTodo, deleteTodo }
}
```

---

### Step 6：コンポーネント実装

#### `src/components/todos/TodoForm.tsx`（作成・編集共用）

**役割**：React Hook Form + Zod でフォームの入力管理・バリデーションを行う。`defaultValues` の有無で作成/編集を切り替える。

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { todoFormSchema, TodoFormValues } from '@/types/todo.schema'

interface Props {
  defaultValues?: TodoFormValues  // 渡された場合は編集モード
  onSubmit: (data: TodoFormValues) => Promise<void>
  onCancel: () => void
}

export const TodoForm = ({ defaultValues, onSubmit, onCancel }: Props) => {
  const {
    register,       // input 要素を React Hook Form に登録する関数
    handleSubmit,   // フォーム送信時にバリデーションを実行してから onSubmit を呼ぶラッパー
    formState: { errors, isSubmitting },  // バリデーションエラーと送信中フラグ
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),  // Zod をバリデーターとして使用
    defaultValues: defaultValues ?? { title: '', description: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">タイトル</label>
        {/* register でこの input の値を React Hook Form が管理する */}
        <input
          {...register('title')}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="タイトルを入力"
        />
        {/* errors.title が存在する場合はエラーメッセージを表示 */}
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">説明</label>
        <textarea
          {...register('description')}
          className="mt-1 w-full rounded border px-3 py-2"
          rows={3}
          placeholder="説明を入力（任意）"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}  // 送信中は二重送信を防ぐ
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : defaultValues ? '更新' : '作成'}
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
          キャンセル
        </button>
      </div>
    </form>
  )
}
```

#### `src/components/todos/TodoItem.tsx`

```tsx
'use client'

import Link from 'next/link'
import { Todo } from '@/types/todo.types'

interface Props {
  todo: Todo
  onDelete: (id: string) => void
  onToggle: (id: string, completed: boolean) => void
}

export const TodoItem = ({ todo, onDelete, onToggle }: Props) => {
  const handleDelete = () => {
    // 誤削除を防ぐため確認ダイアログを表示
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      onDelete(todo.id)
    }
  }

  return (
    <div className="flex items-center justify-between rounded border p-4">
      <div className="flex items-center gap-3">
        {/* チェックボックスで完了状態をトグル */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="h-4 w-4"
        />
        <div>
          <p className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
            {todo.title}
          </p>
          <p className="text-sm text-gray-500">{todo.description}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Link コンポーネント = Next.js のクライアントサイドナビゲーション */}
        <Link
          href={`/todos/${todo.id}/edit`}
          className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
        >
          編集
        </Link>
        <button
          onClick={handleDelete}
          className="rounded bg-red-100 px-3 py-1 text-sm text-red-600 hover:bg-red-200"
        >
          削除
        </button>
      </div>
    </div>
  )
}
```

#### `src/components/todos/TodoList.tsx`

```tsx
'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo.types'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { useTodos } from '@/hooks/useTodos'
import { TodoFormValues } from '@/types/todo.schema'

interface Props {
  initialTodos: Todo[]  // SSR で取得した初期データ
}

export const TodoList = ({ initialTodos }: Props) => {
  // カスタムフックに初期データを渡してCRUD操作を取得
  const { todos, loading, error, createTodo, toggleTodo, deleteTodo } = useTodos(initialTodos)
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (data: TodoFormValues) => {
    await createTodo(data)
    setShowForm(false)  // 作成後にフォームを閉じる
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">TODO リスト</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </button>
      </div>

      {/* エラー表示 */}
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-red-600">{error}</p>}

      {/* 新規作成フォーム */}
      {showForm && (
        <div className="mb-6 rounded border p-4">
          <h2 className="mb-3 font-medium">新しい TODO を作成</h2>
          <TodoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* ローディング中 */}
      {loading && <p className="text-gray-500">処理中...</p>}

      {/* TODO一覧 */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-center text-gray-400">TODO がありません。作成してみましょう！</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

---

### Step 7：ページ実装

#### `src/app/(dashboard)/todos/page.tsx`（一覧ページ / SSR）

**役割**：Server Component として動き、最初のHTMLに初期データを埋め込んでブラウザに返す。

```tsx
// 'use client' を付けない = Server Component
import { todoService } from '@/services/todoService'
import { TodoList } from '@/components/todos/TodoList'

// サーバーサイドで実行される（ブラウザには届かない）
export default async function TodosPage() {
  // サーバー上で fetch を実行 → 初期データを取得
  const initialTodos = await todoService.getAll()

  // 取得したデータを Client Component に props として渡す
  return <TodoList initialTodos={initialTodos} />
}
```

#### `src/app/(dashboard)/todos/[id]/edit/page.tsx`（編集ページ）

```tsx
import { todoService } from '@/services/todoService'
import { TodoEditForm } from '@/components/todos/TodoEditForm'

// Next.js App Router では params は Promise 型
type Props = { params: Promise<{ id: string }> }

export default async function EditTodoPage({ params }: Props) {
  const { id } = await params
  const todo = await todoService.getById(id)

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">TODO を編集</h1>
      <TodoEditForm todo={todo} />
    </div>
  )
}
```

#### `src/components/todos/TodoEditForm.tsx`（編集用 Client Component）

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { Todo } from '@/types/todo.types'
import { TodoForm } from './TodoForm'
import { todoService } from '@/services/todoService'
import { TodoFormValues } from '@/types/todo.schema'

interface Props {
  todo: Todo
}

export const TodoEditForm = ({ todo }: Props) => {
  // useRouter = クライアントサイドでページ遷移を行うフック
  const router = useRouter()

  const handleSubmit = async (data: TodoFormValues) => {
    await todoService.update(todo.id, data)
    router.push('/todos')  // 更新後に一覧ページへ戻る
    router.refresh()       // Server Component のキャッシュを再取得する
  }

  return (
    <TodoForm
      defaultValues={{ title: todo.title, description: todo.description }}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/todos')}
    />
  )
}
```

---

## 完了条件

- [ ] `/todos` でSSRによる初期表示ができる
- [ ] 新規作成フォームからTODOを追加できる（Create）
- [ ] 一覧にTODOが表示される（Read）
- [ ] チェックボックスで完了状態を切り替えられる（Update）
- [ ] 編集ページで内容を変更できる（Update）
- [ ] 削除ボタンで確認後に削除できる（Delete）
- [ ] バリデーションエラーがフォームに表示される
