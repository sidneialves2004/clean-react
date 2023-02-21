export class AccessDiniedError extends Error {
  constructor () {
    super('Acesso Negado')
    this.name = 'AccessDiniedError'
  }
}
