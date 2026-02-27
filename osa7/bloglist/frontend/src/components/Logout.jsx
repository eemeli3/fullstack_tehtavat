import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import { Button } from '@mui/material'

const Logout = () => {
  const dispatch = useDispatch()
  const name = useSelector((state) => state.user.name)
  const onClick = () => dispatch(logout(name))

  return (
    <div>
      &nbsp;&nbsp;{name} logged in <Button onClick={onClick} variant='contained' color='secondary'>logout</Button>
    </div>
  )
}

export default Logout
