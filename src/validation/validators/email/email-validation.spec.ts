import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators'
import faker from 'faker'

const makeSut = (fieldName?: string): EmailValidation => {
  return new EmailValidation(fieldName || faker.database.column())
}

describe('Email Validation', () => {
  test('should return error if email is invalid', () => {
    const fieldName = 'any_field'
    const sut = makeSut(fieldName)
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('should return falsy if email is valid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
