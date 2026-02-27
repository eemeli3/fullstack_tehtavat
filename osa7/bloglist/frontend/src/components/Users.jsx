import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector(state => state.users)
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
            </TableCell>
            <TableCell>
              <strong>blogs created</strong>
            </TableCell>
          </TableRow>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>
                {user.blogs.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Users