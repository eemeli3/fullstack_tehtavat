import { useRef } from 'react'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import DisplayBlogs from './DisplayBlogs'


const Blogs = () => {
  const blogFormRef = useRef()
  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <br/>
      <DisplayBlogs />
    </div>
  )
}

export default Blogs