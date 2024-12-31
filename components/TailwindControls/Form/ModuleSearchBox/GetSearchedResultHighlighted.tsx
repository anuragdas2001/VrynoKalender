import { ICustomField } from "../../../../models/ICustomField";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import {
  afterHighlightedSearchText,
  beforeHighlightedSearchText,
  getSearchedFieldDataType,
  getSearchedValue,
  getSearchedValueOtherThanSearchByOptionsValues,
  highlightSearchedText,
} from "./moduleSearchDataHandler";

export const GetSearchedResultHighlighted = ({
  searchResult,
  item,
  searchedValue,
  fieldsList,
  searchBy,
}: {
  searchResult: ISearchQuestData;
  item: string;
  searchedValue: string;
  fieldsList?: ICustomField[];
  searchBy?: Array<string>;
}) => {
  return (
    <>
      <span className="text-moreInfoHeading">
        {beforeHighlightedSearchText(
          searchBy
            ? getSearchedValueOtherThanSearchByOptionsValues(
                searchResult,
                searchedValue,
                searchBy,
                fieldsList
              )
            : getSearchedValue(searchResult, item),
          searchedValue,
          getSearchedFieldDataType(searchResult, searchedValue, fieldsList)
        )}
      </span>
      <span
        className={`text-moreInfoHeading ${
          item ? "" : "bg-vryno-search-highlighter"
        }`}
      >
        {highlightSearchedText(
          searchBy
            ? getSearchedValueOtherThanSearchByOptionsValues(
                searchResult,
                searchedValue,
                searchBy,
                fieldsList
              )
            : getSearchedValue(searchResult, item),
          searchedValue,
          getSearchedFieldDataType(searchResult, searchedValue, fieldsList)
        )}
      </span>
      <span className="text-moreInfoHeading">
        {afterHighlightedSearchText(
          searchBy
            ? getSearchedValueOtherThanSearchByOptionsValues(
                searchResult,
                searchedValue,
                searchBy,
                fieldsList
              )
            : getSearchedValue(searchResult, item),
          searchedValue,
          getSearchedFieldDataType(searchResult, searchedValue, fieldsList)
        )}
      </span>
    </>
  );
};
