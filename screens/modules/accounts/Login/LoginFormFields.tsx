import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import React from "react";
import Link from "next/link";
import { VrynoLoginRegisterFormIcons } from "../../../../components/TailwindControls/VrynoIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import Mail from "remixicon-react/MailOpenLineIcon";
import Eye from "remixicon-react/EyeLineIcon";
import EyeOff from "remixicon-react/EyeOffLineIcon";
import Lock from "remixicon-react/LockLineIcon";

export const LoginFormFields = ({
  handleSubmit,
  loginLoading,
}: {
  handleSubmit: () => void;
  loginLoading: boolean;
}) => {
  const { t } = useTranslation(["login", "common"]);
  const initialState = {
    icon: <Eye size={24} className="cursor-pointer text-vryno-icon-gray" />,
    type: "password",
  };
  const passwordFieldName = "password";

  const [passwordViewState, updatePasswordViewState] = React.useState<
    Record<string, typeof initialState>
  >({
    password: { ...initialState },
  });

  const showPasswordClick = (name: string) => {
    const { icon, type } = passwordViewState[name];
    const newIcon =
      type === "password" ? (
        <EyeOff size={24} className="cursor-pointer text-vryno-icon-gray" />
      ) : (
        <Eye size={24} className="cursor-pointer text-vryno-icon-gray" />
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
        name="email"
        label="Email"
        type="email"
        required={true}
        disabled={loginLoading}
        leftIcon={VrynoLoginRegisterFormIcons(Mail)}
        autoFocus={true}
      />

      <FormInputBox
        autoComplete="current-password"
        name="password"
        label="Password"
        required={true}
        leftIcon={VrynoLoginRegisterFormIcons(Lock)}
        disabled={loginLoading}
        type={passwordViewState[passwordFieldName].type}
        rightIcon={passwordViewState[passwordFieldName].icon}
        rightIconClick={() => showPasswordClick(passwordFieldName)}
      />

      <div className="w-full text-right">
        <Link href="/forgot-password" passHref legacyBehavior>
          <a id="forgot-password-link" className="text-sm">
            <span className="text-vryno-theme-blue-secondary">
              {`Forgot Password ?`}
            </span>
          </a>
        </Link>
      </div>
      <div className="mt-6">
        <Button
          id="loginButton"
          onClick={() => {
            handleSubmit();
          }}
          type={"submit"}
          kind="primary"
          loading={loginLoading}
          disabled={loginLoading}
          userEventName="login-form:submit-click"
        >
          {`Login`}
        </Button>
      </div>
    </>
  );
};
