import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import React from "react";
import { VrynoLoginRegisterFormIcons } from "../../../../components/TailwindControls/VrynoIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import Mail from "remixicon-react/MailLineIcon";
import { SupportedLabelLocations } from "../../../../components/TailwindControls/SupportedLabelLocations";

export const ForgotPasswordFormFields = ({
  handleSubmit,
  forgotPasswordLoading,
  buttonLabel,
  emailPlaceholder,
}: {
  handleSubmit: () => void;
  forgotPasswordLoading: boolean;
  buttonLabel: string | null;
  emailPlaceholder: string | null;
}) => {
  const { t } = useTranslation(["forgot-password", "common"]);

  return (
    <>
      <FormInputBox
        name="email"
        label={t("common:email-label")}
        type="email"
        required={true}
        placeholder={emailPlaceholder || t("email-placeholder")}
        disabled={forgotPasswordLoading}
        leftIcon={VrynoLoginRegisterFormIcons(Mail)}
        labelLocation={SupportedLabelLocations.OnTop}
      />
      <Button
        id="forgotPasswordButton"
        onClick={handleSubmit}
        type={"submit"}
        kind="primary"
        autoFocus={true}
        loading={forgotPasswordLoading}
        userEventName="forgot-password:submit-click"
      >
        {buttonLabel ? buttonLabel : t("forgot-password-button-label")}
      </Button>
    </>
  );
};
