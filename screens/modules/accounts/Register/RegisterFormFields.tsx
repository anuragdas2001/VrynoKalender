import FormInputBox from "../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import React, { useRef } from "react";
import { VrynoLoginRegisterFormIcons } from "../../../../components/TailwindControls/VrynoIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import FormMobileInputBox from "../../../../components/TailwindControls/Form/MobileInputBox/MobileInputBox";
import UserIcon from "remixicon-react/UserLineIcon";
import Mail from "remixicon-react/MailLineIcon";
import Eye from "remixicon-react/EyeLineIcon";
import EyeOff from "remixicon-react/EyeOffLineIcon";
import Lock from "remixicon-react/LockLineIcon";
import Building from "remixicon-react/BuildingLineIcon";
import { SupportedLabelLocations } from "../../../../components/TailwindControls/SupportedLabelLocations";
import { ICountryDetails } from "../../../../api-utils/getCountryDetails";
import CheckBoxCircleLineIcon from "remixicon-react/CheckboxCircleLineIcon";
import CheckBoxBlankIcon from "remixicon-react/CheckboxBlankCircleLineIcon";
import { useFormikContext } from "formik";
import { getTimezone } from "countries-and-timezones";
import FormCheckBox from "../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import Link from "next/link";
import FormDropdown from "../../../../components/TailwindControls/Form/Dropdown/FormDropdown";

