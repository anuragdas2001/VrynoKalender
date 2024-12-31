import FormDatePicker from "../../../../../../../components/TailwindControls/Form/DatePicker/FormDatePicker";
import { useContext } from "react";
import { UserStoreContext } from "../../../../../../../stores/UserStore";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldDate = ({
  field,
  editMode,
  fieldName,
  showLabel = true,
  allowMargin = true,
  disabled = undefined,
  labelValue = "",
  required = false,
  rejectRequired = false,
  addClear = false,
  overflow,
  fieldCustomization,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  return (
    <FormDatePicker
      rejectRequired={rejectRequired}
      required={required ? true : field.mandatory}
      addClear={addClear}
      name={fieldName ? fieldName : field.name}
      label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
      editMode={editMode}
      placeholder="date"
      type="date"
      allowMargin={allowMargin}
      overflow={overflow}
      disabled={
        fieldCustomization
          ? true
          : disabled !== undefined
          ? disabled
          : field.readOnly
      }
      externalExpressionToCalculateValue={field.expression}
      user={user ?? undefined}
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
    />
  );
};
