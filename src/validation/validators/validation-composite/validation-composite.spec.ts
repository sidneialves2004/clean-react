import { ValidationComposite } from '@/validation/validators'
import { FieldValidationSpy } from '@/validation/test'
import faker from 'faker'

type SutTypes = {
  sut: ValidationComposite
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (field: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(field),
    new FieldValidationSpy(field)
  ]
  const sut = ValidationComposite.build(fieldValidationsSpy)

  return {
    sut,
    fieldValidationsSpy
  }
}

describe('ValidationComposite', () => {
  test('should return error if any validation fails', () => {
    const field = faker.database.column()
    const { sut, fieldValidationsSpy } = makeSut(field)
    const msgError = faker.random.words()
    const msgError2 = faker.random.words()
    fieldValidationsSpy[0].error = new Error(msgError)
    fieldValidationsSpy[1].error = new Error(msgError2)
    const error = sut.validate(field,{ [field]: faker.random.word() })
    expect(error).toBe(msgError)
  })

  test('should returns falsy if there is no error', () => {
    const field = faker.database.column()
    const { sut } = makeSut(field)
    const error = sut.validate(field,{ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
