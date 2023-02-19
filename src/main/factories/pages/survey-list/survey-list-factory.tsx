import React from 'react'
import { makeRemoteSurveyList } from '@/main/factories/usecases'
import { SurveyList } from '@/presentation/pages'

export const makeSurveyList: React.FC = () => {
  return (
    <SurveyList
      loadSurveyList={makeRemoteSurveyList()}
    />
  )
}
