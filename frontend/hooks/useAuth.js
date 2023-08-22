import useSWRMutation from 'swr/mutation'

import {
  login,
  forgotPassword,
  resetPassword,
  confirmEmail,
  sendEmail,
} from '../utils/api/auth'

export const useLogin = () => {
  return useSWRMutation('/auth/local', login)
}

export const useForgotPassword = () => {
  return useSWRMutation('/auth/forgot-password', forgotPassword)
}

export const useResetPassword = () => {
  return useSWRMutation('/auth/reset-password', resetPassword)
}

export const useConfirmEmail = (token) => {
  return useSWRMutation(`/auth/email-confirmation${token}`, confirmEmail)
}
export const useSendEmail = () => {
  return useSWRMutation(`/auth/send-email-confirmation`, sendEmail)
}
