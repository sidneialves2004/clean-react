import React from 'react'
import { makeRemoteAddAccount } from '@/main/factories/usecases'
import { makeSignupValidation } from '@/main/factories/pages'
import { Signup } from '@/presentation/pages'

export const makeSignup: React.FC = () => {
  return (
      <Signup
        addAccount={ makeRemoteAddAccount()}
        validation={makeSignupValidation()}
      />
  )
}
