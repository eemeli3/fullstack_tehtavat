import Input from './Input'
import FormButton from './FormButton'

const LoginForm = ({ handleLogin, username, handleUsernameChange, password, handlePasswordChange }) => {
  return(
    <div>
      <form id='loginForm' onSubmit={handleLogin}>
        <label>
          username
          <Input type='text' value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          password
          <Input type='password' value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <FormButton text='login' />
      </form>
    </div>
  )
}

export default LoginForm