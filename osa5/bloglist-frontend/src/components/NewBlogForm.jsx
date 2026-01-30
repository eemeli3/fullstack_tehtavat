import { useState } from 'react'
import Input from './Input'
import FormButton from './FormButton'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')// title for new blog
  const [author, setAuthor] = useState('')// author for new blog
  const [url, setUrl] = useState('')// url for new blog

  const handleCreate = async (event) => {// handle create button click
    event.preventDefault()
    createBlog({ title: title, author: author, url: url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <label>
          title:
          <Input type='text' value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <br />
        <label>
          author:
          <Input type='text' value={author} onChange={(event) => setAuthor(event.target.value)} />
        </label>
        <br />
        <label>
          url:
          <Input type='text' value={url} onChange={(event) => setUrl(event.target.value)} />
        </label>
        <br />
        <FormButton text='create' />
      </form>
    </div>
  )
}

export default NewBlogForm