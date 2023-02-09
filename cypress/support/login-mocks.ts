import * as Helper from './http-mocks'
import faker from 'faker'

export const mockInvalidCredentialsError = (): void => Helper.mockInvalidCredentialsError('login')
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError('POST', 'login')
export const mockOk = (): void => Helper.mockOk('POST', 'login', { accessToken: faker.random.uuid() })
export const mockInvaldData = (): void => Helper.mockOk('POST', 'login', { invalidProperty: faker.random.uuid() })
