import React from "react";
import FormMobileInputBox from "../../../../../components/TailwindControls/Form/MobileInputBox/MobileInputBox";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useTranslation } from "next-i18next";
import FormDatePicker from "../../../../../components/TailwindControls/Form/DatePicker/FormDatePicker";
import { User } from "../../../../../models/Accounts";
import { getCountryCodeFromPreference } from "../../../crm/shared/components/Form/FormFields/FormFieldPhoneNumber";
import { getTimezone } from "countries-and-timezones";
import { IUserPreference } from "../../../../../models/shared";
import FormRichTextEditor from "../../../../../components/TailwindControls/Form/RichTextEditor/FormRichTextEditor";
import { FormikValues, useFormikContext } from "formik";

export const PersonalDetails = ({
  savingUserInfoProcess,
  user,
  userPreferences,
}: {
  savingUserInfoProcess: boolean;
  user: User | undefined;
  userPreferences: IUserPreference[];
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const timeZone = getTimezone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <>
      <FormInputBox
        name="firstName"
        label={t("first-name-label")}
        type="text"
        required={false}
        disabled={savingUserInfoProcess}
      />
      <FormInputBox
        name="lastName"
        label={t("last-name-label")}
        type="text"
        required={true}
        disabled={savingUserInfoProcess}
      />
      <FormInputBox
        name="email"
        label={t("common:email-label")}
        type="text"
        required={false}
        disabled={true}
      />
      <FormMobileInputBox
        name="mobileNumber"
        label={t("mobile-label")}
        disabled={savingUserInfoProcess}
        countryCodeInUserPreference={getCountryCodeFromPreference(
          userPreferences
        )}
        countryCodeFromTimezone={
          timeZone && timeZone?.countries?.length > 0
            ? timeZone?.countries[0]
            : ""
        }
      />
      <FormMobileInputBox
        name="phoneNumber"
        label={t("Phone Number")}
        disabled={savingUserInfoProcess}
        countryCodeInUserPreference={getCountryCodeFromPreference(
          userPreferences
        )}
        countryCodeFromTimezone={
          timeZone && timeZone?.countries?.length > 0
            ? timeZone?.countries[0]
            : ""
        }
      />
      <FormDatePicker
        name="dateOfBirth"
        label={t("date-of-birth")}
        required={false}
        excludeTimes={true}
        disabled={savingUserInfoProcess}
        user={user ?? undefined}
      />
      <FormInputBox
        name="street"
        label={t("street-label")}
        type="text"
        required={false}
        disabled={savingUserInfoProcess}
      />
      <FormInputBox
        name="city"
        label={t("city-label")}
        type="text"
        required={false}
        disabled={savingUserInfoProcess}
      />
      <FormInputBox
        name="state"
        label={t("State")}
        type="text"
        required={false}
        disabled={savingUserInfoProcess}
      />
      <FormInputBox
        name="zipcode"
        label={t("Zip Code")}
        type="text"
        required={false}
        disabled={savingUserInfoProcess}
      />
      <FormRichTextEditor
        data={values["signature"]}
        handleNoteChange={(value) => {
          setFieldValue("signature", value);
        }}
        name="signature"
        showImage={true}
        allowMargin={false}
        label="Signature"
      />
    </>
  );
};
