import React, { useState } from "react";
import { useSession } from "../../context/useSession";
import { useLogin } from "../../hooks/useAuth";
import AuthLayout from "../../layouts/AuthLayout";
import PasswordLogin from "../../components/auth/login/PasswordLogin";
import FormTitle from "../../components/form/FormTitle";
import { App, Alert } from "antd";

const Login = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const { trigger, error, data } = useLogin();
  const { login } = useSession();

  const handleSubmit = (e) => {
    setLoading(true);
    trigger(e, {
      onSuccess: (res) => {
        if (e.remember) {
          localStorage.setItem("identifier", e.identifier);
          localStorage.setItem("password", e.password);
        } else {
          localStorage.removeItem("identifier");
          localStorage.removeItem("password");
        }
        setTimeout(() => {
          login({ data: res.data });
        }, 1000);
      },
      onError: (err) => {
        message.error({
          content:
            err?.response?.data?.error?.message.replace(
              "identifier",
              "email"
            ) || "Unable to connect to the server. Please try again",
          className: "auth-message",
        });

        setTimeout(() => {
          setLoading(false);
        }, 1500);
      },
    });
  };

  return (
    <>
      <div className="mb-6">
        {error && (
          <Alert
            showIcon
            message={
              error?.response?.data?.error?.message.replace(
                "identifier",
                "email"
              ) || "Unable to connect to the server."
            }
            type="error"
            banner
            className="rounded"
          />
        )}
        {data && (
          <Alert
            message="Login successful! Redirecting to dashboard..."
            type="success"
            banner
            className="rounded"
          />
        )}
      </div>
      <FormTitle />
      <PasswordLogin handleSubmit={handleSubmit} loading={loading} />
    </>
  );
};

export default Login;

Login.getLayout = (page) => <AuthLayout> {page}</AuthLayout>;
