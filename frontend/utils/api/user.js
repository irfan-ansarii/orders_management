import axios from 'axios'
import Cookies from 'js-cookie'
import { getApiURL } from '../'

const token = Cookies.get('_TOKEN')
const API_URL = getApiURL()

export const getProfile = async (url) => {
  const token = Cookies.get('_TOKEN')
  return await axios.get(`${API_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const getUser = async (url) => {
  return await axios.get(`${API_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const getUsers = async (url) => {
  return await axios.get(`${API_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const createUser = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const editUser = async (url, { arg }) => {
  const { id } = arg
  return await axios.put(`${API_URL}${url}/${id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const changePassword = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const uploadMedia = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
