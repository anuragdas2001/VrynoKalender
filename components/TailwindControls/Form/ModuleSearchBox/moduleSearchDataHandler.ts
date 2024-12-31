import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { ICustomField } from "../../../../models/ICustomField";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";

export const getSearchedValue = (
  searchResult: ISearchQuestData,
  item: string
) => {
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      if (key === item) return denomarlizedSearchResult[item];
    }
  }
};

export const getSearchedFieldDataType = (
  searchResult: ISearchQuestData,
  searchedValue: string,
  fieldsList?: ICustomField[]
) => {
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      const keyFieldData = fieldsList?.filter((field) => field.name === key);
      if (
        keyFieldData &&
        keyFieldData.length > 0 &&
        (keyFieldData[0].dataType === "datetime" ||
          keyFieldData[0].dataType === "date") &&
        denomarlizedSearchResult[key]
      ) {
        const dateTimeData = new Date(
          denomarlizedSearchResult[key]
        ).toLocaleString();
        const searchedDate = new Date(searchedValue).toLocaleDateString();
        if (dateTimeData.includes(searchedDate))
          return keyFieldData[0].dataType;
      } else if (
        String(denomarlizedSearchResult[key])
          .toLowerCase()
          .includes(searchedValue.toLowerCase())
      ) {
        if (
          keyFieldData &&
          keyFieldData.length > 0 &&
          denomarlizedSearchResult[key]
        )
          return keyFieldData[0].dataType;
      }
    }
  }
};

export const getSearchedValueOtherThanSearchByOptionsValues = (
  searchResult: ISearchQuestData,
  searchedValue: string,
  searchBy: Array<string>,
  fieldsList?: ICustomField[]
) => {
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      const keyFieldData = fieldsList?.filter((field) => field.name === key);
      if (
        keyFieldData &&
        keyFieldData.length > 0 &&
        (keyFieldData[0].dataType === "datetime" ||
          keyFieldData[0].dataType === "date") &&
        denomarlizedSearchResult[key]
      ) {
        const dateTimeData = new Date(
          denomarlizedSearchResult[key]
        ).toLocaleString();
        const searchedDate = new Date(searchedValue).toLocaleDateString();
        if (dateTimeData.includes(searchedDate)) return dateTimeData;
      } else if (
        String(denomarlizedSearchResult[key])
          .toLowerCase()
          .includes(searchedValue.toLowerCase())
      ) {
        return denomarlizedSearchResult[key];
      }
    }
  }
};

export const getSearchedValueKeyOtherThanSearchByOptions = (
  searchResult: ISearchQuestData,
  searchedValue: string,
  searchBy: Array<string>,
  fieldsList?: ICustomField[]
) => {
  let uniqueName: any;
  if (searchResult?.values) {
    let denomarlizedSearchResult = getDataObject(searchResult?.values);
    for (let key in denomarlizedSearchResult) {
      const keyFieldData = fieldsList?.filter((field) => field.name === key);
      if (
        keyFieldData &&
        keyFieldData.length > 0 &&
        (keyFieldData[0].dataType === "datetime" ||
          keyFieldData[0].dataType === "date") &&
        denomarlizedSearchResult[key]
      ) {
        const dateTimeData = new Date(
          denomarlizedSearchResult[key]
        ).toLocaleString();
        const searchedDate = new Date(searchedValue).toLocaleDateString();
        if (dateTimeData.includes(searchedDate)) {
          uniqueName = key;
          break;
        }
      } else if (
        String(denomarlizedSearchResult[key])
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
  searchValue: string,
  dataType?: any
) => {
  if (dataType === "date" || dataType === "datetime") {
    let searchResult = String(result)?.toLowerCase();
    let searchedValue = String(
      new Date(searchValue).toLocaleString()
    )?.toLowerCase();
    searchedValue = searchedValue.split(",")[0];
    const searchValueIndex = searchResult?.indexOf(searchedValue);
    return searchValueIndex === -1
      ? String(result)
      : String(result)?.slice(0, searchValueIndex);
  } else {
    const searchValueIndex = String(result)
      ?.toLowerCase()
      ?.indexOf(searchValue?.toLowerCase());
    return searchValueIndex === -1
      ? String(result ?? "")
      : String(result ?? "")?.slice(0, searchValueIndex);
  }
};

export const highlightSearchedText = (
  result: string,
  searchValue: string,
  dataType?: any
) => {
  if (dataType === "date" || dataType === "datetime") {
    let searchResult = String(result)?.toLowerCase();
    let searchedValue = String(
      new Date(searchValue).toLocaleString()
    )?.toLowerCase();
    searchedValue = searchedValue.split(",")[0];
    const searchValueIndex = searchResult?.indexOf(searchedValue);
    return (
      searchValueIndex !== -1 &&
      String(result)?.slice(
        searchValueIndex,
        searchValueIndex + searchedValue.length
      )
    );
  } else {
    const searchValueIndex = String(result)
      ?.toLowerCase()
      ?.indexOf(searchValue.toLowerCase());
    return (
      searchValueIndex !== -1 &&
      String(result ?? "")?.slice(
        searchValueIndex,
        searchValueIndex + searchValue.length
      )
    );
  }
};

export const afterHighlightedSearchText = (
  result: string,
  searchValue: string,
  dataType?: any
) => {
  if (dataType === "date" || dataType === "datetime") {
    let searchResult = String(result)?.toLowerCase();
    let searchedValue = String(
      new Date(searchValue).toLocaleString()
    )?.toLowerCase();
    searchedValue = searchedValue.split(",")[0];
    const searchValueIndex = searchResult?.indexOf(searchedValue);
    return (
      searchValueIndex !== -1 &&
      String(result)?.slice(searchValueIndex + searchedValue.length)
    );
  } else {
    const searchValueIndex = String(result)
      ?.toLowerCase()
      ?.indexOf(searchValue.toLowerCase());
    return (
      searchValueIndex !== -1 &&
      String(result ?? "")?.slice(searchValueIndex + searchValue.length)
    );
  }
};
