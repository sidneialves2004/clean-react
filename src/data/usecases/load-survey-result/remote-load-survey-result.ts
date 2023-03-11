import { RemoteSurveyResultModel } from '@/data/models'
import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDiniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyResult } from '@/domain/usecases'

export class RemoteLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadSurveyResult.Result>) {}

  async load (): Promise<LoadSurveyResult.ResultModel> {
    const httpResponse = await this.httpClient.request({ method: 'get', url: this.url })
    const remoteSurveyResult = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return Object.assign({}, remoteSurveyResult, { date: new Date(remoteSurveyResult.date) })
      case HttpStatusCode.forbidden: throw new AccessDiniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadSurveyResult {
  export type Result = RemoteSurveyResultModel
}
