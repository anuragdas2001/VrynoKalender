import { snakeCase } from "change-case";

export const quoteMappingExcludedFieldNames: Set<string> = new Set([
  "record_status",
  "created_by",
  "created_at",
  "updated_by",
  "updated_at",
  "record_image",
  "owner_id",
  "layout_id",
  "invoice_id",
  "sales_order_id",
  "quote_id",
]);

import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { IConversionDropdownListType } from "./conversionTypes";

export const mandatoryFieldsExtractor = (
  fieldsArray: ICustomField[],
  mappingExcludedFieldNames: Set<string>
) => {
  return fieldsArray.filter(
    (field: { readOnly: boolean; mandatory: boolean; name: string }) =>
      field.mandatory &&
      field.readOnly === false &&
      !mappingExcludedFieldNames.has(snakeCase(field.name))
  );
};

export const dropdownListHelper = (
  fieldsList: ICustomField[],
  mappingExcludedFieldNames: Set<string>,
  additionalExcludedFields: Record<string, string>
) => {
  const resultArray: IConversionDropdownListType[] = [];
  for (const field of fieldsList) {
    const key: string = field.uniqueName.split(".").pop() || "";
    if (
      mappingExcludedFieldNames.has(key) ||
      additionalExcludedFields[key] ||
      field.readOnly === true ||
      field.visible === false
    ) {
      continue;
    }
    resultArray.push({
      value: key,
      label: field.label.en,
      dataType: field.dataType,
      uniqueName: field.uniqueName,
      dataTypeMetadata: field.dataTypeMetadata,
    });
  }
  return resultArray;
};

export const conversionDropdownFilterHelper = (
  val: IConversionDropdownListType,
  dataType: SupportedDataTypes,
  item: IConversionDropdownListType
) => {
  if (
    val.dataType === dataType &&
    [
      SupportedDataTypes.recordLookup,
      SupportedDataTypes.multiSelectRecordLookup,
    ].includes(dataType)
  ) {
    return (
      val.dataTypeMetadata.allLookups[0]?.moduleName ===
      item.dataTypeMetadata.allLookups[0]?.moduleName
    );
  }
  return val.dataType === dataType;
};

export const checkMandatoryFields = (
  permissionData: Record<string, string | null>[],
  mandatoryFieldsData: Record<string, ICustomField[]>
) => {
  let uniqueNameArray = [];
  let missingFields = [];

  for (let permission of permissionData) {
    for (const key in permission) {
      if (key !== "id") {
        uniqueNameArray.push(permission[key]);
      }
    }
  }

  for (const moduleKey in mandatoryFieldsData) {
    for (const field of mandatoryFieldsData[moduleKey]) {
      if (!uniqueNameArray.includes(field.uniqueName)) {
        missingFields.push(field);
      }
    }
  }
  if (missingFields.length) {
    const messageFields = missingFields
      .map((val) => `${val.moduleName}:${val.label.en}`)
      .join(", ");
    return `${messageFields}`;
  }
  return "";
};
