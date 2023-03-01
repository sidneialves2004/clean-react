import React from 'react'
import Styles from './spinner-styles.scss'
import PropTypes from 'prop-types'

type Props = React.HTMLAttributes<HTMLElement> & {
  isNegative?: boolean
}

const Spinner: React.FC<Props> = (props: Props) => {
  const negativeClass = props.isNegative ? Styles.negative : ''
  return (
    <div {...props} data-testid="spinner" className={[Styles.spinner, negativeClass, props.className].join(' ')}>
      <div /><div /><div /><div />
    </div>
  )
}

Spinner.propTypes = {
  className: PropTypes.string
}

export default Spinner
