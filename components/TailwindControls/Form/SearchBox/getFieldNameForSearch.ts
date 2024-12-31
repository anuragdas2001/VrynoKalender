import { ICustomField } from "../../../../models/ICustomField";

export function getFieldNameForSearch(
  fieldsList: ICustomField[],
  searchBy: string[]
) {
  let updatedSearchBy = [];
  if (fieldsList.length > 0 && searchBy.length > 0) {
    for (let index = 0; index < searchBy.length; index++) {
      const field = fieldsList?.filter((field) => {
        if (field.systemDefined) {
          if (
            field?.uniqueName?.split(".")?.length >= 3 &&
            field?.uniqueName?.split(".")[2] === searchBy[index]
          ) {
            return field;
          }
        } else if (field?.uniqueName === searchBy[index]) {
          return field;
        }
      });
      if (field?.length > 0) {
        updatedSearchBy.push(field[0]?.name);
      }
    }
  }
  return updatedSearchBy;
}
