import { useEffect } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { loginWithStored } from './reducers/loginReducer'
import { useDispatch, useSelector } from 'react-redux'
import Users from './components/Users'
import Blogs from './components/Blogs'
import User from './components/User'
import ViewBlog from './components/ViewBlog'
import Menu from './components/Menu'
import { Container } from '@mui/material'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // get blogs from backend when app starts
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    // get users from backend when app starts
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    // login when app starts if user did not logout
    dispatch(loginWithStored())
  }, [dispatch])

  const user = useSelector((state) => state.user.user)

  const hideWhenLoggedIn = { display: user !== '' ? 'none' : '' }
  const showWhenLoggedIn = { display: user !== '' ? '' : 'none' }
  return (
    <Router>
      <Container>
        <div>
          <div style={hideWhenLoggedIn}>
            <h2>log in to application</h2>
            <Notification />
            <LoginForm />
          </div>
          <div style={showWhenLoggedIn}>
            <Menu />
            <br />
            <Notification />
            <h2>BLOG APP</h2>
            <Routes>
              <Route path='users/:id' element={<User />} />
              <Route path='/users' element={<Users />} />
              <Route path='/blogs/:id' element={<ViewBlog />} />
              <Route path='/' element={<Blogs />} />
            </Routes>
          </div>
        </div>
      </Container>
    </Router>
  )
}

export default App
