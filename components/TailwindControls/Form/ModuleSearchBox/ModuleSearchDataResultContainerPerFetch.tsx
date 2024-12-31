import React from "react";
import { get } from "lodash";
import { useLazyQuery } from "@apollo/client";
import { ILayout } from "../../../../models/ILayout";
import {
  ModuleSearchDataResultContainerPerFetchProps,
  userFieldsList,
} from "./ModuleSearchBoxProps";
import { ICustomField } from "../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../models/IModuleMetadata";
import { GeneralStoreContext } from "../../../../stores/RootStore/GeneralStore/GeneralStore";
import { getSortedFieldList } from "../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import { ModuleSearchDataResultContainerPerFetchContent } from "./ModuleSearchDataResultContainerPerFetchContent";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../graphql/queries/fetchQuery";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../../../screens/modules/crm/shared/utils/getFieldsFromDisplayExpression";

export const ModuleSearchDataResultContainerPerFetch = ({
  appName,
  showModelNameInSearch,
  modelNameList,
  updatedNavigations,
  searchResults,
  searchBy,
  searchedValue,
  smallResolution,
  showMoreData = true,
  currentSelectedSearch,
  searchByUniqueName = true,
  highlightedResultInFlexCol = false,
  searchResultCount,
  currentPageNumber,
  onPageChange = () => {},
  useModuleExpression = false,
  handleItemsFieldsList = () => {},
  handleSelectedItem = () => {},
  setPanelBelowVisible,
  setFieldsList = () => {},
  viewAllFields,
  showSearchFilter,
  setFilterSearchResults,
  setAppliedFilterModelName,
  searchFieldDataForFilter,
  setSearchFilterProcessing,
  searchFilterProcessing,
  allowFilters,
  closeSearchModal,
  formikValues,
  generateLink,
}: ModuleSearchDataResultContainerPerFetchProps) => {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const [fieldsListPerModule, setFieldsListPerModule] = React.useState<{
    [modelName: string]: ICustomField[];
  }>();
  const [modulesFetched, setModulesFetched] = React.useState<{
    [modelName: string]: IModuleMetadata;
  }>();
  const [updatedSearchBy, setUpdatedSearchBy] = React.useState<{
    [modelName: string]: string[];
  }>();
  const [fieldsListFetchLoading, setFieldsListFetchLoading] =
    React.useState<boolean>(true);
  const [modulesFetchLoading, setModulesFetchLoading] =
    React.useState<boolean>(true);

  const [getModule] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    }
  );

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const checkIfAllModulesFieldsPresent = (
    modelNameList: { modelName: string; order: number }[],
    fieldsListPerModule?: {
      [modelName: string]: ICustomField[];
    }
  ) => {
    let foundEveryModuleFlag = true;
    modelNameList?.forEach((modelName) => {
      const fieldsList = get(fieldsListPerModule, modelName.modelName, []);
      if (fieldsList?.length === 0) {
        foundEveryModuleFlag = false;
      }
    });
    return foundEveryModuleFlag;
  };

  React.useEffect(() => {
    if (!appName) return;
    if (
      modelNameList?.length > 0 &&
      !checkIfAllModulesFieldsPresent(modelNameList, fieldsListPerModule) &&
      allLayoutFetched &&
      allModulesFetched
    ) {
      const handleModulesFetch = async () => {
        setModulesFetchLoading(true);
        const fetchPromise = modelNameList?.map(
          async (data: { modelName: string; order: number }) => {
            if (genericModels[data?.modelName]?.moduleInfo) {
              return {
                messageKey: "-success",
                data: [genericModels[data?.modelName]?.moduleInfo],
              };
            } else {
              const response = await getModule({
                variables: {
                  modelName: "Module",
                  fields: ["id", "name", "customizationAllowed"],
                  filters: [
                    {
                      name: "name",
                      operator: "eq",
                      value: [data?.modelName],
                    },
                  ],
                },
              });
              return response.data?.fetch;
            }
          }
        );
        let modulesList: {
          [modelName: string]: IModuleMetadata;
        } = {};
        await Promise.all(fetchPromise).then((response) => {
          for (let resp of response) {
            if (resp?.messageKey?.includes("-success")) {
              if (resp?.data && resp?.data?.length > 0) {
                modulesList[resp?.data[0]?.name] = resp?.data[0];
              }
            }
          }
        });
        setModulesFetched(modulesList);
        setModulesFetchLoading(false);
      };
      const handleFieldsListFetch = async () => {
        setFieldsListFetchLoading(true);
        const fetchPromise = modelNameList?.map(
          async (data: { modelName: string; order: number }) => {
            if (genericModels[data?.modelName]?.layouts) {
              return {
                messageKey: "-success",
                data: genericModels[data?.modelName]?.layouts,
              };
            } else {
              const response = await getLayout({
                variables: {
                  modelName: "Layout",
                  fields: [
                    "id",
                    "name",
                    "moduleName",
                    "layout",
                    "config",
                    "type",
                  ],
                  filters: [
                    {
                      name: "moduleName",
                      operator: "eq",
                      value: [data.modelName],
                    },
                  ],
                },
              });
              return response.data?.fetch;
            }
          }
        );
        let fieldsListPerModule: {
          [modelName: string]: ICustomField[];
        } = { user: userFieldsList };
        await Promise.all(fetchPromise).then((response) => {
          for (let resp of response) {
            if (resp?.messageKey?.includes("-success")) {
              if (resp?.data && resp?.data?.length > 0) {
                fieldsListPerModule[resp?.data[0]?.moduleName] =
                  getSortedFieldList(
                    resp?.data[0]?.config?.fields?.filter(
                      (field) => field.visible
                    )
                  );
              }
            }
          }
        });
        setFieldsListPerModule(fieldsListPerModule);
        setFieldsListFetchLoading(false);
      };
      handleFieldsListFetch();
      handleModulesFetch();
    } else {
      setFieldsListFetchLoading(false);
      setModulesFetchLoading(false);
    }
  }, [
    modelNameList,
    fieldsListPerModule,
    allLayoutFetched,
    allModulesFetched,
    appName,
  ]);

  React.useEffect(() => {
    if (
      fieldsListPerModule &&
      Object.keys(fieldsListPerModule)?.length > 0 &&
      modulesFetched &&
      Object.keys(modulesFetched)?.length > 0 &&
      useModuleExpression
    ) {
      const moduleLevelExpression: { [modelName: string]: string } = {};
      Object.keys(modulesFetched).forEach((module) => {
        moduleLevelExpression[module] =
          modulesFetched[module]?.displayExpression ?? "${name}";
      });
      let updatedSearchBy: { [modelName: string]: string[] } = {};
      Object.keys(modulesFetched).forEach((module) => {
        let modelFieldList = fieldsListPerModule[module];
        let searchByListModuleLevel = evaluateDisplayExpression(
          getFieldsFromDisplayExpression(moduleLevelExpression[module]),
          genericModels[module]?.layouts?.[0]?.config?.fields || [],
          useModuleExpression
        );

        if (
          modelFieldList &&
          modelFieldList?.length > 0 &&
          searchByListModuleLevel &&
          searchByListModuleLevel.length > 0
        ) {
          for (let index = 0; index < searchByListModuleLevel.length; index++) {
            const field = modelFieldList?.filter(
              (field) =>
                field.name === searchByListModuleLevel[index].split(".").pop()
            );
            if (field.length > 0 && !field[0].systemDefined) {
              updatedSearchBy[module] = updatedSearchBy[module]
                ? [...updatedSearchBy[module], field[0].uniqueName]
                : [field[0].uniqueName];
            } else if (
              field.length > 0 &&
              field[0].uniqueName.split(".").length >= 3
            ) {
              updatedSearchBy[module] = updatedSearchBy[module]
                ? [
                    ...updatedSearchBy[module],
                    field[0].uniqueName.split(".")[2],
                  ]
                : [field[0].uniqueName.split(".")[2]];
            }
          }
        }
      });
      setUpdatedSearchBy(updatedSearchBy);
    }
  }, [fieldsListPerModule, modulesFetched, useModuleExpression]);

  return (
    <ModuleSearchDataResultContainerPerFetchContent
      appName={appName}
      fieldsListFetchLoading={fieldsListFetchLoading}
      modulesFetchLoading={modulesFetchLoading}
      smallResolution={smallResolution}
      searchResultCount={searchResultCount}
      searchResults={searchResults}
      currentPageNumber={currentPageNumber}
      onPageChange={onPageChange}
      showMoreData={showMoreData}
      searchedValue={searchedValue}
      currentSelectedSearch={currentSelectedSearch}
      handleSelectedItem={handleSelectedItem}
      setPanelBelowVisible={setPanelBelowVisible}
      highlightedResultInFlexCol={highlightedResultInFlexCol}
      useModuleExpression={useModuleExpression}
      updatedSearchBy={updatedSearchBy}
      searchBy={searchBy}
      fieldsListPerModule={fieldsListPerModule}
      setFieldsList={setFieldsList}
      viewAllFields={viewAllFields}
      showSearchFilter={showSearchFilter}
      setFilterSearchResults={setFilterSearchResults}
      setAppliedFilterModelName={setAppliedFilterModelName}
      searchFieldDataForFilter={searchFieldDataForFilter}
      setSearchFilterProcessing={setSearchFilterProcessing}
      searchFilterProcessing={searchFilterProcessing}
      allowFilters={allowFilters}
      closeSearchModal={closeSearchModal}
      formikValues={formikValues}
      generateLink={generateLink}
    />
  );
};
