import { mockAddAccountResult } from '@/domain/test'
import { AddAccount } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  account = mockAddAccountResult()
  params: AddAccount.Params
  callsCount = 0

  async add (params: AddAccount.Params): Promise<AddAccount.Result> {
    this.params = params
    this.callsCount++
    return this.account
  }
}
