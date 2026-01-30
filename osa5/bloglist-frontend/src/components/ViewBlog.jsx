import { useState } from 'react'
import LikeButton from './LikeButton'
import RemoveButton from './RemoveButton'

const ViewBlog = ({ blog, likeBlog, removeBlog, userId }) => {
  const [view, setView] = useState(false)// state for whether contents are shown

  return (
    <span>
      <button onClick={() => setView(!view)}>
        {view ? 'hide' : 'view'}
      </button>
      <div style={{ display: view ? '' : 'none' }}>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<LikeButton blog={blog} likeBlog={likeBlog} /></div>
        <div>{blog.user.name}</div>
        <div style={{ display: userId === blog.user.id ? '' : 'none' }}>
          <RemoveButton blog={blog} removeBlog={removeBlog} />
        </div>
      </div>
    </span>
  )
}

export default ViewBlog