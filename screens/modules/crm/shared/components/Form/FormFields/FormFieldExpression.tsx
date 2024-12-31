import { get } from "lodash";
import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldExpression = ({
  field,
  fieldList,
  appName,
  modelName,
  id,
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
  currentFormLayer,
  additionalFieldName,
  replaceFromExpression,
  fieldCustomization,
  formulaExpressionToShow,
  additionalValueToRemove,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => (
  <FormInputBox
    appName={appName}
    modelName={get(formDetails, "modelName", modelName)}
    id={id}
    field={field}
    fieldList={fieldList}
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    name={fieldName ? fieldName : field.name}
    additionalFieldName={additionalFieldName}
    replaceFromExpression={
      replaceFromExpression
        ? replaceFromExpression
        : `${get(formDetails, "modelName", modelName)}.`
    }
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    type={"number"}
    currentFormLayer={currentFormLayer}
    allowMargin={allowMargin}
    disabled={true}
    precision={get(field?.dataTypeMetadata?.format, "precision", 0)}
    externalExpressionToCalculateValue={field.expression}
    formResetted={formResetted}
    checkDuplicacy={field.checkDuplicacy}
    systemDefined={field.systemDefined}
    showFieldExpression={true}
    formulaExpressionToShow={
      formulaExpressionToShow ?? field.dataTypeMetadata?.expression
    }
    additionalValueToRemove={additionalValueToRemove}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
