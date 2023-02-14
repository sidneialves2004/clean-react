import * as Helper from './http-mocks'
import faker from 'faker'

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError('signup')
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError('POST', 'signup')
export const mockInvaldData = (): void => Helper.mockOk('POST', 'signup', { invalidProperty: faker.random.uuid() })
export const mockOk = (): void => Helper.mockOk('POST', 'signup', { accessToken: faker.random.uuid(), name: faker.name.findName() })
