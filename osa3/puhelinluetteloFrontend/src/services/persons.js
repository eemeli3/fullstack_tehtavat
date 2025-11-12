import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {// get all contents from server
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const add = newObject => {// add person to server
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const remove = id => {// remove person from server
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const update = (id, personObject) => {// update person information on server
  const request = axios.put(`${baseUrl}/${id}`, personObject)
  return request.then(response => response.data)
}

export default {getAll, add, remove, update}