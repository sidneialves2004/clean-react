import * as Helper from './http-mocks'
import faker from 'faker'

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError('signup')
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError('POST', 'signup')
export const mockInvaldData = (delay?: number): void => Helper.mockOk('POST', 'signup', { invalidProperty: faker.random.uuid() }, delay)
export const mockOk = (delay?: number): void => Helper.mockOk('POST', 'signup', { accessToken: faker.random.uuid(), name: faker.name.findName() }, delay)
