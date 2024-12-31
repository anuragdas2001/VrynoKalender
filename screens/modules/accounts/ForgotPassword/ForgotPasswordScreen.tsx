import React from "react";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Config } from "../../../../shared/constants";
import { atRootApp } from "../../../../shared/instanceUtils";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useTranslation } from "next-i18next";

function ForgotPasswordScreen() {
  if (process.browser && !atRootApp()) {
    const url = Config.publicRootUrl();
    window.location.href = url;
  }
  const { t } = useTranslation(["forgot-password", "common"]);
  return (
    <LoginSignupContainer title={t("Forgot-password-form-label")}>
      <GoogleReCaptchaProvider
        useRecaptchaNet
        reCaptchaKey={Config.reCaptchaV3SiteKey ?? ""}
        useEnterprise
        scriptProps={{ async: true, defer: true, appendTo: "body" }}
      >
        <ForgotPasswordForm />
      </GoogleReCaptchaProvider>
    </LoginSignupContainer>
  );
}
export default ForgotPasswordScreen;
