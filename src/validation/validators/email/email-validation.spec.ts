import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from '@/validation/validators'

describe('Email Validation', () => {
  test('should return error if email is invalid', () => {
    const sut = new EmailValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new InvalidFieldError('email'))
  })
})
