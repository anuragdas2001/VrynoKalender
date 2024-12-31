import { StringSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const urlValidations = [
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: StringSchema
  ) => {
    return lastVal.matches(
      /^((ftp|http|https):\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid URL"
    );
  },
];
