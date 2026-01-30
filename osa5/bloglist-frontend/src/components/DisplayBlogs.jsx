import Blog from './Blog'

const DisplayBlogs = ({ blogs, likeBlog, removeBlog, userId }) => {
  return (
    <div>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} userId={userId} />
      )}
    </div>
  )
}

export default DisplayBlogs