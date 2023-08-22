import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  getProfile,
  getUser,
  getUsers,
  createUser,
  editUser,
  changePassword,
  uploadMedia,
} from '../../utils/api/user'

export const useProfileData = () => {
  return useSWRMutation(`/users/me?populate=*`, getProfile)
}

export const useUserData = (id) => {
  return useSWR(`/users/${id}?populate=*`, getUser)
}

export const useUsersData = (q) => {
  const search = q.search
    ? `&filters[$or][0][name][$contains]=${q.search}&filters[$or][1][mobile][$contains]=${q.search}&filters[$or][2][email][$contains]=${q.search}&filters[$or][3][userRole][$contains]=${q.search}`
    : ``
  const blocked = q.blocked ? `&filters[blocked][$eq]=${q.blocked}` : ``
  const sort = '&sort=createdAt:desc'

  return useSWR(`/users?populate=*${search}${blocked}${sort}`, getUsers)
}

export const useCreateUser = () => {
  return useSWRMutation(`/auth/local/register`, createUser)
}
export const useEditUser = () => {
  return useSWRMutation(`/users`, editUser)
}

export const useChangePassword = () => {
  return useSWRMutation('/auth/change-password', changePassword)
}

export const useUploadMedia = () => {
  return useSWRMutation(`/upload`, uploadMedia)
}
