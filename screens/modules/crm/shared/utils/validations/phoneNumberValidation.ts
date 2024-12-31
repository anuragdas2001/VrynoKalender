import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const phoneNumberValidations = [
  // min character length validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    const minVal = 7;
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
    const maxVal = 22;
    return lastVal.max(
      maxVal,
      `${fieldLabel} cannot be more than ${maxVal} characters`
    );
  },
];
