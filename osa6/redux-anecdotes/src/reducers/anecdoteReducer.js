import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      return (
        state
          .map( (anecdote) => anecdote.id === action.payload.id
            ? action.payload 
            : anecdote)
          .sort( (a, b) => b.votes - a.votes )
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

const { createAnecdote, setAnecdotes, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  const anecdote = {
    content: content,
    id: getId(),
    votes: 0
  }

  return async (dispatch) => {
    const result = await anecdoteService.addAnecdote(anecdote)
    dispatch(createAnecdote(result))
  }
}

export const voteForAnecdote =  (id) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.getAnecdote(id)
    const result = await anecdoteService.changeAnecdote({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(voteAnecdote(result))
  }
}

export default anecdoteSlice.reducer
