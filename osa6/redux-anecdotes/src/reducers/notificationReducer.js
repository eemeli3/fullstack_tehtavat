import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  },
})

const { showNotification, removeNotification } = notificationSlice.actions

export const setNotification = ( message, time ) =>{
  return (dispatch) => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time)
  }
}

export default notificationSlice.reducer