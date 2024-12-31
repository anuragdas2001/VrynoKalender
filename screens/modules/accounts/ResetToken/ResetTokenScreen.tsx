import React from "react";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { EmailVerifyErrorContainer } from "../shared/EmailVerifyErrorContainer";
import { useTranslation } from "next-i18next";

function ResetTokenScreen(props: any) {
  const { t } = useTranslation("reset-token");
  return (
    <LoginSignupContainer>
      <EmailVerifyErrorContainer
        message={t(
          "Click reset token to get new verification link on your email address. See you soon after verification"
        )}
        heading={t("Your token has expired")}
        imagePath={"/invalid-token-icon.svg"}
        token={props.token}
      />
    </LoginSignupContainer>
  );
}

export default ResetTokenScreen;
