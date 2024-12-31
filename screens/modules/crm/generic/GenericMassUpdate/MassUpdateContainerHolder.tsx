import { useLazyQuery } from "@apollo/client";
import { FormikValues } from "formik";
import React from "react";
import { toast } from "react-toastify";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  BaseGenericObjectType,
  ICriteriaFilterRow,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import { MassUpdateContainer } from "./MassUpdateContainer";
import { massUpdateFilterGenerator } from "./massUpdateFilterGenerator";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import { User } from "../../../../../models/Accounts";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

interface IMassUpdateContainerProps {
  conditionList: ICriteriaFilterRow[];
  fieldsList: ICustomField[];
  filteredFieldOrder: ICustomField[];
  appName: SupportedApps;
  modelName: string;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  massUpdate: {
    visible: boolean;
  };
  selectedItems: BaseGenericObjectType[];
  user: User | null;
  handleItemSelect: (item: BaseGenericObjectType) => void;
  setSelectedItems: (value: BaseGenericObjectType[]) => void;
  setCurrentPageNumber: (value: number) => void;
  currentPageNumber: number;
  setMassUpdate: (value: { visible: boolean }) => void;
  handleMassUpdate: (values: FormikValues) => Promise<void>;
  massUpdateProcess: boolean;
  refetchData: boolean;
  setRefetchData: (value: boolean) => void;
  overlayMessage: Object;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}
export const MassUpdateContainerHolder = ({
  conditionList,
  fieldsList,
  filteredFieldOrder,
  appName,
  modelName,
  user,
  setConditionList,
  massUpdate,
  selectedItems,
  handleItemSelect,
  setSelectedItems,
  setCurrentPageNumber,
  currentPageNumber,
  setMassUpdate,
  handleMassUpdate,
  massUpdateProcess,
  refetchData,
  setRefetchData,
  overlayMessage,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: IMassUpdateContainerProps) => {
  const [filteredData, setFilteredData] = React.useState<
    BaseGenericObjectType[]
  >([]);
  const [processedFieldList, setProcessedFieldList] = React.useState<
    ISimplifiedCustomField[]
  >([]);
  const [previousCriteriaValues, setPreviousCriteriaValues] = React.useState(
    {}
  );
  const [getAllItemsFetchLoading, setGetAllItemsFetchLoading] =
    React.useState<boolean>(false);
  const [itemsCount, setItemsCount] = React.useState<number>(0);

  const [getMassUpdateFilteredData, { loading: massSearchLoading }] =
    useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

  const [filterAndExpression, setFilterAndExpression] = React.useState<{
    filters: {
      operator: string;
      name: string;
      value: string | string[];
      logicalOperator?: string | undefined;
      metadata?: string | undefined;
    }[];
    expression: string;
  }>({
    filters: [],
    expression: "",
  });
  const handleMassSearch = (
    values: FormikValues,
    conditionList: ICriteriaFilterRow[]
  ) => {
    const searchQuery = massUpdateFilterGenerator(
      values,
      conditionList,
      modelName,
      processedFieldList,
      "",
      fieldsList,
      user?.timezone
    );
    if (!searchQuery) {
      return;
    }
    setFilterAndExpression({
      filters: searchQuery.filters,
      expression: searchQuery.expression,
    });

    try {
      getMassUpdateFilteredData({ variables: searchQuery }).then((response) => {
        if (response.data?.fetch.messageKey.includes("-success")) {
          if (response.data.fetch.data.length === 0) {
            toast.error("No result found.");
          } else {
            toast.success("Data searched successfully.");
          }
          setItemsCount(response.data.fetch.count);
          let responseData = response.data.fetch.data.map((data: any) => {
            if (data.fields) {
              return { ...data, ...data.fields };
            }
            return data;
          });
          setFilteredData(getDataObjectArray(responseData));
        } else if (response.data?.fetch.messageKey.includes("view")) {
          toast.error(response.data?.fetch.message);
          setFilteredData([]);
        } else {
          toast.error(
            response.data ? response.data?.fetch.message : "Error fetching data"
          );
          setFilteredData([]);
        }
        setSelectedItems([]);
        setRefetchData(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [getDataList, { loading: massSearchPageLoading }] = useLazyQuery<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setFilteredData(getDataObjectArray(responseOnCompletion.fetch.data));
      } else {
        toast.error(responseOnCompletion?.fetch.message);
      }
    },
  });

  const handleAllItemsSelectFetch = async (
    totalItems: number,
    pageSize: number
  ) => {
    setGetAllItemsFetchLoading(true);
    const pagesCount = Math.ceil(totalItems / pageSize);
    let i = 0;
    let selectItemsOnAllPages: any[] = [];
    while (i < pagesCount) {
      await getDataList({
        variables: {
          modelName: modelName,
          fields: getVisibleFieldsArray(fieldsList),
          filters: filterAndExpression.filters,
          expression: filterAndExpression.expression,
          pageNumber: i + 1,
        },
      }).then((response) => {
        if (response?.data?.fetch?.messageKey.includes("success")) {
          selectItemsOnAllPages = [
            ...selectItemsOnAllPages,
            ...response.data.fetch.data,
          ];
        }
      });
      i++;
    }
    setSelectedItems(selectItemsOnAllPages);
    setGetAllItemsFetchLoading(false);
  };

  React.useEffect(() => {
    if (fieldsList.length) {
      setProcessedFieldList(
        fieldsList.map((field: ICustomField) => {
          return {
            value: field.name,
            label: field.label["en"],
            dataType: field.dataType,
            systemDefined: field.systemDefined,
          };
        })
      );
    }
  }, [fieldsList]);

  React.useEffect(() => {
    if (refetchData) {
      setFilteredData([]);
      setItemsCount(0);
    }
  }, [refetchData]);

  return !fieldsList.length ? (
    <div
      style={{
        height: (window.innerHeight * 4) / 6,
      }}
      className="w-full flex flex-col  items-center justify-center"
    >
      <PageLoader />
    </div>
  ) : (
    <MassUpdateContainer
      filteredData={filteredData}
      setPreviousCriteriaValues={setPreviousCriteriaValues}
      previousCriteriaValues={previousCriteriaValues}
      handleMassSearch={handleMassSearch}
      conditionList={conditionList}
      fieldsList={fieldsList}
      appName={appName}
      modelName={modelName}
      setConditionList={setConditionList}
      massSearchLoading={massSearchLoading}
      massSearchPageLoading={massSearchPageLoading}
      massUpdate={massUpdate}
      filteredFieldOrder={filteredFieldOrder}
      handleItemSelect={handleItemSelect}
      itemsCount={itemsCount}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      currentPageNumber={currentPageNumber}
      setCurrentPageNumber={setCurrentPageNumber}
      getDataList={getDataList}
      setMassUpdate={setMassUpdate}
      filterAndExpression={filterAndExpression}
      handleAllItemsSelectFetch={handleAllItemsSelectFetch}
      getAllItemsFetchLoading={getAllItemsFetchLoading}
      handleMassUpdate={handleMassUpdate}
      massUpdateProcess={massUpdateProcess}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      allModulesFetched={allModulesFetched}
      userPreferences={userPreferences}
    />
  );
};
