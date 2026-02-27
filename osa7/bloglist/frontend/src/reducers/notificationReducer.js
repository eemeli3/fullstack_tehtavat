import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  isGood: true,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    show(state, action) {
      return action.payload
    },
    clear() {
      return initialState
    }
  }
})

const { show, clear } = notificationSlice.actions

export const notify = (props) => {
  return (dispatch) => {
    dispatch(show(props))
    setTimeout(() => dispatch(clear()), 5000)
  }
}

export default notificationSlice.reducer