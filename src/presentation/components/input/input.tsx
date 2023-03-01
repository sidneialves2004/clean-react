import React, { useContext, useRef } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'
import PropTypes from 'prop-types'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]
  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }
  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState(old => ({
      ...old,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        placeholder=" "
        data-testid={props.name}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
      />
      <label
        data-testid={`${props.name}-label`}
        onClick={() => { inputRef.current.focus() }}
        title={error}
      >
        {props.placeholder}
      </label>
    </div>
  )
}
Input.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string
}

export default Input

// import React, { useContext, useRef } from 'react'
// import Styles from './input-styles.scss'
// import Context from '@/presentation/contexts/form/form-context'
// import PropTypes from 'prop-types'

// type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

// const Input: React.FC<Props> = (props: Props) => {
//   const { state, setState } = useContext(Context)
//   const inputRef = useRef<HTMLInputElement>()
//   const error = state[`${props.name}Error`]
//   const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
//     event.target.readOnly = false
//   }
//   const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
//     setState({
//       ...state,
//       [event.target.name]: event.target.value
//     })
//   }
//   const getStatus = (): string => {
//     return error ? '🔴' : '🟢'
//   }
//   const getTitle = (): string => {
//     return error || 'Tudo certo!'
//   }

//   return (
//     <div className={Styles.inputWrap}>
//       <input
//         {...props}
//         ref={inputRef}
//         placeholder=" "
//         data-testid={props.name}
//         readOnly
//         onFocus={enableInput}
//         onChange={handleChange}
//       />
//       <label onClick={() => { inputRef.current.focus() }}>
//         {props.placeholder}
//       </label>
//       <span
//         data-testid={`${props.name}-status`}
//         title={getTitle()}
//         className={Styles.status}
//         >
//           {getStatus()}
//       </span>
//     </div>
//   )
// }
// Input.propTypes = {
//   name: PropTypes.string,
//   placeholder: PropTypes.string
// }

// export default Input
