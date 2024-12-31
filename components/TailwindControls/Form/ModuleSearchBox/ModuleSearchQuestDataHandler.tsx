import React, { RefObject } from "react";
import { Loading } from "../../Loading/Loading";
import { ModuleSearchDataResultContainer } from "./ModuleSearchDataResultContainer";
import { ModuleSearchNoDataResultContainer } from "./ModuleSearchNoDataResultContainer";
import { ModuleSearchResultContainer } from "./ModuleSearchResultContainer";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";

export type ModuleSearchQuestDataHandlerProps = {
  appName: string;
  modelName: string;
  inputWidth: number;
  inputHeight: number;
  lookupRef: RefObject<HTMLDivElement> | null;
  searchedResultsLoading: boolean;
  isPanelBelowVisible: boolean;
  searchedValue: string;
  searchResults: Array<any>;
  demoSearchResults?: Array<any>;
  searchBy: Array<string>;
  showModelNameInSearch?: boolean;
  addUserModel?: boolean;
  useModuleExpression?: boolean;
  setPanelBelowVisible: (value: boolean) => void;
  handleSelectedItem?: (item: ISearchQuestData) => void;
  viewAllFields: boolean;
  showSearchFilter: boolean;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  setAppliedFilterModelName: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  appliedFilterModelName: string | null;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  setSearchFilterProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  searchFilterProcessing: boolean;
  allowFilters: boolean;
  closeSearchModal?: (value: boolean) => void;
  generateLink?: boolean;
};

export const ModuleSearchQuestDataHandler = ({
  appName,
  modelName,
  inputHeight,
  inputWidth,
  lookupRef,
  searchedResultsLoading,
  isPanelBelowVisible,
  searchedValue,
  searchResults = [],
  demoSearchResults,
  searchBy = [],
  showModelNameInSearch,
  addUserModel,
  useModuleExpression,
  setPanelBelowVisible = () => {},
  handleSelectedItem = () => {},
  viewAllFields,
  showSearchFilter,
  setFilterSearchResults,
  setAppliedFilterModelName,
  appliedFilterModelName,
  searchFieldDataForFilter,
  setSearchFilterProcessing,
  searchFilterProcessing,
  allowFilters,
  closeSearchModal,
  generateLink,
}: ModuleSearchQuestDataHandlerProps) => {
  if (searchedResultsLoading) {
    return (
      <div className="relative inline-block">
        <ModuleSearchResultContainer
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
        >
          <div className="w-full h-full py-2 flex items-center justify-center bg-white ">
            <Loading color="Blue" />
          </div>
        </ModuleSearchResultContainer>
      </div>
    );
  } else if (isPanelBelowVisible && searchedValue && searchResults?.length) {
    return (
      <ModuleSearchDataResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        searchResults={searchResults}
        searchBy={searchBy}
        searchedValue={searchedValue}
        setPanelBelowVisible={setPanelBelowVisible}
        showModelNameInSearch={showModelNameInSearch}
        addUserModel={addUserModel}
        useModuleExpression={useModuleExpression}
        handleSelectedItem={(item) => {
          handleSelectedItem(item);
        }}
        viewAllFields={viewAllFields}
        showSearchFilter={showSearchFilter}
        setFilterSearchResults={setFilterSearchResults}
        setAppliedFilterModelName={setAppliedFilterModelName}
        appliedFilterModelName={appliedFilterModelName}
        searchFieldDataForFilter={searchFieldDataForFilter}
        setSearchFilterProcessing={setSearchFilterProcessing}
        searchFilterProcessing={searchFilterProcessing}
        allowFilters={allowFilters}
        closeSearchModal={closeSearchModal}
        generateLink={generateLink}
      />
    );
  } else if (isPanelBelowVisible && searchedValue && !searchResults?.length) {
    return (
      <ModuleSearchNoDataResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
      />
    );
  }

  return null;
};

export default ModuleSearchQuestDataHandler;
