import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import LikeButton from './LikeButton'
import RemoveButton from './RemoveButton'
import { Link } from 'react-router-dom'

const ViewBlog = () => {
  const id = useParams().id
  const userId = useSelector(state => state.user.userId)
  const blogs = useSelector(state => state.blogs)
  if (blogs.length === 0) {
    return null
  }
  const [ blog ] = blogs.filter(blog => blog.id === id)
  return (
    <span>
      <div>
        <h1>{blog.title}</h1>
        <Link to={`${blog.url}`}>{blog.url}</Link>
        <div>{blog.likes} likes <LikeButton blog={blog} /></div>
        <div>added by {blog.user.name}</div>
        <br/>
        <div style={{ display: userId === blog.user.id ? '' : 'none' }}>
          <RemoveButton blog={blog} />
        </div>
        <br/>
        <strong>comments</strong>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index.toString()}>{comment}</li>
          ))}
        </ul>
      </div>
    </span>
  )
}

export default ViewBlog