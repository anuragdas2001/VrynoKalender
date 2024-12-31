import { sortBy } from "lodash";
import React, { useContext } from "react";
import { AppModels } from "../../../../models/AppModels";
import { AccountModels } from "../../../../models/Accounts";
import { INavigation } from "../../../../models/INavigation";
import { ModuleSearchResultContainer } from "./ModuleSearchResultContainer";
import { ModuleSearchDataResultContainerPerFetch } from "./ModuleSearchDataResultContainerPerFetch";
import { NavigationStoreContext } from "../../../../stores/RootStore/NavigationStore/NavigationStore";
import { getFilteredModelNameList } from "../../../../screens/modules/search/getFilteredModelNameList";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { FormikValues, useFormikContext } from "formik";

export const sortModulesByOrder = (
  modelNameList: string[],
  navigations: INavigation[],
  sortList?: boolean
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
  if (sortList) {
    return sortBy(updatedModelNameList, function (modelName) {
      return modelName.modelName;
    });
  } else {
    return updatedModelNameList;
  }
};

export function getModelNameList(
  searchResults: Array<ISearchQuestData>,
  updatedNavigations: INavigation[],
  addUserModel?: boolean
) {
  return sortModulesByOrder(
    addUserModel
      ? getFilteredModelNameList(searchResults)
      : getFilteredModelNameList(searchResults).filter(
          (modelName) => modelName !== AccountModels.User
        ),
    updatedNavigations
  );
}

export function ModuleSearchDataResultContainer({
  appName,
  modelName,
  inputHeight,
  inputWidth,
  lookupRef,
  searchResults,
  searchBy,
  searchedValue,
  addUserModel,
  useModuleExpression,
  setPanelBelowVisible,
  handleSelectedItem,
  showModelNameInSearch = false,
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
}: {
  appName: string;
  modelName: string;
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement> | null;
  searchResults: Array<any>;
  searchBy: Array<string>;
  searchedValue: string;
  showModelNameInSearch?: boolean;
  addUserModel?: boolean;
  useModuleExpression?: boolean;
  setPanelBelowVisible: (value: boolean) => void;
  handleSelectedItem: (item: ISearchQuestData) => void;
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
}) {
  const { navigations } = useContext(NavigationStoreContext);
  const { values } = useFormikContext<FormikValues>();

  const updatedNavigations = navigations.concat({
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
    addUserModel
  );

  return (
    <div className="relative inline-block">
      <ModuleSearchResultContainer
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
      >
        <div className="w-full h-full overflow-auto">
          {modelNameList?.length > 0 || appliedFilterModelName ? (
            <ModuleSearchDataResultContainerPerFetch
              appName={appName}
              modelName={modelName}
              modelNameList={modelNameList}
              showModelNameInSearch={showModelNameInSearch}
              updatedNavigations={updatedNavigations}
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
              searchBy={searchBy?.filter((item) => item !== "")}
              searchedValue={searchedValue}
              handleSelectedItem={(value) => handleSelectedItem(value)}
              useModuleExpression={useModuleExpression}
              setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
              viewAllFields={viewAllFields}
              showSearchFilter={showSearchFilter}
              setFilterSearchResults={setFilterSearchResults}
              setAppliedFilterModelName={setAppliedFilterModelName}
              searchFieldDataForFilter={searchFieldDataForFilter}
              setSearchFilterProcessing={setSearchFilterProcessing}
              searchFilterProcessing={searchFilterProcessing}
              allowFilters={allowFilters}
              closeSearchModal={closeSearchModal}
              formikValues={values}
              generateLink={generateLink}
            />
          ) : (
            <div className="w-full h-full py-2 text-sm flex items-center justify-center bg-white text-gray-500">
              <span>No Data Found</span>
            </div>
          )}
        </div>
      </ModuleSearchResultContainer>
    </div>
  );
}
