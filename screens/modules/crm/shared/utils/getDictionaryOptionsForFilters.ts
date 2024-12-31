import { ICustomField } from "../../../../../models/ICustomField";

export const getDictionaryOptionsForFilters = (
  dictionaryOptions: { label: string; value: string }[] = [],
  selectedField: ICustomField[],
  fieldName: string,
  allowModification: boolean = true
) => {
  return dictionaryOptions
    .map((option: { value: string; label: string }) => {
      const findField = selectedField?.findIndex(
        (field) => field.name === fieldName
      );
      if (
        findField !== -1 &&
        (selectedField[findField]?.dataTypeMetadata?.type === "string" ||
          selectedField[findField]?.dataTypeMetadata?.type === "record" ||
          selectedField[findField]?.dataTypeMetadata?.type === "lookup") &&
        allowModification
      ) {
        if (option.value === "all" || option.value === "any")
          return { label: "", value: null };
        else if (option.value === "eq") return { label: "is", value: "in" };
        else return option;
      } else {
        return option;
      }
    })
    .filter((option) => option?.value !== null);
};
