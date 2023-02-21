import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from './current-account-adapter'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call LocalStorageAdapter.set with correct values', () => {
    const account = mockAccountModel()
    const setspy = jest.spyOn(LocalStorageAdapter.prototype,'set')
    setCurrentAccountAdapter(account)
    expect(setspy).toHaveBeenCalledWith('account', account)
  })

  // test('Should throw UnexpectdError', () => {
  //   expect(() => {
  //     setCurrentAccountAdapter(undefined)
  //   }).toThrow(new UnexpectedError())
  // })

  test('Should call LocalStorageAdapter.get with correct values', () => {
    const accountMock = mockAccountModel()
    const getspy = jest.spyOn(LocalStorageAdapter.prototype,'get').mockReturnValueOnce(accountMock)
    const account = getCurrentAccountAdapter()
    expect(getspy).toHaveBeenCalledWith('account')
    expect(account).toEqual(accountMock)
  })
})
