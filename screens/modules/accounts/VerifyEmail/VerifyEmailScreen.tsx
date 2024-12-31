import React from "react";
import { useTranslation } from "next-i18next";
import { LoginSignupContainer } from "../shared/LoginSignupContainer";
import { ContinueLoginMessage } from "../shared/ContinueLoginMessage";

function VerifyEmailScreen({ messageKey }: { messageKey: string }) {
  const { t } = useTranslation("verify-email");
  return (
    <LoginSignupContainer>
      {messageKey === "token-verification-success" ? (
        <ContinueLoginMessage
          message={t("token-verify-success-label")}
          heading={t("congrats-label")}
          imagePath={"/congratulations.svg"}
        />
      ) : messageKey === "already-verified" ? (
        <ContinueLoginMessage
          message={t("token-verify-success-label")}
          imagePath={"/congratulations.svg"}
        />
      ) : (
        <ContinueLoginMessage
          message={t(
            "Something went wrong, please try again or contact your administrator."
          )}
          imagePath={"/invalid-token-icon.svg"}
        />
      )}
    </LoginSignupContainer>
  );
}

export default VerifyEmailScreen;
