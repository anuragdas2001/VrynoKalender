import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { ICustomField } from "./../../../../models/ICustomField";

export const getSearchedValue = (
  searchResult: Record<any, any>,
  item: string
) => {
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      if (key === item) return denomarlizedSearchResult[item];
    }
  }
};

export const getSearchedValueOtherThanSearchByOptionsValues = (
  searchResult: Record<any, any>,
  searchedValue: string,
  searchBy: Array<string>
) => {
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      if (
        typeof denomarlizedSearchResult[key] === "string" &&
        denomarlizedSearchResult[key]
          .toLowerCase()
          .includes(searchedValue.toLowerCase())
      ) {
        return denomarlizedSearchResult[key];
      }
    }
  }
};

export const getSearchedValueKeyOtherThanSearchByOptions = (
  searchResult: Record<any, any>,
  searchedValue: string,
  searchBy: Array<string>,
  fieldsList?: ICustomField[]
) => {
  let uniqueName: any;
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      if (
        typeof denomarlizedSearchResult[key] === "string" &&
        denomarlizedSearchResult[key]
          .toLowerCase()
          .includes(searchedValue.toLowerCase())
      ) {
        uniqueName = key;
        break;
      }
    }
  }
  const fieldLabel = fieldsList?.filter((field) => field.name === uniqueName)[0]
    ?.label?.en;
  if (fieldLabel) return fieldLabel.concat(` : `);
  else return uniqueName?.concat(` : `);
};

export const beforeHighlightedSearchText = (
  result: string,
  searchValue: string
) => {
  const searchValueIndex = result
    ?.toLowerCase()
    ?.indexOf(searchValue?.toLowerCase());
  return searchValueIndex === -1 ? result : result?.slice(0, searchValueIndex);
};

export const highlightSearchedText = (result: string, searchValue: string) => {
  const searchValueIndex = result
    ?.toLowerCase()
    ?.indexOf(searchValue.toLowerCase());
  return (
    searchValueIndex !== -1 &&
    result?.slice(searchValueIndex, searchValueIndex + searchValue.length)
  );
};

export const afterHighlightedSearchText = (
  result: string,
  searchValue: string
) => {
  const searchValueIndex = result
    ?.toLowerCase()
    ?.indexOf(searchValue.toLowerCase());
  return (
    searchValueIndex !== -1 &&
    result?.slice(searchValueIndex + searchValue.length)
  );
};
