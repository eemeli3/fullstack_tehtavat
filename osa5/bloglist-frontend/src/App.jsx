import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import DisplayBlogs from './components/DisplayBlogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])// list of blogs
  const [user, setUser] = useState()// authorization token for user
  const [username, setUsername] = useState('')// username for login
  const [password, setPassword] = useState('')// password for login
  const [name, setName] = useState()// user's name
  const [userId, setUserId] = useState()// user's ID
  const [message, setMessage] = useState(null)// notification message
  const [isGood, setIsGood] = useState(true)// flag for whether notification is good or bad

  useEffect(() => {// get blogs from backend when app starts
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {// login when app starts if user did not logout
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const storedInfo = JSON.parse(loggedUserJSON)
      setUser(storedInfo.user)
      setUsername(storedInfo.username)
      setName(storedInfo.name)
      setUserId(storedInfo.userId)
    }
  }, [])

  const blogFormRef = useRef()

  const notify = ({ message, isGood }) => {// function for using notifications
    setMessage(message)
    setIsGood(isGood)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogin = async (event) => {// function for logging in
    event.preventDefault()
    try {
      const loginInfo = await loginService.login({ username: username, password: password })

      setUser(loginInfo.token)
      setPassword('')
      const users = await userService.getAll()
      const [ userInfo ] = users.filter( (user) => user.username === username)
      if (!userInfo.name) {
        userInfo.name = ''
      }
      setName(userInfo.name)
      setUserId(userInfo.id)

      // store logged in user to local storage
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify({
          user: loginInfo.token,
          username: username,
          name: userInfo.name,
          userId: userInfo.id,
        })
      )

      notify({
        message: `${userInfo.name} logged in`,
        isGood: true,
      })
    } catch {
      notify({
        message: 'Username or password invalid',
        isGood: false,
      })
    }
  }

  const handleUsernameChange = (event) => {// handle changes to username field
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {// handle changes to password field
    setPassword(event.target.value)
  }

  const logout = () => {// function for logging out
    notify({
      message: `${name} logged out`,
      isGood: true,
    })

    setUser(null)
    setUsername('')
    setName(null)
    setUserId(null)
    window.localStorage.removeItem('loggedBloglistUser')// remove user information from local storage
  }

  const createBlog = async (blogObject) => {// function for creating new blog
    try {
      await blogService.create(blogObject, user)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      notify({
        message: `${blogObject.title} by ${blogObject.author} added`,
        isGood: true,
      })
      blogFormRef.current.toggleVisibility()
    } catch {
      notify({
        message: 'Failed to add blog',
        isGood: false,
      })
    }
  }

  const likeBlog = async ( blog ) => {// funcion for liking a blog
    try {
      await blogService.like(
        {
          user: blog.user.id,
          likes: blog.likes + 1,
          author: blog.author,
          title: blog.title,
          url: blog.url,
        }, blog.id)

      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      notify({
        message: `${blog.title} by ${blog.author} liked`,
        isGood: true,
      })
    } catch {
      notify({
        message: 'failed to like blog',
        isGood: false,
      })
    }
  }

  const removeBlog = async ( blog ) => {// function for removing a blog
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return
      }
      await blogService.remove(blog.id, user)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      notify({
        message: `${blog.title} by ${blog.author} removed`,
        isGood: true,
      })
    } catch {
      notify({
        message: 'failed to remove blog',
        isGood: false,
      })
    }
  }

  if (!user) {// if user has not logged in show login screen
    return(
      <div>
        <h2>log in to application</h2>
        <Notification message={message} isGood={isGood} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          handleUsernameChange={handleUsernameChange}
          password={password}
          handlePasswordChange={handlePasswordChange}
        />
      </div>
    )
  } else {// if user has not logged in show blogs and create blog button
    return(
      <div>
        <h2>blogs</h2>
        <Notification message={message} isGood={isGood} />
        <p>
          {name} logged in
          <button onClick={logout}>logout</button>
        </p>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <NewBlogForm createBlog={createBlog} notify={notify} name={name} />
        </Togglable>
        <DisplayBlogs blogs={blogs} likeBlog={likeBlog} removeBlog={removeBlog} userId={userId} />
      </div>
    )
  }
}

export default App