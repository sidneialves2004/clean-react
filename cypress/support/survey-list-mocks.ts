import * as Http from './http-mocks'

export const mockUnexpectedError = (): void => Http.mockServerError('GET', 'surveys')
export const mockAccessDiniedError = (): void => Http.mockForbiddenError('GET', 'surveys')
