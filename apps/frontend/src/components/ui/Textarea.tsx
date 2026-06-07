import { forwardRef, TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

// forwardRef: React Hook Form の register() が返す ref を受け取るために必要
export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          ref={ref}
          {...props}
          className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            error ? 'border-red-400' : 'border-gray-300'
          } ${props.className ?? ''}`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
