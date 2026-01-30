import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {// get all blogs from backend
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog, token) => {// create a new blog
  const response = await axios.post(baseUrl, blog, { headers: { 'Authorization' : `Bearer ${token}` } })
  return response.data
}

const like = async (updatedBlog, id) => {// like a blog
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const remove = async (id, token) => {// delete a blog
  const response = await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization' : `Bearer ${token}` } } )
  return response.data
}

export default { getAll, create, like, remove }