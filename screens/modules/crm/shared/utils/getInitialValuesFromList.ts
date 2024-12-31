import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";

export function getInitialValueForField(field: ICustomField) {
  if (
    field.visible === true &&
    field.addInForm &&
    (field.dataType === SupportedDataTypes.expression ? true : !field.readOnly)
  ) {
    let value;
    field.dataType === SupportedDataTypes.singleline
      ? (value = "")
      : field.dataType === SupportedDataTypes.number
      ? (value = null)
      : field.dataType === SupportedDataTypes.phoneNumber
      ? (value = "")
      : field.dataType === SupportedDataTypes.boolean
      ? (value = false)
      : (value = null);
    return value;
  }
}

export default function getInitialValuesFromList(
  fieldList: Array<ICustomField>
) {
  let fieldInitialValues: Record<string, any> = {};
  if (fieldList.length > 0) {
    for (let i = 0; i < fieldList.length; i++) {
      fieldInitialValues[fieldList[i].name] = getInitialValueForField(
        fieldList[i]
      );
    }
  }
  return fieldInitialValues;
}

export function getDefaultFieldValuePerDatatype(field: ICustomField) {
  if (
    field.dataType === SupportedDataTypes.singleline ||
    field.dataType === SupportedDataTypes.phoneNumber
  )
    return "";
  if (field.dataType === SupportedDataTypes.boolean) return false;
  return null;
}
