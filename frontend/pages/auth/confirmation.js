import React from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '../../layouts/AuthLayout'
import ConfirmSuccess from '../../components/auth/email-confirmation/ConfirmSuccess'
import CodeError from '../../components/auth/email-confirmation/CodeError'

const VerifyEmail = () => {
  const router = useRouter()
  const { code } = router.query

  const onFinish = (values) => {
    router.query.status = 'success'
    router.push(router)
  }
  if (!code) {
    return <CodeError />
  }
  return <ConfirmSuccess />
}

export default VerifyEmail

VerifyEmail.getLayout = (page) => <AuthLayout> {page}</AuthLayout>
