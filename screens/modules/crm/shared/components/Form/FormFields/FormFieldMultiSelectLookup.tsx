import {
  lookupMapper,
  stringLookupMapper,
} from "../../../utils/staticLookupMapper";
import FormMultipleValuesDropdown from "../../../../../../../components/TailwindControls/Form/MultipleValuesDropdown/FormMultipleValuesDropdown";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldMultiSelectLookup = ({
  field,
  editMode,
  fieldName,
  showLabel = true,
  allowMargin = true,
  formResetted,
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
  <FormMultipleValuesDropdown
    rejectRequired={rejectRequired}
    name={fieldName ? fieldName : field.name}
    addClear={addClear}
    required={required ? true : field.mandatory}
    label={labelValue ? labelValue : field.label["en"]}
    showLabel={showLabel}
    options={
      field.dataTypeMetadata?.type === "string"
        ? stringLookupMapper(field.dataTypeMetadata)?.map((option) => {
            return { ...option, visible: true };
          })
        : lookupMapper(field.dataTypeMetadata?.lookupOptions)
    }
    allowColourInValue={field.dataTypeMetadata?.allowColour}
    editMode={editMode}
    allowMargin={allowMargin}
    formResetted={formResetted}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
