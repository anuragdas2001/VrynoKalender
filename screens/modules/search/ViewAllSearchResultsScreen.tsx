import React from "react";
import { get } from "lodash";
import { ICustomField } from "../../../models/ICustomField";
import { BaseGenericObjectType } from "../../../models/shared";
import { SideDrawer } from "../crm/shared/components/SideDrawer";
import { ISearchQuestData } from "./ConnectedViewAllSearchResultsScreen";
import GenericBackHeader from "../crm/shared/components/GenericBackHeader";
import { ViewAllSearchScreenSideMenu } from "./ViewAllSearchScreenSideMenu";
import { getVisibleFieldList } from "../crm/shared/utils/getOrderedFieldsList";
import { ViewAllSearchScreenSideMenuContainer } from "./ViewAllSearchScreenSideMenuContainer";
import { DetailFieldPerDataType } from "../crm/shared/components/ReadOnly/DetailFieldPerDataType";
import GenericHeaderCardContainer from "../../../components/TailwindControls/Cards/GenericHeaderCardContainer";

export type ViewAllSearchResultsScreenProps = {
  appName: string;
  searchResults: Array<ISearchQuestData>;
  searchedValue: string;
  searchResultCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  searchedResultProcessing: boolean;
  currentSelectedSearch?: ISearchQuestData;
  fieldsList: { [modelName: string]: ICustomField[] };
  modelDataLoading: boolean;
  modelData: BaseGenericObjectType;
  setFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  setCurrentSelectedSearch: (value: ISearchQuestData) => void;
};

export const ViewAllSearchResultsScreen = ({
  appName,
  searchResults,
  searchedValue,
  searchResultCount,
  currentPageNumber,
  onPageChange = () => {},
  searchedResultProcessing,
  currentSelectedSearch,
  fieldsList,
  modelData,
  modelDataLoading,
  setFieldsList = () => {},
  setCurrentSelectedSearch,
}: ViewAllSearchResultsScreenProps) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  return (
    <div className="flex w-full">
      <ViewAllSearchScreenSideMenuContainer
        appName={appName}
        searchedResultProcessing={searchedResultProcessing}
        searchResults={searchResults}
        searchedValue={searchedValue}
        searchResultCount={searchResultCount}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => onPageChange(pageNumber)}
        currentSelectedSearch={currentSelectedSearch}
        setCurrentSelectedSearch={setCurrentSelectedSearch}
        setFieldsList={(modelName, fields) => setFieldsList(modelName, fields)}
      />
      <div className="flex flex-col w-full sm:w-2/3 lg:w-3/4 xl:w-4/5 h-full sm:ml-1/3 lg:ml-1/4 xl:ml-1/5">
        <GenericBackHeader
          heading={`${
            currentSelectedSearch?.modelName === "User"
              ? `${currentSelectedSearch?.values["first_name"]} ${get(
                  currentSelectedSearch?.values,
                  "last_name",
                  ""
                )}`
              : currentSelectedSearch?.values["name"] ?? ""
          }`}
          subHeading={`${currentSelectedSearch?.modelName ?? ""}`}
        />
        <div className="sm:hidden w-40 mt-4">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
            // onMenuItemChange={(item) => setCurrentSelectedSearch(item)}
            menuLoading={searchedResultProcessing}
          >
            <div className="h-screen  overflow-y-scroll  ">
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
            </div>
          </SideDrawer>
        </div>
        <div className={`p-6 `}>
          <GenericHeaderCardContainer
            cardHeading="Details"
            extended={true}
            id="Details"
          >
            <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 max-h-96 overflow-y-scroll">
              {fieldsList &&
                fieldsList[currentSelectedSearch?.modelName || ""] &&
                getVisibleFieldList(
                  fieldsList[currentSelectedSearch?.modelName || ""]
                )
                  ?.filter((value) => value.value !== "relatedTo")
                  .map((header, index) => {
                    return (
                      <DetailFieldPerDataType
                        field={{
                          label: header.label,
                          value: header.value,
                          dataType: header.dataType,
                          field: header.field,
                        }}
                        detailSizeImage={true}
                        data={modelData}
                        headerVisible={true}
                        fontSize={{ header: "text-sm", value: "text-sm" }}
                        key={index}
                        isSample={modelData.isSample}
                        manualModelName={currentSelectedSearch?.modelName ?? ""}
                      />
                    );
                  })}
            </div>
          </GenericHeaderCardContainer>
        </div>
      </div>
    </div>
  );
};
