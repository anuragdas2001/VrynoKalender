import moment from "moment-timezone";
import { ICustomField } from "../../../../../models/ICustomField";
import { getCorrectTimezone } from "../../../../../shared/dateTimeTimezoneFormatter";

// The following function return custom fields as fields.name
// export function handleGenericFormSave(
//   fieldList: ICustomField[],
//   values: Record<string, any>
// ) {
//   const systemDefinedValues: Record<string, any> = {};

//   const dataExtractor = (field: ICustomField, values: Record<string, any>) =>
//     field.dataType === "datetime" && values[field.name]
//       ? moment(values[field.name]).toISOString()
//       : field.dataType === "date" && values[field.name]
//       ? moment(values[field.name]).format("YYYY-MM-DD")
//       : field.dataType === "boolean"
//       ? String(values[field.name])
//       : field.dataType === "number"
//       ? values[field.name]
//         ? Number(values[field.name])
//         : values[field.name]
//       : values[field.name];

//   for (let i = 0; i < fieldList.length; i++) {
//     const field = fieldList[i];
//     if (field.visible && !field.readOnly) {
//       if (field.systemDefined) {
//         systemDefinedValues[field.name] = dataExtractor(field, values);
//       } else {
//         systemDefinedValues[`fields.${field.name}`] = dataExtractor(
//           field,
//           values["fields"]
//         );
//       }
//     }
//   }
//   return systemDefinedValues;
// }

export function handleFieldValueMutator(
  field: ICustomField,
  value: Record<string, any>,
  timezone?: string
) {
  return field.dataType === "datetime" && value
    ? timezone
      ? // @ts-ignore
        getCorrectTimezone(value, timezone)
      : moment(value).toISOString()
    : field.dataType === "date" && value
    ? moment(value).format("YYYY-MM-DD")
    : field.dataType === "boolean"
    ? Boolean(value)
    : field.dataType === "number"
    ? value
      ? Number(value)
      : value || null
    : value || null;
}

export function handleGenericFormSave(
  fieldList: ICustomField[],
  values: Record<string, string>,
  timezone?: string
) {
  const systemDefinedValues: Record<string, any> = {};
  for (let i = 0; i < fieldList.length; i++) {
    if (
      fieldList[i].visible &&
      fieldList[i].systemDefined &&
      !fieldList[i].readOnly
    ) {
      systemDefinedValues[fieldList[i].name] =
        fieldList[i].dataType === "datetime" && values[fieldList[i].name]
          ? timezone
            ? getCorrectTimezone(values[fieldList[i].name], timezone)
            : moment(values[fieldList[i].name]).toISOString()
          : fieldList[i].dataType === "date" && values[fieldList[i].name]
          ? moment(values[fieldList[i].name]).format("YYYY-MM-DD")
          : fieldList[i].dataType === "boolean"
          ? Boolean(values[fieldList[i].name])
          : fieldList[i].dataType === "number"
          ? values[fieldList[i].name]
            ? Number(values[fieldList[i].name])
            : values[fieldList[i].name]
          : values[fieldList[i].name];
    }
  }
  return systemDefinedValues;
}

export function handleGenericFormSaveForCustomFields(
  fieldList: ICustomField[],
  values: Record<string, any>,
  timezone?: string
) {
  if (!values) return {};
  const customFieldsValues: Record<string, any> = {};
  for (let i = 0; i < fieldList.length; i++) {
    if (
      !fieldList[i].systemDefined &&
      fieldList[i].visible &&
      !fieldList[i].readOnly
    ) {
      customFieldsValues[fieldList[i].name] =
        fieldList[i].dataType === "boolean"
          ? Boolean(values[fieldList[i].name])
          : !values[fieldList[i].name] && values[fieldList[i].name] !== 0
          ? null
          : fieldList[i].dataType === "datetime" && values[fieldList[i].name]
          ? timezone
            ? getCorrectTimezone(values[fieldList[i].name], timezone)
            : moment(values[fieldList[i].name]).toISOString()
          : fieldList[i].dataType === "date" && values[fieldList[i].name]
          ? moment(values[fieldList[i].name]).format("YYYY-MM-DD")
          : fieldList[i].dataType === "number"
          ? values[fieldList[i].name] || values[fieldList[i].name] === 0
            ? Number(values[fieldList[i].name])
            : values[fieldList[i].name]
          : values[fieldList[i].name];
    }
  }
  return customFieldsValues;
}
