import { MinLengthFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (field: string,minLength: number): MinLengthValidation => new MinLengthValidation(field, minLength)

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const minLength = 5
    const field = faker.database.column()
    const sut = makeSut(field, minLength)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(3) })
    expect(error).toEqual(new MinLengthFieldError(field,minLength))
  })

  test('should return falsy if value is valid', () => {
    const field = faker.database.column()
    const minLength = 5
    const sut = makeSut(field, minLength)
    const error = sut.validate({ [faker.database.column()]: faker.random.alphaNumeric(minLength) })
    expect(error).toBeFalsy()
  })

  test('should return falsy if field does not exists in schema', () => {
    const minLength = 5
    const sut = makeSut(faker.database.column(), minLength)
    const error = sut.validate({ [faker.database.column()]: faker.random.alphaNumeric(minLength) })
    expect(error).toBeFalsy()
  })
})
