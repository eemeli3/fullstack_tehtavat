import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import NotificationContext from './NotificationContext' 
import { getAnecdotes, createAnecdote, voteAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const { notificationDispatch } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const notify = (message) => {// show notification message for 5 seconds
    notificationDispatch({
      type: 'SHOW',
      payload: message,
    })
    setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 5000)
  }

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notify(`You created '${newAnecdote.content}`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (changedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map( anecdote => anecdote.id === changedAnecdote.id ? changedAnecdote : anecdote))
      notify(`You voted '${changedAnecdote.content}`)
    },
    onError: () => {
      notify('failed to vote anecdote')
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
    refetchOnWindowFocus: false
  })

  if (result.isPending) {
    return <div>loading anecdotes...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm newAnecdoteMutation={newAnecdoteMutation} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
