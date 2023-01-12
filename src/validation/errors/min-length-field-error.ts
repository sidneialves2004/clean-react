export class MinLengthFieldError extends Error {
  constructor (private readonly fieldName: string, private readonly minLength: number) {
    super(`Campo ${fieldName} deve ter no minimo ${minLength} caracteres`)
    this.name = 'MinLengthFieldError'
  }
}
