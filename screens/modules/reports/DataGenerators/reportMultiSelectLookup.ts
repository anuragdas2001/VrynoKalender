import { ICustomField } from "../../../../models/ICustomField";

export const reportMultiSelectLookup = (
  updatedReportData: any[],
  field: ICustomField
) => {
  const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
  updatedReportData = updatedReportData.flatMap((data) => {
    let result: any = [];
    let dataResult: string = "";
    let options: any[] = field.dataTypeMetadata.lookupOptions;
    if (
      data[fieldName] &&
      Array.isArray(data[fieldName]) &&
      data[fieldName].length > 0
    ) {
      data[fieldName].map((value: string | any, index: number) => {
        let findIndex = options.findIndex((option) => option.id === value);
        if (findIndex !== -1) {
          dataResult = dataResult + options[findIndex].label.en + ",";
        }
      });
    }
    if (dataResult?.length) {
      result.push({ ...data, [fieldName]: dataResult });
    }
    if (result.length) {
      return result;
    }
    return data;
  });
  return updatedReportData;
};
