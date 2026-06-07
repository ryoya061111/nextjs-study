import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FormErrorMessage } from '@/components/ui/FormErrorMessage'

const BUTTON_VARIANTS = ['primary', 'secondary', 'danger', 'ghost'] as const
const BUTTON_SIZES = ['sm', 'md'] as const

export default function UiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">UI コンポーネント一覧</h1>
        <Link href="/" className="text-sm text-blue-500 hover:underline">
          ← リンク集に戻る
        </Link>
      </div>

      {/* Button */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Button</h2>
        <Card className="space-y-4">
          {BUTTON_SIZES.map((size) => (
            <div key={size}>
              <p className="mb-2 text-sm text-gray-500">size=&quot;{size}&quot;</p>
              <div className="flex flex-wrap gap-2">
                {BUTTON_VARIANTS.map((variant) => (
                  <Button key={variant} variant={variant} size={size}>
                    {variant}
                  </Button>
                ))}
                <Button variant="primary" size={size} isLoading>
                  loading
                </Button>
                <Button variant="primary" size={size} disabled>
                  disabled
                </Button>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Input */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Input</h2>
        <Card className="space-y-4">
          <Input label="通常" placeholder="テキストを入力" />
          <Input label="エラーあり" placeholder="テキストを入力" error="入力値が不正です" />
        </Card>
      </section>

      {/* Textarea */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Textarea</h2>
        <Card className="space-y-4">
          <Textarea label="通常" placeholder="テキストを入力" rows={3} />
          <Textarea
            label="エラーあり"
            placeholder="テキストを入力"
            rows={3}
            error="入力値が不正です"
          />
        </Card>
      </section>

      {/* Checkbox */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Checkbox</h2>
        <Card className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox defaultChecked={false} />
            未チェック
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox defaultChecked={true} />
            チェック済み
          </label>
        </Card>
      </section>

      {/* Card */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Card</h2>
        <Card>ボーダー付きコンテナです。padding・rounded が統一されています。</Card>
      </section>

      {/* LoadingSpinner */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">LoadingSpinner</h2>
        <Card className="space-y-2">
          <LoadingSpinner />
          <LoadingSpinner text="データを取得中..." />
        </Card>
      </section>

      {/* FormErrorMessage */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">FormErrorMessage</h2>
        <FormErrorMessage message="サーバーエラーが発生しました。もう一度お試しください。" />
      </section>
    </div>
  )
}
