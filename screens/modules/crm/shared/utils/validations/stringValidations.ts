import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const stringValidations = [
  // min character length validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    if (!customField.minVal && typeof customField.minVal !== "number") {
      return lastVal;
    }
    const minVal = parseInt(customField.minVal);
    return lastVal.min(
      minVal,
      `${fieldLabel} requires atleast ${minVal} characters`
    );
  },
  // max character length validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    if (!customField.maxVal && typeof customField.maxVal !== "number") {
      return lastVal;
    }
    const maxVal = parseInt(customField.maxVal);
    return lastVal.max(
      maxVal,
      `${fieldLabel} cannot be more than ${maxVal} characters`
    );
  },

  //regular expression validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    if (!customField.regExp) {
      return lastVal;
    }
    return lastVal.matches(
      new RegExp(customField.regExp),
      `The input data doesn’t meet the validation criteria`
    );
  },
];
