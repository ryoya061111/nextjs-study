interface Props {
  message: string
}

export const FormErrorMessage = ({ message }: Props) => {
  return <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{message}</p>
}
