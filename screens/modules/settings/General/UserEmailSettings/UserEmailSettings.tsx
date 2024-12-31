import React from "react";
import { Formik } from "formik";
import { EmailScreen } from "./EmailScreen";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";

const emailSettingOptions = [
  // { value: "compose", label: "Compose" },
  { value: "email", label: "Email" },
  // { value: "emailSharing", label: "Email Sharing" },
];

export const UserEmailSettings = () => {
  const [currentSelectedEmailSetting, setCurrentSelectedEmailSetting] =
    React.useState<"email">("email");

  const EmailSettingComponentMapper = {
    // compose: <ComposeScreen />,
    email: <EmailScreen />,
    // emailSharing: <EmailSharingScreen />,
  };

  return (
    <>
      <GenericBackHeader heading={"Email Settings"}>
        <Formik
          initialValues={{
            currentSelectedEmailSetting: currentSelectedEmailSetting,
          }}
          onSubmit={(values) => console.log(values)}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <FormDropdown
              name="currentSelectedEmailSetting"
              options={emailSettingOptions}
              onChange={(selectedEmailSetting) => {
                setFieldValue(
                  "currentSelectedEmailSetting",
                  selectedEmailSetting.target.value
                );
                setCurrentSelectedEmailSetting(
                  selectedEmailSetting.target.value
                );
              }}
              allowMargin={false}
            />
          )}
        </Formik>
      </GenericBackHeader>
      <div className="m-4">
        {EmailSettingComponentMapper[currentSelectedEmailSetting]}
      </div>
    </>
  );
};
