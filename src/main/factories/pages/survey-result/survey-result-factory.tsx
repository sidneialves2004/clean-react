import React from 'react'
import { makeRemoteSurveyResult } from '@/main/factories/usecases'
import { SurveyResult } from '@/presentation/pages'
import { useParams } from 'react-router-dom'

export const makeSurveyResult: React.FC = () => {
  const { id } = useParams<any>()
  return (
    <SurveyResult
      loadSurveyResult={makeRemoteSurveyResult(id)}
    />
  )
}
