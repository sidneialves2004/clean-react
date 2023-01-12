import { MinLengthFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (minLength: number,fieldName?: string): MinLengthValidation => new MinLengthValidation(fieldName || faker.database.column(), minLength)

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const minLength = 5
    const fieldName = faker.random.word()
    const sut = makeSut(minLength,fieldName)
    const error = sut.validate(faker.random.alphaNumeric(3))
    expect(error).toEqual(new MinLengthFieldError(fieldName,minLength))
  })

  test('should return falsy if value is valid', () => {
    const minLength = 5
    const sut = makeSut(minLength)
    const error = sut.validate(faker.random.alphaNumeric(minLength))
    expect(error).toBeFalsy()
  })
})
