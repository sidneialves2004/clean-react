import { SetStorage } from '@/data/protocols/cache'
import { LocalStorageAdapter } from '@/infra/cache'

export const makeLocalstorageAdapter = (): SetStorage => {
  return new LocalStorageAdapter()
}
