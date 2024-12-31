import React, { RefObject } from "react";
import { ICustomField } from "../../../../models/ICustomField";
import { Loading } from "../../Loading/Loading";
import { DataResultContainer } from "./DataResultContainer";
import { NoDataResultContainer } from "./NoDataResultContainer";
import { ResultContainer } from "./ResultContainer";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

export type QuestDataHandlerProps = {
  appName: string;
  modelName: string;
  inputWidth: number;
  inputHeight: number;
  overflow?: boolean;
  lookupRef: RefObject<HTMLDivElement> | null;
  searchedResultsLoading: boolean;
  isPanelBelowVisible: boolean;
  searchedValue: string;
  searchResults: Array<ISearchQuestData>;
  demoSearchResults?: Array<any>;
  searchBy: Array<string>;
  fieldsList?: ICustomField[];
  onDataLoadButtonComponent?: React.ReactElement;
  showModelNameInSearch?: boolean;
  setFieldsList?: (fields: ICustomField[]) => void;
  setPanelBelowVisible: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  handleSelectedItem?: (item: ISearchQuestData) => void;
  handleAddedRecord?: (data: any) => void;
  setCurrentFormLayer?: (value: boolean) => void;
};

export const QuestDataHandler = ({
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
  overflow,
  searchBy = [],
  fieldsList = [],
  onDataLoadButtonComponent,
  showModelNameInSearch,
  setFieldsList = () => {},
  setPanelBelowVisible = () => {},
  handleSelectedItem = () => {},
  handleAddedRecord = () => {},
  setCurrentFormLayer = () => {},
}: QuestDataHandlerProps) => {
  if (searchedResultsLoading) {
    return (
      <div className="relative inline-block">
        <ResultContainer
          appName={appName}
          modelName={modelName}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          overflow={overflow}
          handleAddedRecord={(data) => handleAddedRecord(data)}
        >
          <div className="w-full h-full py-2 flex items-center justify-center bg-white ">
            <PageLoader scale={0.5} />
          </div>
        </ResultContainer>
      </div>
    );
  } else if (isPanelBelowVisible && searchedValue && searchResults?.length) {
    return (
      <DataResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        searchResults={searchResults}
        searchBy={searchBy}
        searchedValue={searchedValue}
        overflow={overflow}
        setPanelBelowVisible={setPanelBelowVisible}
        onDataLoadButtonComponent={onDataLoadButtonComponent}
        fieldsList={fieldsList}
        showModelNameInSearch={showModelNameInSearch}
        handleSelectedItem={(item) => {
          handleSelectedItem(item);
        }}
        setFieldsList={(fields) => setFieldsList(fields)}
        handleAddedRecord={(data) => handleAddedRecord(data)}
        setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      />
    );
  } else if (isPanelBelowVisible && searchedValue && !searchResults?.length) {
    return (
      <NoDataResultContainer
        appName={appName}
        modelName={modelName}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        handleAddedRecord={(data) => handleAddedRecord(data)}
      />
    );
  }

  return null;
};

export default QuestDataHandler;
