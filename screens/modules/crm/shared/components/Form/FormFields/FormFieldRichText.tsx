import FormRichTextEditor from "../../../../../../../components/TailwindControls/Form/RichTextEditor/FormRichTextEditor";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldRichText = ({
  field,
  setFieldValue,
  editMode,
  values,
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
  enableRichTextReinitialize,
  dataTestId,
}: FormFieldPerDataTypeProps) => (
  <FormRichTextEditor
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    data={values[fieldName ? fieldName : field.name]}
    handleNoteChange={(value) =>
      setFieldValue(fieldName ? fieldName : field.name, value)
    }
    name={fieldName ? fieldName : field.name}
    showImage={false}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    externalExpressionToCalculateValue={field.expression}
    allowMargin={allowMargin}
    formResetted={formResetted}
    editMode={editMode}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    enableRichTextReinitialize={enableRichTextReinitialize}
    dataTestId={dataTestId}
  />
);
