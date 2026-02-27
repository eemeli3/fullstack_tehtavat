import { useDispatch } from 'react-redux'
import { likeBlog } from '../reducers/blogReducer'
import { Button } from '@mui/material'

const LikeButton = ({ blog }) => {
  const dispatch = useDispatch()
  const onClick = () => dispatch(likeBlog(blog))
  return <Button onClick={onClick} variant='contained' size='small'>like</Button>
}

export default LikeButton
