import { useLogout } from '@/presentation/hooks'
import { AccessDiniedError } from '@/domain/errors'

type CallBackType = (error: Error) => void
type ResultType = CallBackType

export const useErrorHandler = (callback: CallBackType): ResultType => {
  const logout = useLogout()
  return (error: Error): void => {
    if (error instanceof AccessDiniedError) {
      logout()
    } else {
      callback(error)
    }
  }
}
