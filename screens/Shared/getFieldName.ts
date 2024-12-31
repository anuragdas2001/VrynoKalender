import _ from "lodash";
import { ICustomField } from "./../../models/ICustomField";

export const getFieldName = (fieldsList: ICustomField[], fieldName: string) => {
  if (fieldsList.length > 0) {
    const findIndex = fieldsList?.findIndex(
      (field) => field.name === fieldName
    );
    if (findIndex !== -1)
      return _.get(fieldsList[findIndex].label, "en", fieldName);
    return fieldName;
  } else {
    return fieldName;
  }
};
