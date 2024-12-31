import { get } from "lodash";
import FormMobileInputBox from "../../../../../../../components/TailwindControls/Form/MobileInputBox/MobileInputBox";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";
import { IUserPreference } from "../../../../../../../models/shared";
import { getTimezone } from "countries-and-timezones";

export const getCountryCodeFromPreference = (
  userPreferences: IUserPreference[]
) => {
  let countryCode = "";
  if (userPreferences?.length > 0) {
    countryCode = get(
      userPreferences[0]?.defaultPreferences?.localInformation,
      "country",
      ""
    );
  }
  return countryCode;
};

export const FormFieldPhoneNumber = ({
  field,
  appName,
  modelName,
  id,
  fieldName,
  showLabel = true,
  allowMargin = true,
  formResetted,
  disabled = undefined,
  labelValue = "",
  required = false,
  formDetails,
  rejectRequired = false,
  addClear = false,
  currentFormLayer,
  fieldCustomization,
  countryCodeInUserPreference,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
  fieldLabel,
}: FormFieldPerDataTypeProps) => {
  const timeZone = getTimezone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  return (
    <FormMobileInputBox
      appName={appName}
      modelName={get(formDetails, "modelName", modelName)}
      id={id}
      rejectRequired={rejectRequired}
      required={required ? true : field.mandatory}
      addClear={addClear}
      name={fieldName ? fieldName : field.name}
      label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
      allowMargin={allowMargin}
      disabled={
        fieldCustomization
          ? true
          : disabled !== undefined
          ? disabled
          : field.readOnly
      }
      externalExpressionToCalculateValue={field.expression}
      formResetted={formResetted}
      currentFormLayer={currentFormLayer}
      checkDuplicacy={field.checkDuplicacy}
      systemDefined={field.systemDefined}
      countryCodeInUserPreference={countryCodeInUserPreference}
      countryCodeFromTimezone={
        timeZone && timeZone?.countries?.length > 0
          ? timeZone?.countries[0]
          : ""
      }
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
      labelUsedForError={fieldLabel}
    />
  );
};
