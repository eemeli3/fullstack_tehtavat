import { Link } from 'react-router-dom'
import {
  TableRow,
  TableCell,
} from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <TableRow key={blog.id}>
      <TableCell>
        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
      </TableCell>
    </TableRow>
  )
}

export default Blog