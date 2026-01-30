import ViewBlog from './ViewBlog'

const Blog = ({ blog, likeBlog, removeBlog, userId }) => {
  return (
    <div className='blog'>
      {blog.title} {blog.author} <ViewBlog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} userId={userId} />
    </div>
  )
}

export default Blog