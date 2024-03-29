import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDiniedError, UnexpectedError } from '@/domain/errors'
import { LoadSurveyList } from '@/domain/usecases'

export class RemoteLoadSurveyList implements LoadSurveyList {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadSurveyList.SurveyModel[]>
  ) {}

  async loadAll (): Promise<LoadSurveyList.SurveyModel[]> {
    const httpResponse = await this.httpClient.request({
      method: 'get',
      url: this.url
    })
    const remoteSurveys = httpResponse.body || []
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteSurveys.map(remoteSurvey => Object.assign(remoteSurvey,{
        date: new Date(remoteSurvey.date)
      }))
      case HttpStatusCode.noContent: return []
      case HttpStatusCode.forbidden: throw new AccessDiniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadSurveyList {
  export type SurveyModel = {
    id: string
    question: string
    date: string
    didAnswer: boolean
  }
}
