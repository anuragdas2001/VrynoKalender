import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldUrl = ({
  field,
  id,
  fieldName,
  showLabel = true,
  allowMargin = true,
  disabled = undefined,
  labelValue = "",
  required = false,
  rejectRequired = false,
  addClear = false,
  fieldCustomization,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => (
  <FormInputBox
    id={id}
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    type={"url"}
    allowMargin={allowMargin}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    externalExpressionToCalculateValue={field.expression}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
