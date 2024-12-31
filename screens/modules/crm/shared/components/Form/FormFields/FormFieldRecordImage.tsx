import FormImagePicker from "../../../../../../../components/TailwindControls/Form/ImagePicker/FormImagePicker";
import { get } from "lodash";
import generateIdHashForSampleImage from "../../../utils/generateHash";
import React from "react";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const FormFieldRecordImage = ({
  field,
  isSample,
  modelName,
  id,
  fieldName,
  showLabel = true,
  labelValue = "",
  required = false,
  formDetails,
  currentFormLayer,
  rejectRequired = false,
  fieldCustomization = false,
}: FormFieldPerDataTypeProps) => (
  <FormImagePicker
    rejectRequired={rejectRequired}
    required={required ? true : field.mandatory}
    name={fieldName ? fieldName : field.name}
    label={showLabel ? (labelValue ? labelValue : field.label["en"]) : ""}
    isSample={isSample}
    currentFormLayer={currentFormLayer}
    modelName={get(formDetails, "modelName", modelName)}
    sampleImageUrl={`/sample/${get(
      formDetails,
      "modelName",
      modelName
    )}/${generateIdHashForSampleImage(id)}.jpg`}
    externalExpressionToCalculateValue={field.expression}
    disabled={fieldCustomization}
  />
);
