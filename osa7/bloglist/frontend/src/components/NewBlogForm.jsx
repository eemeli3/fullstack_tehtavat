import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { TextField, Button } from '@mui/material'

const NewBlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('') // title for new blog
  const [author, setAuthor] = useState('') // author for new blog
  const [url, setUrl] = useState('') // url for new blog

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.user)

  const handleCreate = async (event) => {
    // handle create button click
    event.preventDefault()
    dispatch(
      createBlog({
        user,
        blog: {
          title,
          author,
          url,
        },
      }),
    )
    blogFormRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <TextField
            label="title"
            size="small"
            variant="filled"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <br />
        <div>
          <TextField
            label="author"
            size="small"
            variant="filled"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <br />
        <div>
          <TextField
            label="url"
            size="small"
            variant="filled"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <br />
        <div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
          >
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewBlogForm
