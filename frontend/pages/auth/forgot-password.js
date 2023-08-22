import React from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '../../layouts/AuthLayout'
import ForgetPasswordForm from '../../components/auth/forgot-password/ForgetPasswordForm'
import EmailSuccess from '../../components/auth/forgot-password/EmailSuccess'
import { useForgotPassword } from '../../hooks/useAuth'
import { message } from 'antd'

const ForgetPassword = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const { email } = router.query

  const { trigger, isMutating } = useForgotPassword()

  const triggerMessage = (type, content) => {
    messageApi.open({
      type: type,
      content: content,
      className: 'auth-message',
      duration: 1,
    })
  }

  const sendLink = (value) => {
    triggerMessage('loading', 'Sending')

    trigger(value, {
      onSuccess: (res) => {
        triggerMessage('success', 'Email Sent')
        if (!email)
          router.push({
            query: { email: value.email },
          })
      },
      onError: (err) => {
        triggerMessage('error', 'Some error has occured')
      },
    })
  }

  const onFinish = (e) => {
    sendLink(e)
  }

  const onResend = () => {
    sendLink({ email })
  }

  if (email) {
    return (
      <>
        {contextHolder}
        <EmailSuccess onResend={onResend} loading={isMutating} />
      </>
    )
  }
  return <ForgetPasswordForm onFinish={onFinish} loading={isMutating} />
}

export default ForgetPassword

ForgetPassword.getLayout = (page) => <AuthLayout> {page}</AuthLayout>
