import React, { useContext } from "react";
import { AppModels } from "../../../models/AppModels";
import { ICustomField } from "../../../models/ICustomField";
import { ISearchQuestData } from "./ConnectedViewAllSearchResultsScreen";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { getModelNameList } from "../../../components/TailwindControls/Form/ModuleSearchBox/ModuleSearchDataResultContainer";
import { ModuleSearchDataResultContainerPerFetch } from "../../../components/TailwindControls/Form/ModuleSearchBox/ModuleSearchDataResultContainerPerFetch";

export type ViewAllSearchScreenSideMenuProps = {
  appName: string;
  searchResults: Array<ISearchQuestData>;
  currentSelectedSearch?: ISearchQuestData;
  searchedValue: string;
  searchResultCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  setFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  setCurrentSelectedSearch: (item: ISearchQuestData) => void;
};

export const ViewAllSearchScreenSideMenu = ({
  appName,
  searchResults,
  currentSelectedSearch,
  searchedValue,
  searchResultCount,
  currentPageNumber,
  onPageChange = () => {},
  setFieldsList = () => {},
  setCurrentSelectedSearch,
}: ViewAllSearchScreenSideMenuProps) => {
  const { navigations } = useContext(NavigationStoreContext);

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

  const modelNameList = getModelNameList(
    searchResults,
    updatedNavigations,
    false
  );

  return modelNameList?.length > 0 ? (
    <ModuleSearchDataResultContainerPerFetch
      appName={appName}
      modelNameList={modelNameList}
      showModelNameInSearch={false}
      updatedNavigations={updatedNavigations}
      currentSelectedSearch={currentSelectedSearch}
      setFieldsList={setFieldsList}
      searchResultCount={searchResultCount}
      currentPageNumber={currentPageNumber}
      onPageChange={(pageNumber) => onPageChange(pageNumber)}
      searchResults={searchResults?.filter(
        (result) =>
          ![
            "note",
            "dealPipelineStage",
            "dealPipeline",
            "layoutField",
            "layout",
            "field",
            "module",
            "moduleView",
            "attachment",
            "rolePermission",
            "role",
            "navigationItem",
            "bulkImportJob",
            "navigation",
            AppModels.Dashboard.toLowerCase(),
            AppModels.Widget.toLowerCase(),
          ].includes(result.modelName)
      )}
      searchBy={["name"]}
      searchedValue={searchedValue}
      handleSelectedItem={(value) => setCurrentSelectedSearch(value)}
      useModuleExpression={true}
      setPanelBelowVisible={(value) => {}}
      smallResolution={true}
      allowFilters={false}
      formikValues={{}}
      viewAllFields={false}
      showSearchFilter={false}
      setFilterSearchResults={function (
        value: React.SetStateAction<any[] | null>
      ): void {
        throw new Error("Function not implemented.");
      }}
      setAppliedFilterModelName={function (
        value: React.SetStateAction<string | null>
      ): void {
        throw new Error("Function not implemented.");
      }}
      setSearchFilterProcessing={function (
        value: React.SetStateAction<boolean>
      ): void {
        throw new Error("Function not implemented.");
      }}
      searchFilterProcessing={false}
    />
  ) : (
    <div className="w-full h-full py-2 text-sm flex items-center justify-center bg-white text-gray-500">
      <span>No Data Found</span>
    </div>
  );
};
