import { UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { makeLocalstorageAdapter } from '@/main/factories/cache'

export const setCurrenetAccountAdapter = (account: AccountModel): void => {
  if (!account?.accessToken) {
    throw new UnexpectedError()
  }
  makeLocalstorageAdapter().set('account', account)
}
