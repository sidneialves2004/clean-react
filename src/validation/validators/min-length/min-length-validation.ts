import { MinLengthFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols'

export class MinLengthValidation implements FieldValidation {
  constructor (readonly field: string, private readonly minLength: number) {}
  validate (input: object): Error {
    return input[this.field]?.length < this.minLength ? new MinLengthFieldError(this.field,this.minLength) : null
  }
}
