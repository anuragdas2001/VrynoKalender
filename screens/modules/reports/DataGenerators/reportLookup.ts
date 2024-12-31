import { ICustomField } from "../../../../models/ICustomField";

export const reportLookup = (updatedReportData: any[], field: ICustomField) => {
  const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
  updatedReportData = updatedReportData.flatMap((data) => {
    let result: any = [];
    field.dataTypeMetadata.lookupOptions.map((record: any) => {
      if (data[fieldName] && record?.id === data[fieldName]) {
        result.push({ ...data, [fieldName]: record.label.en });
      }
    });
    if (result.length) {
      return result;
    }
    return data;
  });
  return updatedReportData;
};
