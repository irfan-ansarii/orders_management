import axios from 'axios'
import Cookies from 'js-cookie'
import { getApiURL } from '../'

const token = Cookies.get('_TOKEN')
const API_URL = getApiURL()

export const getTimeline = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
