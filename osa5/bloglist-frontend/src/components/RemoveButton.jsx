const RemoveButton = ({ blog, removeBlog }) => {
  return (
    <button onClick={() => removeBlog(blog)}>remove</button>
  )
}

export default RemoveButton