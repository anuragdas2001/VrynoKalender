import moment from "moment";
import { DateSchema } from "yup";
import { ICustomFieldValidation } from "../../../../../../models/ICustomField";

export const datetimeValidations = [
  // min date validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: DateSchema
  ) => {
    if (!customField.minVal) {
      return lastVal;
    }
    const minVal = moment(customField.minVal).toISOString();
    return lastVal.min(
      minVal,
      `${fieldLabel} requires to be at least ${minVal} `
    );
  },
  // max date validation
  (
    customField: ICustomFieldValidation,
    fieldLabel: string,
    lastVal: DateSchema
  ) => {
    if (!customField.maxVal) {
      return lastVal;
    }
    const maxVal = moment(customField.maxVal).toISOString();
    return lastVal.max(maxVal, `${fieldLabel} cant be more than ${maxVal} `);
  },
];
