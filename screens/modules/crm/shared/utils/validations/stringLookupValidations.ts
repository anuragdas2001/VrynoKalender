import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const stringLookupValidations = [
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => lastVal,
];
