import { useDispatch, useSelector } from 'react-redux'
import { removeBlog } from '../reducers/blogReducer'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const RemoveButton = ({ blog }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user)
  const onClick = () => {
    dispatch(removeBlog(blog, user))
    navigate('/')
  }

  return <Button onClick={onClick} variant='contained' size='small'>remove</Button>
}

export default RemoveButton
