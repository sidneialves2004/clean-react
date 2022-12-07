import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError, InvalidCredentialsError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { Authentication, AuthenticationParams } from '@/domain/usecases'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}

  async auth (params: AuthenticationParams): Promise<AccountModel> {
    const httResponse = await this.httpPostClient.post({
      url: this.url, body: params
    })
    switch (httResponse.statusCode) {
      case HttpStatusCode.ok: return httResponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new UnexpectedError()
    }
  }
}
