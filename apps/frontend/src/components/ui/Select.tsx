import { forwardRef, SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

// forwardRef: React Hook Form の register() が返す ref を受け取るために必要
export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, ...props }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <select
          ref={ref}
          {...props}
          className={`mt-1 w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            error ? 'border-red-400' : 'border-gray-300'
          } ${props.className ?? ''}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
