export interface LoadSurveyResult {
  load: () => Promise<LoadSurveyResult.ResultModel[]>
}

export namespace LoadSurveyResult {
  export type ResultModel = {
    question: string
    date: Date
    answers: [{
      image?: string
      answer: string
      count: number
      percent: number
    }]
  }
}
