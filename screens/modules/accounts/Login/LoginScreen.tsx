import React from "react";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { LoginForm } from "./LoginForm";
import { Config } from "../../../../shared/constants";
import { atRootApp } from "../../../../shared/instanceUtils";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { cookieUserStore } from "../../../../shared/CookieUserStore";

const LoginScreen = () => {
  if (process.browser && !atRootApp()) {
    const url = Config.publicRootUrl();
    window.location.href = url;
  }

  if (cookieUserStore.getAccessToken()) {
    window.location.href = "/instances";
  }

  const { t } = useTranslation(["login", "common"]);
  return (
    <LoginSignupContainer
      footer={
        <div className="text-center text-sm">
          <span className="mr-1">{t("not-register-label")}</span>
          <Link href="/register" legacyBehavior>
            <a id="register-link">
              <span className="text-vryno-theme-blue">
                {t("register-label")}
              </span>
            </a>
          </Link>
        </div>
      }
      title={t("login-form-label")}
      showCaptchaMessage={true}
    >
      <GoogleReCaptchaProvider
        useRecaptchaNet
        reCaptchaKey={Config.reCaptchaV3SiteKey ?? ""}
        useEnterprise
        scriptProps={{ async: true, defer: true, appendTo: "body" }}
      >
        <LoginForm />
      </GoogleReCaptchaProvider>
    </LoginSignupContainer>
  );
};
export default LoginScreen;
