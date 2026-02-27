import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginWithCredentials } from '../reducers/loginReducer'
import { TextField, Button } from '@mui/material'

const LoginForm = () => {
  const [username, setUsername] = useState('') // username for login
  const [password, setPassword] = useState('') // password for login

  const dispatch = useDispatch()

  const handleUsernameChange = (event) => {
    // handle changes to username field
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    // handle changes to password field
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    // function for logging in
    event.preventDefault()
    dispatch(
      loginWithCredentials({
        username: username,
        password: password,
      }),
    )
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form id="loginForm" onSubmit={handleLogin}>
        <div>
          <TextField label="username" size='small' value={username} onChange={handleUsernameChange} />
        </div>
        <br/>
        <div>
          <TextField
            label='password'
            type="password"
            size='small'
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <br />
        <Button variant='contained' type='submit' color='primary' size='small'>login</Button>
      </form>
    </div>
  )
}

export default LoginForm
