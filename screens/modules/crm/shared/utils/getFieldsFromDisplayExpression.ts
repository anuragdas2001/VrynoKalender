import { ICustomField } from "../../../../../models/ICustomField";

export const getFieldsFromDisplayExpression = (displayExpression: string) => {
  let searchByFields: string[] = [];
  let displayFields = displayExpression?.split(" ");
  for (let index = 0; index < displayFields?.length; index++) {
    displayFields[index].includes("${") &&
      searchByFields.push(
        displayFields[index].slice(2, displayFields[index].length - 1)
      );
  }
  return searchByFields?.length > 0 ? searchByFields : ["name"];
};

export const evaluateDisplayExpression = (
  fields: string[],
  fieldsList: ICustomField[] | null,
  useModuleExpression?: boolean,
  useUniqueName?: boolean
) => {
  if (!fieldsList || fieldsList?.length <= 0)
    return Array.from(
      new Set(useModuleExpression ? [...fields] : [...fields, "name"])
    );
  const evaluatedFields = new Set<string>();
  for (const expField of fields) {
    for (const field of fieldsList) {
      if (field.visible) {
        if (useUniqueName) {
          if (
            field.systemDefined &&
            field.uniqueName.split(".").length >= 3 &&
            expField === field.uniqueName.split(".")[2]
          ) {
            evaluatedFields.add(field.uniqueName.split(".")[2]);
            break;
          } else if (!field.systemDefined && field.uniqueName === expField) {
            evaluatedFields.add(field.uniqueName);
            break;
          }
        } else if (expField === field.name) {
          evaluatedFields.add(
            field.systemDefined ? field.name : `fields.${field.name}`
          );
          break;
        }
      }
    }
  }
  if (useModuleExpression && evaluatedFields.size) {
    return Array.from(evaluatedFields);
  }
  evaluatedFields.add("name");
  return Array.from(evaluatedFields);
};
