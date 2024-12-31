import { UserStoreContext } from "../../../../../../../stores/UserStore";
import { useContext } from "react";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";
import FormJSONDateTimePicker from "../../../../../../../components/TailwindControls/Form/JSONDateTimePicker/FormJSONDateTimePicker";

export const FormFieldJsonDateTime = ({
  field,
  modelName,
  editMode,
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
  fieldCustomization,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  return (
    <FormJSONDateTimePicker
      rejectRequired={rejectRequired}
      required={required ? true : field.mandatory}
      addClear={addClear}
      name={fieldName ? fieldName : field.name}
      label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
      editMode={editMode}
      type="datetime"
      allowMargin={allowMargin}
      disabled={
        fieldCustomization
          ? true
          : disabled !== undefined
          ? disabled
          : field.readOnly
      }
      formResetted={formResetted}
      externalExpressionToCalculateValue={field.expression}
      modelName={modelName}
      formDetails={formDetails}
      user={user ?? undefined}
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      dropdownFields={field.parentFieldsList}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
    />
  );
};
