import React, { useContext } from "react";
import { ICustomField } from "../../../../models/ICustomField";
import {
  afterHighlightedSearchText,
  beforeHighlightedSearchText,
  getSearchedValue,
  getSearchedValueOtherThanSearchByOptionsValues,
  highlightSearchedText,
} from "./dataHandlers";
import { ResultContainer } from "./ResultContainer";
import { INavigation } from "../../../../models/INavigation";
import { sortBy } from "lodash";
import { NavigationStoreContext } from "../../../../stores/RootStore/NavigationStore/NavigationStore";
import { ModuleSearchDataResultContainerPerModule } from "../ModuleSearchBox/ModuleSearchDataResultContainerPerModule";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";

export const getSearchedResultHighlighted = (
  searchResult: Record<string, Array<any>>,
  item: string,
  searchedValue: string,
  searchBy?: Array<string>
) => {
  return (
    <>
      <span className="text-moreInfoHeading">
        {beforeHighlightedSearchText(
          searchBy
            ? getSearchedValueOtherThanSearchByOptionsValues(
                searchResult,
                searchedValue,
                searchBy
              )
            : getSearchedValue(searchResult, item),
          searchedValue
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
                searchBy
              )
            : getSearchedValue(searchResult, item),
          searchedValue
        )}
      </span>
      <span className="text-moreInfoHeading truncate">
        {afterHighlightedSearchText(
          searchBy
            ? getSearchedValueOtherThanSearchByOptionsValues(
                searchResult,
                searchedValue,
                searchBy
              )
            : getSearchedValue(searchResult, item),
          searchedValue
        )}
      </span>
    </>
  );
};

export const sortModulesByOrder = (
  modelNameList: string[],
  navigations: INavigation[]
) => {
  const updatedModelNameList = modelNameList.map(function (
    modelName,
    index,
    modelNameList
  ) {
    const modelInNavigation: INavigation = navigations.filter(
      (navigation) =>
        navigation?.navTypeMetadata?.moduleName &&
        navigation?.navTypeMetadata?.moduleName === modelName
    )[0];
    return { modelName, order: modelInNavigation?.order ?? -1 };
  });
  return sortBy(updatedModelNameList, function (modelName) {
    return modelName.modelName;
  });
};

export function DataResultContainer({
  appName,
  modelName,
  inputHeight,
  inputWidth,
  lookupRef,
  searchResults,
  searchBy,
  overflow,
  fieldsList = [],
  searchedValue,
  setPanelBelowVisible,
  handleSelectedItem,
  onDataLoadButtonComponent,
  handleAddedRecord = () => {},
  showModelNameInSearch = false,
  setFieldsList = () => {},
  setCurrentFormLayer = () => {},
}: {
  appName: string;
  modelName: string;
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement> | null;
  searchResults: Array<ISearchQuestData>;
  searchBy: Array<string>;
  fieldsList?: ICustomField[];
  overflow?: boolean;
  searchedValue: string;
  showModelNameInSearch?: boolean;
  setFieldsList?: (fields: ICustomField[]) => void;
  setPanelBelowVisible: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  handleSelectedItem: (item: ISearchQuestData) => void;
  onDataLoadButtonComponent?: React.ReactElement;
  handleAddedRecord?: (data: any) => void;
  setCurrentFormLayer?: (value: boolean) => void;
}) {
  const { navigations } = useContext(NavigationStoreContext);
  const modelNameList = searchResults
    ?.map((result) => result?.modelName)
    .filter(
      (value, index, searchResults) => searchResults.indexOf(value) === index
    );

  let updatedNavigations = navigations.concat({
    groupKey: "default-navigation",
    label: { en: "User" },
    navType: "module",
    navTypeMetadata: { moduleName: "User" },
    order: -1,
    parentNavigation: null,
    systemDefined: true,
    uniqueName: "user",
    name: "User",
    key: "User",
    fields: [],
    id: "",
    visible: true,
  });

  return (
    <div className="relative inline-block">
      <ResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        subChildren={onDataLoadButtonComponent}
        overflow={overflow}
        handleAddedRecord={(data) => handleAddedRecord(data)}
        setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
        setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
      >
        <>
          {sortModulesByOrder(modelNameList, updatedNavigations)
            ?.map((model) => model.modelName)
            ?.map((modelName, modelNameIndex) => (
              <div key={modelNameIndex}>
                <ModuleSearchDataResultContainerPerModule
                  appName={appName}
                  modelNameIndex={modelNameIndex}
                  showModelNameInSearch={showModelNameInSearch}
                  modelName={modelName}
                  updatedNavigations={updatedNavigations}
                  searchResults={searchResults}
                  highlightedResultInFlexCol={true}
                  searchBy={searchBy}
                  smallResolution={false}
                  searchedValue={searchedValue}
                  showMoreData={false}
                  handleSelectedItem={(value) => {
                    handleSelectedItem(value);
                    setPanelBelowVisible(false);
                  }}
                  handleItemsFieldsList={(modelName, fields) =>
                    setFieldsList(fields)
                  }
                  setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
                />
              </div>
            ))}
        </>
      </ResultContainer>
    </div>
  );
}
