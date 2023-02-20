import { AddAccount } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

export const mockAddAccountResult = (): AddAccount.Result => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.findName()
})
