import React from 'react'
import { Link } from 'react-router-dom'

const Start: React.FC = () => {
  return (
    <div data-testid="container">
      <Link to="/login">LOGIN</Link>
      <Link to="/signup">SIGNUP</Link>
    </div>
  )
}

export default Start
