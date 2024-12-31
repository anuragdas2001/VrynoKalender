import { ICustomField } from "../../../../../models/ICustomField";

export const maskRecordData = (
  recordData: Record<string, any>,
  fieldsList: ICustomField[]
) => {
  if (!fieldsList?.length || !Object.keys(recordData)?.length)
    return recordData;
  const resultObj = { ...recordData };
  for (const dataKey in resultObj) {
    const field = fieldsList.find((field) => field.name === dataKey);
    if (field?.isMasked && resultObj[dataKey]) {
      resultObj[dataKey] = resultObj[dataKey].replace(
        /[^ ]/g,
        field.maskedPattern
      );
    }
  }
  return resultObj;
};
