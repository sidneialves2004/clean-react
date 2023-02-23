import * as Http from './http-mocks'
import faker from 'faker'

export const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError('login')
export const mockUnexpectedError = (): void => Http.mockServerError('POST', 'login')
export const mockOk = (delay?: number): void => Http.mockOk('POST', 'login', { accessToken: faker.random.uuid(), name: faker.name.findName() }, delay)
