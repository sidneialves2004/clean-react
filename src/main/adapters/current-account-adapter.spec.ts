import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache'
import { setCurrenetAccountAdapter } from './current-account-adapter'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call LocalStorageAdapter with correct values', () => {
    const account = mockAccountModel()
    const setspy = jest.spyOn(LocalStorageAdapter.prototype,'set')
    setCurrenetAccountAdapter(account)
    expect(setspy).toHaveBeenCalledWith('account', account)
  })
})
