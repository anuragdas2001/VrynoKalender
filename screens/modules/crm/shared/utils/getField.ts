import { ICustomField } from "../../../../../models/ICustomField";

export const getField = (fieldsList: ICustomField[], value: string) => {
  return fieldsList?.filter((field) => {
    return field.name === value;
  })[0];
};
