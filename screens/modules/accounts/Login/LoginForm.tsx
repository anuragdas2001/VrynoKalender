import React from "react";
import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { LoginFormFields } from "./LoginFormFields";
import { Config, FormikFormProps } from "../../../../shared/constants";
import { ApolloError, useLazyQuery } from "@apollo/client";
import { LOGIN_QUERY } from "../../../../graphql/queries/login";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { queryOptionsAccounts } from "../../../../shared/apolloClient";
import { useGoogleRecaptchaTokenGenerator } from "../shared/UseGoogleRecaptchaTokenGenerator";
import { observer } from "mobx-react-lite";
import { cookieUserStore } from "../../../../shared/CookieUserStore";
import { RedirectToInstances } from "./RedirectToInstances";

type LoginResponse = {
  accessToken: string;
  messageKey: string;
  message: string;
};

type LoginData = {
  login: LoginResponse;
};

type LoginVars = {
  email: string;
  password: string;
  token: string;
};

export const LoginForm = observer((): React.ReactElement => {
  const { t } = useTranslation(["login", "common"]);
  const generateCaptchaToken = useGoogleRecaptchaTokenGenerator("login");
  const [loginProcessing, setLoginProcessing] = React.useState(false);
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [instanceProcessing, setInstanceProcessing] = React.useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("common:email-invalid-message"))
      .required(t("common:email-required-message")),
    password: Yup.string().required(t("common:password-required-message")),
  });

  const [LoginUser] = useLazyQuery<LoginData, LoginVars>(LOGIN_QUERY, {
    fetchPolicy: "no-cache",
  });

  const handleLogin = async (values: FormikValues) => {
    try {
      return LoginUser({
        variables: {
          email: values.email,
          password: values.password,
          token: values.token,
        },
        ...queryOptionsAccounts,
      });
    } catch (error: any) {
      Toast.error(
        `${t("common:unknown-message")}, ${
          Config.isClientDevMode() ? error.message : ""
        }`
      );
    }
  };

  const isLoginSuccess = async (loginResponse: LoginResponse) => {
    if (
      !(
        loginResponse.messageKey === "login-success" &&
        loginResponse.accessToken
      )
    ) {
      setLoginSuccess(false);
      return false;
    }
    console.log("[login] User logged in using form based login");
    cookieUserStore.setAccessToken(loginResponse.accessToken);
    // await getInstancesAndRedirect();
    setLoginProcessing(false);
    setLoginSuccess(true);
    return true;
  };

  const postLoginProcessing = async (
    data: LoginData | undefined,
    error: ApolloError | undefined,
    values: FormikValues
  ) => {
    if (error || !(data && data.login)) {
      Toast.error(
        `${t("common:unknown-message")}, ${
          Config.isClientDevMode() ? (error ? error.message : "") : ""
        }`
      );
      setLoginProcessing(false);
      return;
    }

    const loginResponse = data.login;

    if (await isLoginSuccess(loginResponse)) {
      return;
    }

    if (loginResponse.messageKey || loginResponse.message) {
      Toast.error(
        t(
          loginResponse.messageKey,
          loginResponse.message || loginResponse.messageKey
        )
      );
      setLoginProcessing(false);
      return;
    }
    Toast.error(t("common:unknown-message"));
    setLoginProcessing(false);
  };

  const OnSubmitCall = async (values: FormikValues) => {
    setLoginProcessing(true);
    const token = await generateCaptchaToken();
    const payload = {
      email: values.email,
      password: values.password,
      token: token,
    };
    const { error, data } = (await handleLogin(payload)) || {};
    await postLoginProcessing(data, error, values);
  };

  return (
    <>
      {loginSuccess && (
        <RedirectToInstances
          setInstanceProcessing={setInstanceProcessing}
          loginSuccess={loginSuccess}
        />
      )}
      <form onSubmit={(e) => e.preventDefault()} className="grid pb-2">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          {...FormikFormProps}
          onSubmit={OnSubmitCall}
        >
          {({ handleSubmit }) => (
            <>
              <LoginFormFields
                handleSubmit={handleSubmit}
                loginLoading={loginProcessing || instanceProcessing}
              />
            </>
          )}
        </Formik>
      </form>
    </>
  );
});
