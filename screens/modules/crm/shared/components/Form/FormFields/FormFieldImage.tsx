import FormImagePicker from "../../../../../../../components/TailwindControls/Form/ImagePicker/FormImagePicker";
import { get } from "lodash";
import React from "react";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldImage = ({
  field,
  modelName,
  fieldName,
  showLabel = true,
  disabled = undefined,
  labelValue = "",
  required = false,
  formDetails,
  currentFormLayer,
  rejectRequired = false,
  fieldCustomization,
}: FormFieldPerDataTypeProps) => (
  <FormImagePicker
    rejectRequired={rejectRequired}
    currentFormLayer={currentFormLayer}
    required={required ? true : field.mandatory}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    modelName={get(formDetails, "modelName", modelName)}
    disabled={
      fieldCustomization
        ? true
        : disabled !== undefined
        ? disabled
        : field.readOnly
    }
    externalExpressionToCalculateValue={field.expression}
  />
);
