import React from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '../../layouts/AuthLayout'
import CreatePasswordForm from '../../components/auth/create-password/CreatePasswordForm'
import CodeError from '../../components/auth/create-password/CodeError'
import CreateSuccess from '../../components/auth/create-password/CreateSuccess'

const CreatePassword = () => {
  const router = useRouter()
  const { code, status } = router.query

  const onFinish = (values) => {
    router.query.status = 'success'
    router.push(router)
  }

  if (!code) {
    return <CodeError />
  }
  if (status) {
    return <CreateSuccess />
  }
  return <CreatePasswordForm onFinish={onFinish} />
}

export default CreatePassword

CreatePassword.getLayout = (page) => <AuthLayout> {page}</AuthLayout>
