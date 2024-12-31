import { ICustomField } from "../../../../models/ICustomField";
export function getSearchByList(
  fieldsList: ICustomField[],
  searchByListModuleLevel: string[]
) {
  if (fieldsList.length > 0 && searchByListModuleLevel.length > 0) {
    let updatedSearchBy = [];
    for (let index = 0; index < searchByListModuleLevel.length; index++) {
      const field = fieldsList?.filter(
        (field) => field.name === searchByListModuleLevel[index]
      );
      if (field.length > 0 && !field[0].systemDefined) {
        updatedSearchBy.push(field[0].uniqueName);
      } else if (
        field.length > 0 &&
        field[0].uniqueName.split(".").length >= 3
      ) {
        updatedSearchBy.push(field[0].uniqueName.split(".")[2]);
      }
    }
    return updatedSearchBy.filter((item) => item !== "");
  } else return searchByListModuleLevel;
}
