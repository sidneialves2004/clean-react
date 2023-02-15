import { AccountModel } from '@/domain/models'
import { createContext } from 'react'

type Props = {
  seturrentAccount?: (account: AccountModel) => void
}

export default createContext<Props>(null)
