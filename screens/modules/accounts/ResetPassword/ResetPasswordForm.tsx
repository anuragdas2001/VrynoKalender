import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useLazyQuery, useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { ResetPasswordFormFields } from "./ResetPasswordFormFields";
import { FormikFormProps } from "../../../../shared/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { VERIFY_EMAIL } from "../../../../graphql/queries/login";
import { RESET_PASSWORD_MUTATION } from "../../../../graphql/mutations/resetPassword";
import { useGoogleRecaptchaTokenGenerator } from "../shared/UseGoogleRecaptchaTokenGenerator";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { SupportedApps } from "../../../../models/shared";
import { ForgotPasswordForm } from "../ForgotPassword/ForgotPasswordForm";

export const ResetPasswordForm = (): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation([
    router.asPath.includes("reset-password")
      ? "reset-password"
      : "accept-invite",
    "common",
  ]);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("Password is required"))
      .label("Password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\+\(\)-])(?=.{12,})/,
        "Min 12 Characters, One Uppercase, One Lowercase, One Number & One Special Character."
      ),
  });
  const [verifyEmailLoading, setVerifyEmailLoading] = React.useState(false);

  const generateCaptchaToken =
    useGoogleRecaptchaTokenGenerator("resetPassword");

  const [ResetPassword, { data, error }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    }
  );

  const [VerifyEmail, { error: verifyEmailError, data: verifyEmailData }] =
    useLazyQuery(VERIFY_EMAIL, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    });

  const handleResetPassword = async (values: FormikValues) => {
    try {
      setVerifyEmailLoading(true);
      if (router.asPath.includes("accept-invite")) {
        await VerifyEmail({
          variables: {
            token: router.query.token,
          },
        });
      }
      await ResetPassword({
        variables: {
          password: values.password,
          token: router.query.token,
          token1: await generateCaptchaToken(),
        },
      });
    } catch (error: any) {
      Toast.error(error?.message);
    } finally {
      setVerifyEmailLoading(false);
    }
  };

  if (verifyEmailLoading) console.log("Verifyemailloading.....");
  if (verifyEmailError) console.log("verify Email Error : ", verifyEmailError);
  if (!verifyEmailError && !verifyEmailLoading && verifyEmailData) {
  }

  if (verifyEmailLoading) console.log("Loading...");
  if (
    ["invalid_token", "expired_token"].includes(data?.resetPassword?.messageKey)
  ) {
    toast.error("Token expired");
  }
  if (error) {
    toast.error(t("common:unknown-message"));
  }

  if (!verifyEmailLoading && !error && data) {
    if (data.resetPassword.messageKey === "password-reset-success") {
      return (
        <>
          <p className="mb-3 text-lg font-bold">Reset Password</p>
          <div className="bg-white flex flex-col justify-center items-center">
            <img src={"/congratulations.svg"} alt="vryno logo" />
            <div className="flex flex-col justify-start">
              <span className="mt-4 text-center mb-4">
                {t("reset-password-email-sent-label")}
              </span>
            </div>
            <Link href="/login" legacyBehavior>
              <a
                id="continue-login-link"
                className="py-2 w-full text-sm flex flex-row items-center justify-center text-white rounded-md bg-vryno-theme-blue"
              >
                Continue to Login
              </a>
            </Link>
          </div>
        </>
      );
    } else if (
      ["invalid_token", "expired_token"].includes(
        data?.resetPassword?.messageKey
      )
    ) {
      return (
        <div>
          <div className="mb-3 text-lg font-bold">Link Expired</div>
          <ForgotPasswordForm
            messagesProps={{
              containerMessage:
                "Please enter your email to reset your password.",
              buttonLabel: "Forgot Password",
              emailPlaceholder: "Please enter your email ...",
            }}
          />
        </div>
      );
    } else {
      toast.error(t("common:unknown-message"));
    }
  }

  return (
    <div>
      <span className="mb-3 text-lg font-bold">
        {t("reset-password-form-label")}
      </span>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-x-4 gapy-y-6 pb-2"
      >
        <Formik
          initialValues={{ password: "" }}
          validationSchema={validationSchema}
          {...FormikFormProps}
          onSubmit={async (values) => {
            await handleResetPassword(values);
          }}
        >
          {({ handleSubmit }) => (
            <ResetPasswordFormFields
              handleSubmit={handleSubmit}
              resetPasswordLoading={verifyEmailLoading}
            />
          )}
        </Formik>
      </form>
    </div>
  );
};
