import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const recordImageValidations = [
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => lastVal,
];
