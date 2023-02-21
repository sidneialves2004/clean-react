import { AccountModel } from '@/domain/models'
import { makeLocalstorageAdapter } from '@/main/factories/cache'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  makeLocalstorageAdapter().set('account', account)
}

export const getCurrentAccountAdapter = (): AccountModel => {
  return makeLocalstorageAdapter().get('account')
}
