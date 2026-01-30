const LikeButton = ({ blog, likeBlog }) => {
  return (
    <button onClick={() => likeBlog(blog)}>like</button>
  )
}

export default LikeButton