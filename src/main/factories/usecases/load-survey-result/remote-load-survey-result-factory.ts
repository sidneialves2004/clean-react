import { RemoteLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResult } from '@/domain/usecases'
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators'

export const makeRemoteSurveyResult = (id: string): LoadSurveyResult => {
  return new RemoteLoadSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpGetClientDecorator())
}
