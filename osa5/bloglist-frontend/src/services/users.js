import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {// get all users from backend
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { getAll }