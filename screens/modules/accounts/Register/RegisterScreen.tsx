import React from "react";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { RegisterForm } from "./RegisterForm";
import { RegisterLeftScreen } from "./RegisterLeftScreen";
import { Config } from "../../../../shared/constants";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useTranslation } from "next-i18next";
import { ContinueLoginMessage } from "../shared/ContinueLoginMessage";
import { ICountryDetails } from "../../../../api-utils/getCountryDetails";

const VerificationMailSent = () => (
  <ContinueLoginMessage
    heading={"Verification"}
    message={
      "A verification link has been sent to your email. See you soon after verification"
    }
    imagePath={"/verification_link_sent.svg"}
  />
);

function RegisterScreen({
  countryDetails,
}: {
  countryDetails: ICountryDetails;
}) {
  const { t } = useTranslation(["register", "common"]);
  const [userRegistered, setUserRegistered] = React.useState(false);

  return (
    <LoginSignupContainer
      widthClass={userRegistered ? "sm:w-97" : "sm:w-108"}
      hideLogoOnBigResolution={!userRegistered}
      title={userRegistered ? "" : t("register-form-label")}
      showCaptchaMessage={!userRegistered}
      leftPanel={
        userRegistered ? (
          <></>
        ) : (
          <div className="hidden lg:flex lg:flex-col">
            <RegisterLeftScreen />
          </div>
        )
      }
      applyPadding={true}
    >
      <GoogleReCaptchaProvider
        useRecaptchaNet
        reCaptchaKey={Config.reCaptchaV3SiteKey ?? ""}
        useEnterprise
        scriptProps={{ async: true, defer: true, appendTo: "body" }}
      >
        {userRegistered ? (
          <VerificationMailSent />
        ) : (
          <RegisterForm
            setUserRegistered={setUserRegistered}
            countryDetails={countryDetails}
          />
        )}
      </GoogleReCaptchaProvider>
    </LoginSignupContainer>
  );
}

export default RegisterScreen;
