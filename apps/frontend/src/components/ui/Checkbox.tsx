import { forwardRef, InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

// forwardRef: React Hook Form の register() が返す ref を受け取るために必要
export const Checkbox = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      {...props}
      className={`h-4 w-4 cursor-pointer accent-blue-500 ${props.className ?? ''}`}
    />
  )
})

Checkbox.displayName = 'Checkbox'
