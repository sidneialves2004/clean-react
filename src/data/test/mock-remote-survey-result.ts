import { RemoteLoadSurveyResult } from '@/data/usecases'
import faker from 'faker'

export const mockRemoteSurveyResultModel = (): RemoteLoadSurveyResult.Result => ({
  question: faker.random.words(10),
  date: faker.date.recent().toISOString(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.words(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(100),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }, {
    answer: faker.random.words(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(100),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }]
})
