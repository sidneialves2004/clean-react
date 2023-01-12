import { MinLengthFieldError } from '@/validation/errors'
import { MinLengthValidation } from '@/validation/validators'

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const sut = new MinLengthValidation('field',5)
    const error = sut.validate('123')
    expect(error).toEqual(new MinLengthFieldError('field',5))
  })

  test('should return falsy if value is valid', () => {
    const sut = new MinLengthValidation('field',5)
    const error = sut.validate('12345')
    expect(error).toBeFalsy()
  })
})
