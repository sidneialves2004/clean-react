import React from 'react'
import { Link } from 'react-router-dom'

const Start: React.FC = () => {
  return (
    <div data-testid="container">
      <Link to="/login">CLICAR</Link>
    </div>
  )
}

export default Start
