import axios from 'axios'
import { getApiURL } from '../'

const API_URL = getApiURL()

export const login = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg)
}

export const forgotPassword = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg)
}

export const resetPassword = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg)
}

export const confirmEmail = async (url) => {
  return await axios.get(`${API_URL}${url}`)
}

export const sendEmail = async (url, { arg }) => {
  return await axios.post(`${API_URL}${url}`, arg)
}

