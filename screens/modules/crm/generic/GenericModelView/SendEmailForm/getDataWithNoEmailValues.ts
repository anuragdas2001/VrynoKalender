import { ICustomField } from "../../../../../../models/ICustomField";

export function getDataWithNoEmailValues(
  fieldsList: ICustomField[],
  modelDataForSelectedItems: any[],
  searchedData?: boolean
) {
  const fieldsWithEmailDatatype = fieldsList?.filter(
    (field) => field.dataType === "email"
  );
  let dataWithEmailValue: any[] = [];
  modelDataForSelectedItems?.forEach((modelData) => {
    fieldsWithEmailDatatype?.forEach((field) => {
      if (modelData[field?.name]) {
        if (
          dataWithEmailValue?.findIndex((data) => data.id === modelData.id) ===
          -1
        )
          dataWithEmailValue.push(modelData);
      }
    });
  });
  let dataWithNoEmailValue: any[] = [];
  modelDataForSelectedItems?.forEach((modelData) => {
    if (dataWithEmailValue.findIndex((data) => modelData.id === data.id) === -1)
      dataWithNoEmailValue.push(modelData);
  });
  return dataWithNoEmailValue;
}
