const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }

  return await response.json()
}

const getAnecdote = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch anecdote')
  }

  return await response.json()
}

const addAnecdote = async (content) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }

  return await response.json()
}

const changeAnecdote = async (content) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  }

  const response = await fetch(`${baseUrl}/${content.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to change anecdote')
  }

  return await response.json()
}

export default { getAll, getAnecdote, addAnecdote, changeAnecdote }