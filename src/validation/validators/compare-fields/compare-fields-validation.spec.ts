import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidFieldError } from '@/validation/errors'
import faker from 'faker'

const makeSut = (valueToCompare: string, field = faker.database.column()): CompareFieldsValidation => new CompareFieldsValidation(field, valueToCompare)

describe('CompareFieldValiton', () => {
  test('should return error if compare is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(faker.random.word(), field)
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldError(field))
  })

  test('should returns falsy if validation succeeds', () => {
    const field = faker.database.column()
    const value = faker.random.word()
    const sut = makeSut(value, field)
    const error = sut.validate(value)
    expect(error).toBeFalsy()
  })
})
