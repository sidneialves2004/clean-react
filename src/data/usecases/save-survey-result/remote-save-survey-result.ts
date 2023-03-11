import { RemoteSurveyResultModel } from '@/data/models'
import { HttpClient } from '@/data/protocols/http'
import { SaveSurveyResult } from '@/domain/usecases'

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteSaveSurveyResult.Result>) {}

  async save (params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model> {
    await this.httpClient.request({ method: 'put', url: this.url })
    return null
  }
}

export namespace RemoteSaveSurveyResult {
  export type Result = RemoteSurveyResultModel
}
