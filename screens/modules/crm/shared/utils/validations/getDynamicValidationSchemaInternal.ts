import * as Yup from "yup";
import { Schema } from "yup";
import { fieldTypeValidationMap } from "./fieldTypeValidationMap";
import { ICustomField } from "../../../../../../models/ICustomField";

type SupportedValidationType = keyof typeof fieldTypeValidationMap;

const supportsValidation = (x: string): x is SupportedValidationType =>
  fieldTypeValidationMap.hasOwnProperty(x);

export function getDynamicValidationSchemaInternal(
  fieldList: Array<ICustomField>,
  modelName?: string
) {
  const fieldValidationReducer = (
    validationShape: { [key: string]: Schema },
    field: ICustomField
  ) => {
    const validationTypeKey = field.dataType + "Type";
    if (!supportsValidation(validationTypeKey)) {
      return validationShape;
    }
    const langCode = "en";
    const fieldLabel = field.label[langCode] || field.name;
    const fieldValidation = fieldTypeValidationMap[validationTypeKey];
    validationShape[field.name] = fieldValidation(
      field,
      fieldLabel,
      fieldList,
      modelName
    );
    return validationShape;
  };
  return Yup.object().shape(fieldList.reduce(fieldValidationReducer, {}));
}
