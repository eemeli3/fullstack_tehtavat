import Blog from './Blog'
import { useSelector } from 'react-redux'
import {
  TableContainer,
  Table,
  TableBody,
  Paper,
} from '@mui/material'

const DisplayBlogs = () => {
  const blogs = useSelector(state => state.blogs)
  return (
    <TableContainer component={Paper} >
      <Table>
        <TableBody>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DisplayBlogs