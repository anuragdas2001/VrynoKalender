import FormTextAreaBox from "../../../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldMultiLine = ({
  field,
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
  <FormTextAreaBox
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
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    externalExpressionToCalculateValue={field.expression}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
