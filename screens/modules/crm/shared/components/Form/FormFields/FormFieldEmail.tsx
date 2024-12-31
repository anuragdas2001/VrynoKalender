import FormInputBox from "../../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { get } from "lodash";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldEmail = ({
  field,
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
  fieldCustomization,
  paddingInPixelForInputBox,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => (
  <FormInputBox
    appName={appName}
    modelName={get(formDetails, "modelName", modelName)}
    id={id}
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    type={"email"}
    currentFormLayer={currentFormLayer}
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
    checkDuplicacy={field.checkDuplicacy}
    systemDefined={field.systemDefined}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
