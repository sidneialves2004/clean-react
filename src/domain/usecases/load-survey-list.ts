export interface LoadSurveyList {
  loadAll: () => Promise<LoadSurveyList.SurveyModel[]>
}

export namespace LoadSurveyList {
  export type SurveyModel = {
    id: string
    question: string
    date: Date
    didAnswer: boolean
  }
}
