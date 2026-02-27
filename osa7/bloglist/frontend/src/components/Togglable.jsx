import { useState, useImperativeHandle } from 'react'
import { Button } from '@mui/material'

const Togglable = (props) => {
  // component that shows or hides child components when toggled
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} variant='contained' size='small' >{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} size='small' >cancel</Button>
      </div>
    </div>
  )
}

export default Togglable
