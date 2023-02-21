import faker from 'faker'
import { RemoteLoadSurveyList } from '../usecases'

export const mockRemoteSurveyModel = (): RemoteLoadSurveyList.SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  date: faker.date.recent().toISOString(),
  didAnswer: faker.datatype.boolean()
})

export const mockRemoteSurveyListModel = (): RemoteLoadSurveyList.SurveyModel[] => ([
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel(),
  mockRemoteSurveyModel()
])
