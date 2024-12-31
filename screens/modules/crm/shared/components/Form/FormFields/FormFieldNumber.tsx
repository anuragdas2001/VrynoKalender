import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldNumber = ({
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
  useExpression = true,
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
    type={"number"}
    allowMargin={allowMargin}
    allowNegative={
      typeof field?.validations?.minVal !== "number" ||
      (typeof field?.validations?.minVal === "number" &&
        Number(field?.validations?.minVal) < 0)
        ? true
        : false
    }
    precision={field?.dataTypeMetadata?.precision ?? 0}
    systemDefined={field?.systemDefined}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    externalExpressionToCalculateValue={field.expression}
    useExpression={useExpression}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
