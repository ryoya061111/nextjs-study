interface Props {
  text?: string
}

export const LoadingSpinner = ({ text = '処理中...' }: Props) => {
  return <p className="text-sm text-gray-500">{text}</p>
}
