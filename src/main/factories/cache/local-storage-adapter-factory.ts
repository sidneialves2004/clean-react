import { LocalStorageAdapter } from '@/infra/cache'

export const makeLocalstorageAdapter = (): LocalStorageAdapter => {
  return new LocalStorageAdapter()
}
