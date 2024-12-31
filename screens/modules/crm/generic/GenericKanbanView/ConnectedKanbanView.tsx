import React from "react";
import { useLazyQuery } from "@apollo/client";
import { KanbanViewContainer } from "./KanbanViewContainer";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { expressionGenerator, selectedFieldFinder } from "./kanbanViewHelper";
import { IKanbanViewData, SupportedApps } from "../../../../../models/shared";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { toast } from "react-toastify";
import { IPipelineMetadata } from "../../../settings/customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IInstance } from "../../../../../models/Accounts";

export const ConnectedKanbanView = ({
  appName,
  modelName,
  KVData,
  kanbanViewPermission,
  KVRecordData,
  setKVRecordData,
  fieldsList,
  loadingItemCount,
  selectedItems,
  dataProcessed,
  dataProcessing,
  foundNewData,
  setFoundNewData = () => {},
  onItemSelect,
  onMultiItemSelect,
  KViewDataLoading,
  deleteModalVisible,
  backgroundProcessRunning,
  updatedNewFiltersForCurrentCustomView,
  setSelectItemsOnAllPages,
  kanbanViewBulkDeleteRecords,
  setKanbanViewBulkDeleteRecords,
  openingRecordId,
  genericModels,
  instances,
  setOpeningRecordId,
}: {
  appName: SupportedApps;
  modelName: string;
  KVData: IKanbanViewData | null;
  kanbanViewPermission: boolean;
  setKVRecordData: (data: any[]) => void;
  KVRecordData: any[];
  fieldsList: ICustomField[];
  loadingItemCount: number;
  selectedItems: Array<any>;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  foundNewData: boolean;
  setFoundNewData?: (value: boolean) => void;
  onItemSelect: (selectedItem: any) => void;
  onMultiItemSelect: (selectedItem: any[]) => void;
  KViewDataLoading: boolean;
  deleteModalVisible: boolean;
  backgroundProcessRunning?: boolean;
  updatedNewFiltersForCurrentCustomView?: {
    name: string | null;
    operator: string | null;
    value: any[] | null;
    logicalOperator: string | null;
  }[];
  genericModels: IGenericModel;
  instances: IInstance[];
  setSelectItemsOnAllPages: (items: any[]) => void;
  kanbanViewBulkDeleteRecords: string[] | null;
  setKanbanViewBulkDeleteRecords: (value: string[] | null) => void;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
}) => {
  let currentCustomViewFilter =
    genericModels[modelName]?.currentCustomViewFilter ?? [];
  const [isCategorizeByVisible, setIsCategorizeByVisible] =
    React.useState(true);
  const [KVDataLoading, setKVDataLoading] = React.useState(true);
  const [recordDataLoading, setRecordDataLoading] = React.useState(true);
  const [pageLoader, setPageLoader] = React.useState<string | null>(null);

  const [KVColumnHeaderData, setKVColumnHeaderData] = React.useState<
    {
      id: string;
      label: string;
    }[]
  >([]);
  const [selectedLookupField, setSelectedLookupField] =
    React.useState<ICustomField | null>(null);
  const [recordData, setRecordData] = React.useState<
    Record<string, { data: any[]; itemsCount: number; currentPage: number }>
  >({});

  const [fieldLevelPermission, setFieldLevelPermission] = React.useState<{
    permission: boolean;
    message: null | string;
  }>({
    permission: true,
    message: null,
  });

  const [getLookupData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [getSingleLookupData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const fetchDataFunction = (
    filter: {
      name: string;
      operator: string;
      value: null | any[];
    }[],
    backgroundLoading: boolean
  ) => {
    if (!KVData) return;
    if (backgroundLoading) setRecordDataLoading(true);
    let recordDataDict: Record<
      string,
      {
        data: any[];
        itemsCount: number;
        currentPage: number;
      }
    > = {};
    const selectedField = selectedFieldFinder(fieldsList, KVData.categorizeBy);
    const dependentParentField =
      modelName === "deal" && KVData.categorizeBy === "dealStageId"
        ? null
        : selectedField?.parentFieldUniqueName
        ? fieldsList.filter(
            (field) => field.uniqueName === selectedField?.parentFieldUniqueName
          )[0]
        : null;
    const dependentParentFieldName =
      modelName === "deal" && KVData.categorizeBy === "dealStageId"
        ? "dealPipelineId"
        : dependentParentField && dependentParentField.visible
        ? dependentParentField.systemDefined
          ? dependentParentField.name
          : `fields.${dependentParentField.name}`
        : "";

    const currencyField = KVData?.aggregateBy ? "currency" : "";
    const promiseArray = KVColumnHeaderData.map(async (val) => {
      recordDataDict = {
        ...recordDataDict,
        [val.id]: { data: [], itemsCount: 0, currentPage: 1 },
      };

      const fieldsArray = [
        ...KVData.availableFields,
        KVData.categorizeBy,
        KVData.aggregateBy,
        KVData.currencyType,
        dependentParentFieldName,
        currencyField,
      ]
        .concat(
          KVData.aggregateBy === "expectedRevenue"
            ? ["amount", "probability"]
            : [""]
        )
        .filter((val) => val);

      const response = await getLookupData({
        variables: {
          modelName: modelName,
          fields: fieldsArray,
          filters:
            updatedNewFiltersForCurrentCustomView &&
            updatedNewFiltersForCurrentCustomView?.length > 0
              ? [
                  ...updatedNewFiltersForCurrentCustomView,
                  {
                    name: KVData.categorizeBy,
                    operator: "eq",
                    value: val.id,
                  },
                  { name: "recordStatus", operator: "in", value: ["a", "i"] },
                ]
              : [
                  ...filter,
                  {
                    name: KVData.categorizeBy,
                    operator: "eq",
                    value: val.id,
                  },
                  { name: "recordStatus", operator: "in", value: ["a", "i"] },
                ],
          expression:
            updatedNewFiltersForCurrentCustomView &&
            updatedNewFiltersForCurrentCustomView?.length > 0
              ? expressionGenerator(
                  [
                    ...updatedNewFiltersForCurrentCustomView,
                    {
                      name: KVData?.categorizeBy,
                      operator: "eq",
                      value: val.id,
                      logicalOperator: "AND",
                    },
                  ],
                  filter ? updatedNewFiltersForCurrentCustomView?.length : 0
                )
              : expressionGenerator(
                  [
                    ...filter,
                    {
                      name: KVData?.categorizeBy,
                      operator: "eq",
                      value: val.id,
                      logicalOperator: "AND",
                    },
                  ],
                  filter ? filter?.length : 0
                ),
        },
      });
      return response;
    });
    Promise.all(promiseArray).then((response) => {
      let responseDataArray: any[] = [];
      let fieldPermissionError = "";
      response?.forEach((resData) => {
        if (resData?.data?.fetch.messageKey === "field-permission-required") {
          fieldPermissionError = resData?.data?.fetch.message;
          return;
        }
        if (resData?.data?.fetch.data?.length) {
          responseDataArray = [
            ...responseDataArray,
            ...resData?.data.fetch.data,
          ];
          recordDataDict = {
            ...recordDataDict,
            [resData?.data.fetch.data[0][KVData.categorizeBy]]: {
              data: resData?.data.fetch.data.map((record: any) => {
                let mapData = {};
                for (const key in record) {
                  if (key !== "fields" && key.split(".")[0] === "fields") {
                    mapData = { ...mapData, [key.split(".")[1]]: record[key] };
                  } else {
                    mapData = { ...mapData, [key]: record[key] };
                  }
                }
                return mapData;
              }),
              itemsCount: resData?.data.fetch.count,
              currentPage: 1,
            },
          };
        }
      });
      if (fieldPermissionError) {
        setFieldLevelPermission({
          permission: false,
          message: fieldPermissionError,
        });
      } else {
        setFieldLevelPermission({
          permission: true,
          message: null,
        });
      }
      setKVRecordData(responseDataArray);
      setRecordData(recordDataDict);
      if (backgroundLoading) setRecordDataLoading(false);
    });
  };

  const onPageChange = (pageNumber: number, columnId: string) => {
    if (KVData) {
      setPageLoader(columnId);
      const selectedField = selectedFieldFinder(
        fieldsList,
        KVData.categorizeBy
      );
      const dependentParentField =
        modelName === "deal" && KVData.categorizeBy === "dealStageId"
          ? null
          : selectedField?.parentFieldUniqueName
          ? fieldsList.filter(
              (field) =>
                field.uniqueName === selectedField?.parentFieldUniqueName
            )[0]
          : null;
      const dependentParentFieldName =
        modelName === "deal" && KVData.categorizeBy === "dealStageId"
          ? "dealPipelineId"
          : dependentParentField && dependentParentField.visible
          ? dependentParentField.systemDefined
            ? dependentParentField.name
            : `fields.${dependentParentField.name}`
          : "";

      const currencyField = KVData?.aggregateBy ? "currency" : "";
      const fieldsArray = [
        ...KVData.availableFields,
        KVData.categorizeBy,
        KVData.aggregateBy,
        KVData.currencyType,
        dependentParentFieldName,
        currencyField,
      ]
        .concat(
          KVData.aggregateBy === "expectedRevenue"
            ? ["amount", "probability"]
            : [""]
        )
        .filter((val) => val);

      getSingleLookupData({
        variables: {
          modelName: modelName,
          fields: [...fieldsArray],
          filters: [
            {
              name: KVData.categorizeBy,
              operator: "eq",
              value: columnId,
            },
            { name: "recordStatus", operator: "in", value: ["a", "i"] },
          ],
          pageNumber: pageNumber,
        },
      }).then((response) => {
        if (response.data.fetch?.data?.length) {
          const updatedRecordData = {
            ...recordData,
            [columnId]: {
              data: response.data.fetch?.data,
              itemsCount: response.data.fetch?.count,
              currentPage: pageNumber,
            },
          };
          let filteredKVRecordDataList = [];
          for (const KVRecord of KVRecordData) {
            let found = false;
            for (const columnRecord of recordData[columnId]?.data) {
              if (columnRecord.id === KVRecord.id) found = true;
            }
            if (!found) filteredKVRecordDataList.push(KVRecord);
          }
          filteredKVRecordDataList = [
            ...filteredKVRecordDataList,
            response.data.fetch?.data,
          ];
          setKVRecordData(filteredKVRecordDataList);
          setRecordData(updatedRecordData);
        }
        setPageLoader(null);
      });
    }
  };

  const [fetchPipelineData] = useLazyQuery<
    FetchData<IPipelineMetadata>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  React.useEffect(() => {
    if (!appName) return;
    (async () => {
      if (fieldsList.length && KVData && kanbanViewPermission) {
        setKVDataLoading(true);
        setRecordDataLoading(true);
        const selectedField = selectedFieldFinder(
          fieldsList,
          KVData.categorizeBy
        );

        if (selectedField) {
          const fetchedStages: string[] = [];
          setSelectedLookupField({ ...selectedField });
          const columnHeaderData: {
            id: string;
            label: string;
            recordStatus: string;
          }[] = [];
          selectedField.dataTypeMetadata?.lookupOptions?.forEach(
            (val: {
              id: string;
              label: { en: string };
              recordStatus: string;
              order: number;
            }) => {
              if (val.order !== null) {
                columnHeaderData[val.order] = {
                  id: val.id,
                  label: val.label.en,
                  recordStatus: val.recordStatus,
                };
              } else {
                columnHeaderData.push({
                  id: val.id,
                  label: val.label.en,
                  recordStatus: val.recordStatus,
                });
              }
            }
          );
          if (selectedField.name === "dealStageId" && modelName === "deal") {
            await fetchPipelineData({
              variables: {
                modelName: "DealPipeline",
                fields: ["name", "stages", "isDefault", "recordStatus"],
                filters: [
                  { name: "recordStatus", operator: "in", value: ["a"] },
                ],
              },
            }).then((response) => {
              if (response?.data?.fetch?.data?.length) {
                response?.data?.fetch?.data.forEach((pipeline) => {
                  if (pipeline?.stages && Array.isArray(pipeline.stages))
                    fetchedStages.push(...pipeline.stages);
                });
                // setPipelineList(response?.data?.fetch?.data);
              } else {
                toast.error(
                  "Error while fetching pipelines, please contact admin"
                );
              }
            });
            const fetchedStagesSet: Set<string> = new Set(fetchedStages);
            let updatedStagesWithOrder: {
              id: string;
              label: string;
              recordStatus: string;
            }[] = [];
            fetchedStagesSet?.forEach((stage) => {
              const findIndex = columnHeaderData?.findIndex(
                (columnHeader) =>
                  columnHeader.recordStatus === "a" && columnHeader.id === stage
              );
              if (findIndex !== -1)
                updatedStagesWithOrder.push(columnHeaderData[findIndex]);
            });
            setKVColumnHeaderData([...updatedStagesWithOrder]);
          } else {
            setKVColumnHeaderData(
              columnHeaderData.filter((data) => data.recordStatus === "a")
            );
          }
          setKVDataLoading(false);
        }
      }
    })();
  }, [KVData, appName]);

  React.useEffect(() => {
    if (!kanbanViewPermission) return;
    if (
      !recordDataLoading ||
      KVDataLoading ||
      !isCategorizeByVisible ||
      !KVData ||
      KVData?.relatedModule !== modelName
    )
      return;
    fetchDataFunction(currentCustomViewFilter.filters, true);
  }, [KVColumnHeaderData, updatedNewFiltersForCurrentCustomView]);

  React.useEffect(() => {
    if (!kanbanViewPermission) return;
    if (
      KVDataLoading ||
      !isCategorizeByVisible ||
      !KVData ||
      KVData?.relatedModule !== modelName
    )
      return;
    fetchDataFunction(currentCustomViewFilter.filters, true);
  }, [currentCustomViewFilter.filters, updatedNewFiltersForCurrentCustomView]);

  React.useEffect(() => {
    if (kanbanViewPermission && kanbanViewBulkDeleteRecords?.length) {
      let updatedData = { ...recordData };
      for (const key in recordData) {
        const filteredData = recordData[key]?.data.filter((data) => {
          let found = false;
          kanbanViewBulkDeleteRecords?.forEach((id) => {
            if (id === data.id) found = true;
          });
          return !found;
        });
        if (recordData[key]?.data?.length !== filteredData?.length)
          updatedData[key] = {
            ...recordData[key],
            data: filteredData,
            itemsCount:
              recordData[key]?.itemsCount -
              (recordData[key]?.data?.length - filteredData?.length),
          };
      }
      setRecordData(updatedData);
      setKanbanViewBulkDeleteRecords(null);
    }
  }, [kanbanViewBulkDeleteRecords]);

  React.useEffect(() => {
    if (!kanbanViewPermission) {
      toast.error("User does not have permission to view Kanban View");
    }
  }, [kanbanViewPermission]);

  return kanbanViewPermission ? (
    <KanbanViewContainer
      KVData={KVData}
      setRecordData={setRecordData}
      selectedLookupField={selectedLookupField}
      recordData={recordData}
      appName={appName}
      modelName={modelName}
      fieldsList={fieldsList}
      KViewDataLoading={KViewDataLoading}
      loadingItemCount={loadingItemCount}
      KVDataLoading={KVDataLoading}
      recordDataLoading={recordDataLoading}
      KVColumnHeaderData={KVColumnHeaderData}
      selectedItems={selectedItems}
      dataProcessed={dataProcessed}
      dataProcessing={dataProcessing}
      onItemSelect={onItemSelect}
      onMultiItemSelect={onMultiItemSelect}
      onPageChange={onPageChange}
      pageLoader={pageLoader}
      foundNewData={foundNewData}
      setFoundNewData={setFoundNewData}
      deleteModalVisible={deleteModalVisible}
      backgroundProcessRunning={backgroundProcessRunning}
      setSelectItemsOnAllPages={setSelectItemsOnAllPages}
      fetchDataFunction={fetchDataFunction}
      currentCustomViewFilter={currentCustomViewFilter}
      fieldLevelPermission={fieldLevelPermission}
      openingRecordId={openingRecordId}
      setOpeningRecordId={setOpeningRecordId}
      isCategorizeByVisible={isCategorizeByVisible}
      instances={instances}
      genericModels={genericModels}
    />
  ) : (
    <NoViewPermission customMessage="Looks like you do not have permission to view Kanban View" />
  );
};
