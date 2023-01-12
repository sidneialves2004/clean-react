export class InvalidFieldError extends Error {
  constructor (private readonly fieldName: string) {
    super(`Campo ${fieldName} inválido`)
    this.name = 'InvalidFieldError'
  }
}
