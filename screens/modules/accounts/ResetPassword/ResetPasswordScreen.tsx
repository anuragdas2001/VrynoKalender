import React from "react";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Config } from "../../../../shared/constants";
import { atRootApp } from "../../../../shared/instanceUtils";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useTranslation } from "next-i18next";

function ResetPasswordScreen() {
  if (process.browser && !atRootApp()) {
    const url = Config.publicRootUrl();
    window.location.href = url;
  }

  const { t } = useTranslation(["forgot-password", "accept-invite", "common"]);
  return (
    <LoginSignupContainer>
      <GoogleReCaptchaProvider
        useRecaptchaNet
        reCaptchaKey={Config.reCaptchaV3SiteKey ?? ""}
        useEnterprise
        scriptProps={{ async: true, defer: true, appendTo: "body" }}
      >
        <ResetPasswordForm />
      </GoogleReCaptchaProvider>
    </LoginSignupContainer>
  );
}
export default ResetPasswordScreen;
