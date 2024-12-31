import { FormFieldPerJsonType } from "../FormFieldPerJsonType";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldJson = ({
  field,
  editMode,
  fieldName,
  showLabel = true,
  allowMargin = true,
  labelValue = "",
  fieldCustomization,
}: FormFieldPerDataTypeProps) => (
  <FormFieldPerJsonType
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    jsonType={field.jsonType}
    allowMargin={allowMargin}
    editMode={editMode}
    externalExpressionToCalculateValue={field.expression}
    fieldCustomization={fieldCustomization}
  />
);
