import React from "react";
import { ICustomField } from "../../../models/ICustomField";
import { ISearchQuestData } from "./ConnectedViewAllSearchResultsScreen";
import { ViewAllSearchScreenSideMenu } from "./ViewAllSearchScreenSideMenu";
import { SideMenuLoader } from "../../../components/TailwindControls/ContentLoader/SideMenuLoader";

export type ViewAllSearchScreenSideMenuContainerProps = {
  appName: string;
  searchResults: Array<ISearchQuestData>;
  searchedResultProcessing: boolean;
  searchedValue: string;
  searchResultCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  currentSelectedSearch?: ISearchQuestData;
  setFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  setCurrentSelectedSearch: (item: ISearchQuestData) => void;
};

export const ViewAllSearchScreenSideMenuContainer = ({
  appName,
  searchResults,
  searchedResultProcessing,
  searchedValue,
  searchResultCount,
  currentPageNumber,
  onPageChange = () => {},
  currentSelectedSearch,
  setFieldsList = () => {},
  setCurrentSelectedSearch,
}: ViewAllSearchScreenSideMenuContainerProps) => {
  return (
    <>
      <div className="min-h-screen  overflow-y-scroll  fixed inset-y-0 left-0 mt-20 sm:mt-21.5 md:mt-15 pb-24 bg-white  hidden sm:flex sm:flex-col  h-full z-10 sm:w-1/3 lg:w-1/4 xl:w-1/5 shadow-xl">
        <>
          {searchedResultProcessing ? (
            <SideMenuLoader />
          ) : (
            <ViewAllSearchScreenSideMenu
              appName={appName}
              searchResults={searchResults}
              searchedValue={searchedValue}
              searchResultCount={searchResultCount}
              currentPageNumber={currentPageNumber}
              onPageChange={(pageNumber) => onPageChange(pageNumber)}
              currentSelectedSearch={currentSelectedSearch}
              setCurrentSelectedSearch={setCurrentSelectedSearch}
              setFieldsList={(modelName, fields) =>
                setFieldsList(modelName, fields)
              }
            />
          )}
        </>
      </div>
      <div className="min-h-screen  overflow-y-scroll  fixed inset-y-0 left-0 mt-20 sm:mt-21.5 md:mt-15 pb-24 sm:w-1/3 lg:w-1/4 xl:w-1/5 hidden sm:flex sm:flex-col " />
    </>
  );
};
