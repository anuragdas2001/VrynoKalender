import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import React from "react";
import { VrynoLoginRegisterFormIcons } from "../../../../components/TailwindControls/VrynoIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import Eye from "remixicon-react/EyeLineIcon";
import EyeOff from "remixicon-react/EyeOffLineIcon";
import Lock from "remixicon-react/LockLineIcon";
import { useRouter } from "next/router";
import { SupportedLabelLocations } from "../../../../components/TailwindControls/SupportedLabelLocations";

export const ResetPasswordFormFields = ({
  handleSubmit,
  resetPasswordLoading,
}: {
  handleSubmit: () => void;
  resetPasswordLoading: boolean;
}) => {
  const router = useRouter();
  const { t } = useTranslation([
    router.asPath.includes("reset-password?")
      ? "reset-password"
      : "accept-invite",
    "common",
  ]);

  const initialState = {
    icon: <Eye size={20} className="cursor-pointer text-vryno-icon-gray" />,
    type: "password",
  };
  const passwordFieldName = "password";

  const [passwordViewState, updatePasswordViewState] = React.useState({
    password: { ...initialState },
    confirmPassword: { ...initialState },
  });

  const showPasswordClick = (name: "password" | "confirmPassword") => {
    const { type } = passwordViewState[name];
    const newIcon =
      type === "password" ? (
        <EyeOff size={20} className="cursor-pointer text-vryno-icon-gray" />
      ) : (
        <Eye size={20} className="cursor-pointer text-vryno-icon-gray" />
      );
    const newType = type === "password" ? "text" : "password";
    const newState = {
      ...passwordViewState,
    };
    newState[name] = { icon: newIcon, type: newType };
    updatePasswordViewState(newState);
  };

  return (
    <>
      <FormInputBox
        name={passwordFieldName}
        label={t("common:password-label")}
        required={true}
        leftIcon={VrynoLoginRegisterFormIcons(Lock)}
        disabled={resetPasswordLoading}
        labelLocation={SupportedLabelLocations.OnTop}
        type={passwordViewState[passwordFieldName].type}
        rightIcon={passwordViewState[passwordFieldName].icon}
        rightIconClick={() => showPasswordClick(passwordFieldName)}
      />
      <Button
        id="resetPasswordButton"
        onClick={handleSubmit}
        type={"submit"}
        kind="primary"
        loading={resetPasswordLoading}
        disabled={resetPasswordLoading}
        userEventName="change-password:submit-click"
      >
        {t("reset-password-button-label")}
      </Button>
    </>
  );
};
