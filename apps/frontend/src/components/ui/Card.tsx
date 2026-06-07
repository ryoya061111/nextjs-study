import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

export const Card = ({ children, className = '', ...props }: Props) => {
  return (
    <div {...props} className={`rounded border bg-white p-4 ${className}`}>
      {children}
    </div>
  )
}
