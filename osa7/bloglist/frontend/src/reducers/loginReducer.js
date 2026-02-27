import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import userService from '../services/users'
import { notify } from './notificationReducer'

const initialState = {
  user: '',
  username: '',
  name: '',
  id: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(action.payload),
      )
      return action.payload
    },
    clearLoginInfo() {
      window.localStorage.removeItem(
        'loggedBloglistUser',
      )
      return initialState
    },
    loginWithStored() {
      const loggedUserJSON =
        window.localStorage.getItem(
          'loggedBloglistUser',
        )
      if (loggedUserJSON) {
        const storedInfo = JSON.parse(
          loggedUserJSON,
        )
        return {
          user: storedInfo.user,
          username: storedInfo.username,
          name: storedInfo.name,
          userId: storedInfo.userId,
        }
      }
    }
  }
})

const { login, clearLoginInfo } = userSlice.actions

export const loginWithCredentials = (credentials) => {
  return async (dispatch) => {
    try {
      const loginInfo = await loginService.login(credentials)

      const users =
        await userService.getAll()
      const [userInfo] = users.filter(
        (user) =>
          user.username === credentials.username,
      )
      if (!userInfo.name) {
        userInfo.name = ''
      }

      dispatch(login({
        user: loginInfo.token,
        username: credentials.username,
        name: userInfo.name,
        userId: userInfo.id,
      }))

      dispatch(notify({
        message: `${userInfo.name} logged in`,
        isGood: true,
      }))

    } catch {
      dispatch(notify({
        message:
          'Username or password invalid',
        isGood: false,
      }))
    }
  }
}

export const logout = (name) => {
  return (dispatch) => {
    dispatch(clearLoginInfo())
    dispatch(notify({
      message: `${name} logged out`,
      isGood: true,
    }))
  }
}

export const { loginWithStored } = userSlice.actions

export default userSlice.reducer