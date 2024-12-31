import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const emailValidations = [
  // min validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    return lastVal
      .email(`${fieldLabel} must be a valid email`)
      .max(254, "Email must be at most 254 characters");
  },
];
