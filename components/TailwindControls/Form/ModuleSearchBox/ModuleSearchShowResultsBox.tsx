import React, { RefObject } from "react";
import { Loading } from "../../Loading/Loading";
import { ModuleSearchDataResultContainer } from "./ModuleSearchDataResultContainer";
import { ModuleSearchNoDataResultContainer } from "./ModuleSearchNoDataResultContainer";
import ModuleSearchQuestDataHandler from "./ModuleSearchQuestDataHandler";
import { ModuleSearchResultContainer } from "./ModuleSearchResultContainer";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

export type ModuleSearchShowResultsBoxProps = {
  appName: string;
  modelName: string;
  searchedValue: string;
  inputWidth: number;
  inputHeight: number;
  lookupRef: RefObject<HTMLDivElement> | null;
  searchProcessing: boolean;
  isPanelBelowVisible: boolean;
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
  filterSearchResults: any[] | null;
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

export const ModuleSearchShowResultsBox = ({
  appName,
  modelName,
  searchedValue,
  inputHeight,
  inputWidth,
  lookupRef,
  isPanelBelowVisible,
  searchProcessing,
  searchResults,
  demoSearchResults = [],
  searchBy,
  showModelNameInSearch = false,
  addUserModel,
  useModuleExpression = false,
  setPanelBelowVisible,
  handleSelectedItem = () => {},
  viewAllFields,
  showSearchFilter,
  setFilterSearchResults,
  setAppliedFilterModelName,
  filterSearchResults,
  appliedFilterModelName,
  searchFieldDataForFilter,
  setSearchFilterProcessing,
  searchFilterProcessing,
  allowFilters,
  closeSearchModal,
  generateLink,
}: ModuleSearchShowResultsBoxProps) => {
  if (searchProcessing) {
    return (
      <div className="relative inline-block">
        <ModuleSearchResultContainer
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
        >
          <div className="w-full h-full py-2 flex items-center justify-center bg-white ">
            <PageLoader scale={1} />
          </div>
        </ModuleSearchResultContainer>
      </div>
    );
  } else if (filterSearchResults && filterSearchResults?.length === 0) {
    return (
      <ModuleSearchDataResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        searchResults={
          demoSearchResults?.length
            ? [
                {
                  modelName: demoSearchResults?.[0]?.modelName,
                  moduleUniqueName: demoSearchResults?.[0]?.moduleUniqueName,
                  rowId: "",
                  id: "",
                  values: {},
                  addedByQuickCreate: false,
                },
              ]
            : []
        }
        searchBy={searchBy}
        searchedValue={""}
        addUserModel={addUserModel}
        setPanelBelowVisible={setPanelBelowVisible}
        useModuleExpression={useModuleExpression}
        showModelNameInSearch={showModelNameInSearch}
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
  } else if (searchedValue) {
    return (
      <ModuleSearchQuestDataHandler
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        isPanelBelowVisible={isPanelBelowVisible}
        searchedResultsLoading={searchProcessing}
        searchedValue={searchedValue}
        searchResults={
          filterSearchResults?.length ? filterSearchResults : searchResults
        }
        demoSearchResults={
          filterSearchResults?.length ? filterSearchResults : demoSearchResults
        }
        searchBy={searchBy}
        showModelNameInSearch={showModelNameInSearch}
        addUserModel={addUserModel}
        useModuleExpression={useModuleExpression}
        setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
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
  } else if (isPanelBelowVisible && demoSearchResults?.length > 0) {
    return (
      <ModuleSearchDataResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        searchResults={
          filterSearchResults?.length ? filterSearchResults : demoSearchResults
        }
        searchBy={searchBy}
        searchedValue={""}
        addUserModel={addUserModel}
        setPanelBelowVisible={setPanelBelowVisible}
        useModuleExpression={useModuleExpression}
        showModelNameInSearch={showModelNameInSearch}
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
  } else if (isPanelBelowVisible) {
    return (
      <ModuleSearchNoDataResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
      />
    );
  } else {
    return <></>;
  }
};
