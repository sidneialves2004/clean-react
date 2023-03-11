import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.ResultModel>
}

export namespace LoadSurveyResult {
  export type ResultModel = SurveyResultModel
}
