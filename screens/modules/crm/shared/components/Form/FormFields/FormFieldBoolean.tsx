import SwitchToggle from "../../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { MixpanelActions } from "../../../../../../Shared/MixPanel";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldBoolean = ({
  field,
  setFieldValue,
  values,
  fieldName,
  showLabel = true,
  allowMargin = true,
  disabled = undefined,
  labelValue = "",
  required = false,
  rejectRequired = false,
  addClear = false,
  convertToBoolean = false,
  fieldCustomization,
  paddingInPixelForInputBox,
  switchWidth,
  dataTestId,
  hideValidationMessages,
}: FormFieldPerDataTypeProps) => (
  <SwitchToggle
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    addClear={addClear}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    onChange={() => {
      setFieldValue(
        fieldName ? fieldName : field.name,
        !values[fieldName ? fieldName : field.name]
      );
      MixpanelActions.track(
        `switch-boolean-field-${
          fieldName ? fieldName : field.name
        }:toggle-click`,
        {
          type: "switch",
        }
      );
    }}
    allowMargin={allowMargin}
    value={values[fieldName ? fieldName : field.name]}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    externalExpressionToCalculateValue={field.expression}
    convertToBoolean={convertToBoolean}
    paddingInPixelForInputBox={paddingInPixelForInputBox}
    width={switchWidth}
    dataTestId={dataTestId}
    hideValidationMessages={hideValidationMessages}
  />
);
