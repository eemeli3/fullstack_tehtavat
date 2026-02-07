import { useDispatch, useSelector } from 'react-redux'
import { voteForAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const vote = id => {
    dispatch(voteForAnecdote(id))
    const message = `You voted '${anecdotes.filter((anecdote) => anecdote.id === id)[0].content}'`
    dispatch(setNotification(message, 5000))
  }

  return (
    <div >
      {
        anecdotes
          .map(anecdote => (
            <div key={anecdote.id}>
              <div>{anecdote.content}</div>
              <div>
                has {anecdote.votes}
                <button onClick={() => vote(anecdote.id)}>vote</button>
              </div>
            </div>
          ))
      }
    </div>
  )
}

export default AnecdoteList