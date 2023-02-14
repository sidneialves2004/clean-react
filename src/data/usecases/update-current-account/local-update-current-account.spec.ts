import { SetStorageMock } from '@/data/test'
import { UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { LocalUpdateCurrentAccount } from './local-update-current-account'

type SutTypes = {
  sut: LocalUpdateCurrentAccount
  setStorageMock: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalUpdateCurrentAccount(setStorageMock)
  return {
    sut,
    setStorageMock
  }
}

describe('LocalUpdateCurrentAccount', () => {
  test('should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const account: AccountModel = mockAccountModel()
    await sut.save(account)
    expect(setStorageMock.key).toBe('account')
    expect(setStorageMock.value).toBe(JSON.stringify(account))
  })

  test('should throw if SetStorage throws', async () => {
    const { sut, setStorageMock } = makeSut()
    jest.spyOn(setStorageMock,'set').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save(mockAccountModel())
    expect(promise).rejects.toThrow(new Error())
  })

  test('should throw if account falsy', async () => {
    const { sut } = makeSut()
    const promise = sut.save(undefined)
    expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
