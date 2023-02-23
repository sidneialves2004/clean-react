import * as Http from './http-mocks'
import faker from 'faker'

export const mockEmailInUseError = (): void => Http.mockForbiddenError('POST', 'signup')
export const mockUnexpectedError = (): void => Http.mockServerError('POST', 'signup')
export const mockOk = (delay?: number): void => Http.mockOk('POST', 'signup', { accessToken: faker.random.uuid(), name: faker.name.findName() }, delay)
