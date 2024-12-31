import { stringLookupMapper } from "../../../utils/staticLookupMapper";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldStringLookup = ({
  field,
  setFieldValue,
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
  <FormDropdown
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    options={stringLookupMapper(field.dataTypeMetadata)}
    onChange={(selectedOption) => {
      setFieldValue(
        fieldName ? fieldName : field.name,
        selectedOption.currentTarget.value
      );
    }}
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
