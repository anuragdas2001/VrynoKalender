import React, { RefObject } from "react";
import { ICustomField } from "../../../../models/ICustomField";
import { DataResultContainer } from "./DataResultContainer";
import { NoDataResultContainer } from "./NoDataResultContainer";
import QuestDataHandler from "./QuestDataHandler";
import { BaseGenericObjectType } from "../../../../models/shared";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { PageLoader } from "../../ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

export type ShowResultsBoxProps = {
  appName: string;
  modelName: string;
  searchedValue: string;
  inputWidth: number;
  inputHeight: number;
  lookupRef: RefObject<HTMLDivElement> | null;
  searchProcessing: boolean;
  isPanelBelowVisible: boolean;
  searchResults: Array<ISearchQuestData>;
  demoSearchResults?: Array<any>;
  mappedDemoSearchResults?: Array<any>;
  searchBy: Array<string>;
  fieldsList?: ICustomField[];
  overflow?: boolean;
  fieldLabel?: string;
  onDataLoadButtonComponent?: React.ReactElement;
  showModelNameInSearch?: boolean;
  setFieldsList?: (fields: ICustomField[]) => void;
  setPanelBelowVisible: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  handleSelectedItem?: (item: ISearchQuestData) => void;
  handleAddedRecord?: (data: BaseGenericObjectType) => void;
  setCurrentFormLayer?: (value: boolean) => void;
};

export const ShowResultsBox = ({
  appName,
  modelName,
  searchedValue,
  inputHeight,
  inputWidth,
  lookupRef,
  fieldLabel,
  isPanelBelowVisible,
  searchProcessing,
  searchResults,
  demoSearchResults = [],
  mappedDemoSearchResults = [],
  onDataLoadButtonComponent,
  searchBy,
  fieldsList,
  overflow,
  showModelNameInSearch = false,
  setFieldsList = () => {},
  setPanelBelowVisible,
  handleSelectedItem = () => {},
  handleAddedRecord = () => {},
  setCurrentFormLayer = () => {},
}: ShowResultsBoxProps) => {
  if (searchedValue) {
    return (
      <>
        <QuestDataHandler
          appName={appName}
          modelName={modelName}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          overflow={overflow}
          isPanelBelowVisible={isPanelBelowVisible}
          searchedResultsLoading={searchProcessing}
          searchedValue={searchedValue}
          searchResults={searchResults}
          demoSearchResults={
            mappedDemoSearchResults?.length
              ? mappedDemoSearchResults
              : demoSearchResults
          }
          onDataLoadButtonComponent={onDataLoadButtonComponent}
          searchBy={searchBy}
          fieldsList={fieldsList}
          showModelNameInSearch={showModelNameInSearch}
          setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
          handleSelectedItem={(item) => {
            handleSelectedItem(item);
          }}
          setFieldsList={(fields) => setFieldsList(fields)}
          handleAddedRecord={(data) => handleAddedRecord(data)}
          setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
        />
      </>
    );
  } else if (
    isPanelBelowVisible &&
    (demoSearchResults?.length > 0 || mappedDemoSearchResults?.length > 0)
  ) {
    return (
      <>
        <DataResultContainer
          appName={appName}
          modelName={modelName}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          searchResults={
            mappedDemoSearchResults?.length
              ? mappedDemoSearchResults
              : demoSearchResults
          }
          searchBy={searchBy}
          searchedValue={""}
          overflow={overflow}
          setPanelBelowVisible={setPanelBelowVisible}
          onDataLoadButtonComponent={onDataLoadButtonComponent}
          fieldsList={fieldsList}
          showModelNameInSearch={showModelNameInSearch}
          setFieldsList={(fields) => setFieldsList(fields)}
          handleSelectedItem={(item) => {
            handleSelectedItem(item);
          }}
          handleAddedRecord={(data) => handleAddedRecord(data)}
          setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
        />
      </>
    );
  } else if (isPanelBelowVisible && demoSearchResults?.length === 0) {
    return (
      <>
        <NoDataResultContainer
          appName={appName}
          modelName={modelName}
          inputHeight={inputHeight}
          inputWidth={inputWidth}
          lookupRef={lookupRef}
          handleAddedRecord={(data) => handleAddedRecord(data)}
        />
      </>
    );
  } else {
    return <></>;
  }
};
