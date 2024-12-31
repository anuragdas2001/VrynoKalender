import { ICustomField } from "../../../../../../models/ICustomField";

export function convertDataFromUniquenameToName(
  fieldsList: ICustomField[],
  searchedData: any[]
) {
  let convertedData: any[] = [];
  let uniqueNameAndNameFieldListObject: Record<string, string> = { id: "id" };
  fieldsList?.forEach((field) => {
    if (field.systemDefined) {
      uniqueNameAndNameFieldListObject[field.uniqueName?.split(".")[2]] =
        field.name;
    } else {
      uniqueNameAndNameFieldListObject[field.uniqueName] = field.name;
    }
  });
  searchedData.map((item: Record<string, any>) => {
    let convertedItem: Record<string, any> = {};
    for (let key in item) {
      convertedItem[uniqueNameAndNameFieldListObject[key]] = item[key];
    }
    convertedData.push(convertedItem);
  });

  return convertedData;
}
