import FormSearchBox from "../../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import { fieldSpecificAppAndModel } from "./recordLookupHelpers";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldUuidArray = ({
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
}: FormFieldPerDataTypeProps) => {
  const appAndModel = fieldSpecificAppAndModel(field);
  return (
    <FormSearchBox
      name={fieldName ? fieldName : field.name}
      rejectRequired={rejectRequired}
      addClear={addClear}
      required={required ? true : field.mandatory}
      label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
      appName={appAndModel[0]}
      modelName={appAndModel[1]}
      searchBy={field.dataTypeMetadata?.allLookups[0]?.fieldName}
      fieldDisplayExpression={field.dataTypeMetadata?.allLookups[0]?.fieldName}
      field={field}
      editMode={editMode}
      multiple={true}
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
      paddingInPixelForInputBox={paddingInPixelForInputBox}
      dataTestId={dataTestId}
      hideValidationMessages={hideValidationMessages}
    />
  );
};
