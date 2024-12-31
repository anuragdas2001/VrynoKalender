import { NumberSchema } from "yup";
import {
  ICustomField,
  ICustomFieldValidation,
} from "../../../../../../models/ICustomField";

export const numberValidations = [
  // min validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: NumberSchema,
    field?: ICustomField
  ) => {
    if (!customField.minVal && typeof customField.minVal !== "number") {
      return lastVal;
    }
    const minVal = parseFloat(customField.minVal);
    return lastVal.min(
      minVal,
      `${fieldLabel} requires to be at least ${minVal} `
    );
  },
  // max validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: NumberSchema,
    field?: ICustomField
  ) => {
    if (!customField.maxVal && field?.systemDefined) {
      return lastVal.max(
        2147483647,
        `${fieldLabel} cant be more than 2147483647`
      );
    }
    if (!customField.maxVal) return lastVal;

    const maxVal =
      parseFloat(customField.maxVal) > 2147483647
        ? 2147483647
        : parseFloat(customField.maxVal);
    return lastVal.max(maxVal, `${fieldLabel} cant be more than ${maxVal} `);
  },
];
