import {
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import Logout from './Logout'

const Menu = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Logout />
      </Toolbar>
    </AppBar>
  )
}

export default Menu