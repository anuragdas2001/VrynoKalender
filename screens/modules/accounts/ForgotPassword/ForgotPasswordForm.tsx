import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useMutation } from "@apollo/client";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import { ForgotPasswordFormFields } from "./ForgotPasswordFormFields";
import { FormikFormProps } from "../../../../shared/constants";
import Link from "next/link";
import { FORGOT_PASSWORD_MUTATION } from "../../../../graphql/mutations/forgetPassword";
import { Toast } from "../../../../components/TailwindControls/Toast";
import { useGoogleRecaptchaTokenGenerator } from "../shared/UseGoogleRecaptchaTokenGenerator";
import { SupportedApps } from "../../../../models/shared";

export const ForgotPasswordForm = ({
  messagesProps,
}: {
  messagesProps?: {
    containerMessage: string;
    buttonLabel: string;
    emailPlaceholder: string;
  };
}): React.ReactElement => {
  const { t } = useTranslation(["forgot-password", "common"]);
  const [forgotPasswordLoading, setForgotPasswordLoading] =
    React.useState(false);
  const generateCaptchaToken =
    useGoogleRecaptchaTokenGenerator("forgotPassword");

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email.")
      .required("Email is required."),
  });

  const [
    ForgotPassword,
    { error: forgotPasswordError, data: forgotPasswordData },
  ] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.accounts,
      },
    },
  });

  const handleForgotPassword = async (values: FormikValues) => {
    setForgotPasswordLoading(true);
    const tokenToUse = await generateCaptchaToken();

    const payload = {
      email: values.email,
      token: tokenToUse,
    };

    const result = await ForgotPassword({
      variables: {
        ...payload,
      },
    });

    if (!result) {
      Toast.error(`${t("common:unknown-message")}`);
      return;
    }
    setForgotPasswordLoading(false);
  };

  if (forgotPasswordLoading) console.log("Loading...");
  if (forgotPasswordError) {
    toast.error(t("common:unknown-message"));
  }

  if (!forgotPasswordLoading && !forgotPasswordError && forgotPasswordData) {
    if (
      forgotPasswordData.forgotPassword.messageKey === "email-sent-successfully"
    ) {
      toast.success("Email sent successfully");
      return (
        <>
          <div className="flex flex-col justify-center items-center">
            <img src={"/verification_link_sent.svg"} alt="vryno logo" />
          </div>
          <div className="flex flex-col justify-start">
            {/* <div className="text-lg font-bold">{t("reset-password-label")}</div> */}
            {/* <p className="text-lg font-bold">Forgot Password</p> */}
            <p className="text-sm mt-4 mb-1 text-vryno-label-gray">
              {/* {t("reset-password-email-sent-label")} */}A link to reset
              password has been share to your email
            </p>
            <p className="text-xsm mb-4 text-vryno-label-gray">
              <b>Note:</b> The generated link is valid only for 10 minutes.
            </p>
          </div>
          <Link href="/login" legacyBehavior>
            <a
              id="login-link"
              className="py-2 w-full text-sm flex flex-row items-center justify-center text-white rounded-md bg-vryno-theme-blue"
            >
              Continue to Login
            </a>
          </Link>
        </>
      );
    } else {
      toast.error("Invalid email ID");
    }
  }

  return (
    <>
      <div className="mb-4 text-vryno-label-gray text-sm">
        {messagesProps?.containerMessage
          ? messagesProps?.containerMessage
          : t("forgot-password-steps")}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-y-6 pb-2">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          {...FormikFormProps}
          onSubmit={async (values) => {
            await handleForgotPassword(values);
          }}
        >
          {({ handleSubmit }) => (
            <ForgotPasswordFormFields
              handleSubmit={handleSubmit}
              forgotPasswordLoading={forgotPasswordLoading}
              buttonLabel={messagesProps?.buttonLabel || null}
              emailPlaceholder={messagesProps?.emailPlaceholder || null}
            />
          )}
        </Formik>
      </form>
    </>
  );
};
