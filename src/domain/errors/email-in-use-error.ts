export class EmailInUseError extends Error {
  constructor () {
    super('Este Email ja está em uso')
    this.name = 'EmailInUseError'
  }
}
