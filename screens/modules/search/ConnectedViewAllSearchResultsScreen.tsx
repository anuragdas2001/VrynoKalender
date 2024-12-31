import { useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AccountModels } from "../../../models/Accounts";
import { getSearchPathParts } from "./getSearchPathParts";
import GoBackIcon from "remixicon-react/ArrowLeftLineIcon";
import { ICustomField } from "../../../models/ICustomField";
import { BaseGenericObjectType } from "../../../models/shared";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import { getDataObject } from "../crm/shared/utils/getDataObject";
import { SEARCH_QUERY } from "../../../graphql/queries/searchQuery";
import { getFilteredModelNameList } from "./getFilteredModelNameList";
import { ViewAllSearchResultsScreen } from "./ViewAllSearchResultsScreen";
import { getVisibleFieldsArray } from "../crm/shared/utils/getFieldsArray";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { sortModulesByOrder } from "../../../components/TailwindControls/Form/ModuleSearchBox/ModuleSearchDataResultContainer";
import { observer } from "mobx-react-lite";

export interface ISearchQuestData {
  modelName: string;
  moduleUniqueName: string;
  rowId: string;
  id?: string;
  values: BaseGenericObjectType;
  addedByQuickCreate?: boolean;
}

export const ConnectedViewAllSearchResultsScreen = observer(() => {
  const { navigations } = useContext(NavigationStoreContext);
  const { appName, modelName, filterBy } = getSearchPathParts();
  const [searchedResultProcessing, setSearchedResultProcessing] =
    React.useState<boolean>(true);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [searchResults, setSearchResults] = React.useState<ISearchQuestData[]>(
    []
  );
  const [currentSelectedSearch, setCurrentSelectedSearch] =
    React.useState<ISearchQuestData>();
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [fieldsList, setFieldsList] = React.useState<{
    [modelName: string]: ICustomField[];
  }>({});
  const [modelData, setModelData] = React.useState<BaseGenericObjectType>({});
  const [modelDataLoading, setModelDataLoading] =
    React.useState<boolean>(false);

  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onCompleted: (response) => {
      if (response?.quest?.data) {
        setSearchResults(response.quest.data);
        setItemsCount(response.quest.count);
        if (response.quest.data.length > 0) {
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
          const modelsInOder = sortModulesByOrder(
            getFilteredModelNameList(response.quest.data).filter(
              (modelName) => modelName !== AccountModels.User
            ),
            updatedNavigations,
            false
          );
          if (modelsInOder?.length > 0) {
            const getFirstItem = response.quest.data.filter(
              (data: ISearchQuestData) =>
                data.modelName === modelsInOder[0].modelName
            );
            if (getFirstItem?.length > 0) {
              setCurrentSelectedSearch(getFirstItem[0]);
            }
          }
        }
      }
      setSearchedResultProcessing(false);
    },
    onError: (error) => {
      setSearchedResultProcessing(false);
    },
  });

  const [getDataList] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setModelData(getDataObject(responseOnCompletion.fetch.data[0]));
      }
      setModelDataLoading(false);
    },
  });

  useEffect(() => {
    if (!appName) return;
    getSearchResults({
      variables: {
        serviceName: appName,
        modelName: modelName ? modelName : "",
        text: filterBy,
      },
    });
  }, [appName, modelName]);

  useEffect(() => {
    if (
      fieldsList &&
      fieldsList[currentSelectedSearch?.modelName || ""]?.length > 0 &&
      appName
    ) {
      const variables = {
        modelName: currentSelectedSearch?.modelName,
        fields: getVisibleFieldsArray(
          fieldsList[currentSelectedSearch?.modelName || ""]
        ),
        filters: [
          {
            name: "id",
            operator: "eq",
            value: currentSelectedSearch?.rowId?.toString() || "",
          },
        ],
      };
      try {
        getDataList({
          variables: variables,
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentSelectedSearch, fieldsList, appName]);

  const handleFieldsList = (modelName: string, fields: ICustomField[]) => {
    const updatedFieldsList = { ...fieldsList, [modelName]: fields };
    setFieldsList(updatedFieldsList);
  };

  const handlePageChange = (pageNumber: number) => {
    getSearchResults({
      variables: {
        serviceName: appName,
        modelName: modelName ? modelName : "",
        text: filterBy,
        pageNumber: pageNumber,
      },
    });
    setCurrentPageNumber(pageNumber);
  };

  if (!searchedResultProcessing && searchResults.length === 0) {
    return (
      <NoDataFoundContainer
        showButton={false}
        containerMessage={"No result found"}
      >
        <div className="my-4 w-2/3">
          <Button
            id={`go-back`}
            onClick={() => history.back()}
            kind="primary"
            userEventName="search-result:back-click"
          >
            <span
              className={`col-span-8 sm:col-span-10 flex justify-center items-center pr-1`}
            >
              <GoBackIcon size={20} className="mr-2" />
              <span>Go Back</span>
            </span>
          </Button>
        </div>
      </NoDataFoundContainer>
    );
  } else {
    return (
      <ViewAllSearchResultsScreen
        appName={appName}
        searchResults={searchResults}
        searchResultCount={itemsCount}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => handlePageChange(pageNumber)}
        searchedValue={filterBy ?? ""}
        searchedResultProcessing={searchedResultProcessing}
        currentSelectedSearch={currentSelectedSearch}
        fieldsList={fieldsList}
        modelDataLoading={modelDataLoading}
        modelData={modelData}
        setFieldsList={(modelName, fields) =>
          handleFieldsList(modelName, fields)
        }
        setCurrentSelectedSearch={(value: ISearchQuestData) => {
          setModelDataLoading(true);
          setCurrentSelectedSearch(value);
        }}
      />
    );
  }
});
