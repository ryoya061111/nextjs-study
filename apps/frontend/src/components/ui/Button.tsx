import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-100 text-red-600 hover:bg-red-200',
  ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={`rounded font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {isLoading ? '処理中...' : children}
    </button>
  )
}