export const RegisterFormFields = ({
  handleSubmit,
  registerLoading,
  countryDetails,
}: {
  registerLoading: boolean;
  handleSubmit: () => void;
  countryDetails: ICountryDetails;
}) => {
  const { t } = useTranslation(["register", "common"]);
  const [helpTextVisible, setHelpTextVisible] = React.useState<boolean>(false);
  const passwordWrapperRef = useRef(null);
  const { values } = useFormikContext<Record<string, string>>();
  const timeZone = getTimezone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const initialState = {
    icon: <Eye size={20} className="cursor-pointer text-vryno-icon-gray" />,
    type: "password",
  };
  const passwordFieldName = "password";
  const confirmPasswordFieldName = "confirmPassword";

  const [passwordViewState, updatePasswordViewState] = React.useState({
    password: { ...initialState },
    confirmPassword: { ...initialState },
  });

  const showPasswordClick = (name: "password" | "confirmPassword") => {
    const { icon, type } = passwordViewState[name];
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
        name="firstName"
        label={t("first-name-label")}
        type="text"
        required={true}
        disabled={registerLoading}
        leftIcon={VrynoLoginRegisterFormIcons(UserIcon)}
        labelLocation={SupportedLabelLocations.OnTop}
        autoFocus={true}
      />
      <FormInputBox
        name="lastName"
        label={t("last-name-label")}
        type="text"
        required={true}
        disabled={registerLoading}
        leftIcon={VrynoLoginRegisterFormIcons(UserIcon)}
        labelLocation={SupportedLabelLocations.OnTop}
      />

      <FormInputBox
        name="email"
        label={t("common:email-label")}
        type="email"
        required={true}
        disabled={registerLoading}
        leftIcon={VrynoLoginRegisterFormIcons(Mail)}
        labelLocation={SupportedLabelLocations.OnTop}
      />

      <FormMobileInputBox
        name="mobile"
        label={t("common:phone-number-label")}
        required={true}
        disabled={registerLoading}
        countryCodeInUserPreference=""
        countryCodeFromTimezone={
          timeZone && timeZone?.countries?.length > 0
            ? timeZone?.countries[0]
            : ""
        }
        labelLocation={SupportedLabelLocations.OnTop}
        country={""}
        // useCountryCode={true}
      />

      <FormInputBox
        name={passwordFieldName}
        label={t("common:password-label")}
        required={true}
        leftIcon={VrynoLoginRegisterFormIcons(Lock)}
        disabled={registerLoading}
        labelLocation={SupportedLabelLocations.OnTop}
        type={passwordViewState[passwordFieldName].type}
        rightIcon={passwordViewState[passwordFieldName].icon}
        rightIconClick={() => showPasswordClick(passwordFieldName)}
        handleFocus={() => setHelpTextVisible(true)}
        onBlur={() => setHelpTextVisible(false)}
        helpText={
          <div
            className={`relative inline-block ${
              helpTextVisible ? "" : "hidden"
            }`}
          >
            <div
              className={`origin-top-right absolute flex flex-col text-xs left-0 w-[275px] p-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              id="navbarMenu"
              ref={passwordWrapperRef}
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <span
                className={`flex items-center gap-x-2 ${
                  values[passwordFieldName]?.length >= 12
                    ? "text-green-800"
                    : "text-gray-600"
                }`}
              >
                {values[passwordFieldName]?.length >= 12 ? (
                  <CheckBoxCircleLineIcon size={12} color={"green"} />
                ) : (
                  <CheckBoxBlankIcon size={12} />
                )}
                Minimum 12 characters required.
              </span>
              <span
                className={`flex items-center gap-x-2 ${
                  values[passwordFieldName]?.match(/^(?=.*[A-Z])/)
                    ? "text-green-800"
                    : "text-gray-600"
                }`}
              >
                {values[passwordFieldName]?.match(/^(?=.*[A-Z])/) ? (
                  <CheckBoxCircleLineIcon size={12} color={"green"} />
                ) : (
                  <CheckBoxBlankIcon size={12} />
                )}
                One upper case letter is required.
              </span>
              <span
                className={`flex items-center gap-x-2 ${
                  values[passwordFieldName]?.match(/^(?=.*[a-z])/)
                    ? "text-green-800"
                    : "text-gray-600"
                }`}
              >
                {values[passwordFieldName]?.match(/^(?=.*[a-z])/) ? (
                  <CheckBoxCircleLineIcon size={12} color={"green"} />
                ) : (
                  <CheckBoxBlankIcon size={12} />
                )}
                One lower case letter is required.
              </span>
              <span
                className={`flex items-center gap-x-2 ${
                  values[passwordFieldName]?.match(/^(?=.*[0-9])/)
                    ? "text-green-800"
                    : "text-gray-600"
                }`}
              >
                {values[passwordFieldName]?.match(/^(?=.*[0-9])/) ? (
                  <CheckBoxCircleLineIcon size={12} color={"green"} />
                ) : (
                  <CheckBoxBlankIcon size={12} />
                )}
                One number is required.
              </span>
              <span
                className={`flex items-center gap-x-2 ${
                  values[passwordFieldName]?.match(
                    /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
                  )
                    ? "text-green-800"
                    : "text-gray-600"
                }`}
              >
                {values[passwordFieldName]?.match(
                  /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/
                ) ? (
                  <CheckBoxCircleLineIcon size={12} color={"green"} />
                ) : (
                  <CheckBoxBlankIcon size={12} />
                )}
                One special character is required.
              </span>
            </div>
          </div>
        }
      />

      <FormInputBox
        name="company"
        label={t("company-label")}
        type="text"
        leftIcon={VrynoLoginRegisterFormIcons(Building)}
        disabled={registerLoading}
        labelLocation={SupportedLabelLocations.OnTop}
      />
      <div className={`sm:col-span-2`}>
        <FormDropdown
          name="source"
          label={t("Where did you hear about us?")}
          options={[
            {
              label: "Google/Online Research",
              value: "research",
            },
            { label: "Existing Customer", value: "customer" },
            { label: "Partner", value: "partner" },
            { label: "Other", value: "other" },
          ]}
        />
        <FormCheckBox
          name="privacypolicy"
          customLabel={
            <span className="text-sm">
              I agree to the{" "}
              <Link href="https://vryno.com/terms-of-service/" legacyBehavior>
                <a target="_blank" className="text-vryno-theme-light-blue">
                  terms and services
                </a>
              </Link>{" "}
              and{" "}
              <Link href="https://vryno.com/privacypolicy/" legacyBehavior>
                <a target="_blank" className="text-vryno-theme-light-blue">
                  privacy policy
                </a>
              </Link>
            </span>
          }
        />
      </div>
      <div className={`sm:col-span-2 ${helpTextVisible ? "" : "mt-4"}`}>
        <Button
          id="registerButton"
          onClick={handleSubmit}
          type={"submit"}
          kind="primary"
          disabled={registerLoading || !values["privacypolicy"]}
          loading={registerLoading}
          userEventName="register-form:submit-click"
        >
          {t("register-button-label")}
        </Button>
      </div>
    </>
  );
};
