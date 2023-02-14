import { LocalUpdateCurrentAccount } from '@/data/usecases'
import { UpdateCurrentAccount } from '@/domain/usecases'
import { makeLocalstorageAdapter } from '@/main/factories/cache'

export const makeLocalUpdateCurrentAccount = (): UpdateCurrentAccount => {
  return new LocalUpdateCurrentAccount(makeLocalstorageAdapter())
}
