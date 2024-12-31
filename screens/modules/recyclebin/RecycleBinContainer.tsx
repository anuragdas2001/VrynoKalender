import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IBaseModuleRecord, SupportedApps } from "../../../models/shared";
import { getModelName } from "./RecycleBinScreen";
import { RecycleBinItemList } from "./RecycleBinItemList";
import { RecycleBinModals } from "./RecycleBinModals";
import { getSortedFieldList } from "../crm/shared/utils/getOrderedFieldsList";
import { LazyQueryExecFunction } from "@apollo/client";
import { FetchData, FetchVars } from "../../../graphql/queries/fetchQuery";
import { ICustomField } from "../../../models/ICustomField";
import { INavigation } from "../../../models/INavigation";
import { IGenericModel } from "../../../stores/RootStore/GeneralStore/GenericModelStore";
import { useGetProcessedData } from "../crm/generic/GenericModelView/ViewUtils/useGetProcessedData";
import { getDataObjectArray } from "../crm/shared/utils/getDataObject";

export const RecycleBinContainer = ({
  appName,
  modelName,
  fetchDeletedRecords,
  itemsCount,
  currentPageNumber,
  deletedRecords,
  navigations,
  deleteRecordsDataLoading,
  genericModels,
  allLayoutFetched,
  setCurrentPageNumber,
  setDeleteRecordsDataLoading,
  setDeletedRecords,
  setItemsCount,
}: {
  appName: SupportedApps;
  modelName: string;
  fetchDeletedRecords: LazyQueryExecFunction<
    FetchData<IBaseModuleRecord>,
    FetchVars
  >;
  itemsCount: number;
  currentPageNumber: number;
  deletedRecords: IBaseModuleRecord[];
  navigations: INavigation[];
  deleteRecordsDataLoading: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  setCurrentPageNumber: (value: number) => void;
  setDeleteRecordsDataLoading: (value: boolean) => void;
  setDeletedRecords: (value: IBaseModuleRecord[]) => void;
  setItemsCount: (value: number) => void;
}) => {
  const router = useRouter();

  // Optimization to do: rather than fetching data each time on module change for fieldsList, create an object with
  // {modelName: fieldsList} and check if it exists in the object, if not then fetch data or use a context to store
  // the fieldsList
  const [fieldsList, setFieldsList] = useState<ICustomField[]>([]);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [restoreModal, setRestoreModal] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<IBaseModuleRecord[]>([]);
  const [getAllItemsFetchLoading, setGetAllItemsFetchLoading] =
    useState<boolean>(false);

  const selectItemHandler = (item: IBaseModuleRecord) => {
    if (selectedItems.filter((sItem) => sItem.id === item.id).length === 0) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((sItem) => sItem.id !== item.id));
    }
  };

  const handleSelectItemsOnAllPages = async (
    totalItems: number,
    pageSize: number
  ) => {
    setGetAllItemsFetchLoading(true);
    const pagesCount = Math.ceil(totalItems / pageSize);
    let i = 0;
    let selectItemsOnAllPages: IBaseModuleRecord[] = [];
    while (i < pagesCount) {
      await fetchDeletedRecords({
        variables: {
          modelName: getModelName(modelName),
          fields: ["name", "updatedBy", "updatedAt", "recordStatus"],
          filters: [
            {
              name: "recordStatus",
              operator: "eq",
              value: "d",
            },
          ],
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
    setGetAllItemsFetchLoading(false);
    setSelectedItems(selectItemsOnAllPages);
  };

  useEffect(() => {
    if (modelName && allLayoutFetched) {
      let fieldsListFromStore =
        genericModels[getModelName(modelName)]?.fieldsList;
      if (fieldsListFromStore?.length > 0) {
        setFieldsList(getSortedFieldList(fieldsListFromStore));
      }
    }
  }, [modelName, allLayoutFetched]);

  useEffect(() => {
    if (modelName) {
      fetchDeletedRecords({
        variables: {
          modelName: getModelName(modelName),
          fields: ["name", "updatedBy", "updatedAt", "recordStatus"],
          filters: [
            {
              name: "recordStatus",
              operator: "eq",
              value: "d",
            },
          ],
        },
      }).then((response) => {
        if (response?.data?.fetch?.message.includes("success")) {
          setDeletedRecords(response?.data?.fetch.data);
          setItemsCount(response?.data?.fetch.count);
        }
        setDeleteRecordsDataLoading(false);
      });
    }
  }, [modelName]);

  const updatedModelData =
    useGetProcessedData(
      deletedRecords?.length > 0 ? getDataObjectArray(deletedRecords) : [],
      fieldsList?.length > 0 ? fieldsList : [],
      currentPageNumber,
      false,
      false,
      genericModels,
      false,
      () => {}
    ) ?? [];

  return (
    <>
      <RecycleBinItemList
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        deletedRecords={
          updatedModelData?.length > 0
            ? [...updatedModelData]
            : [...deletedRecords]
        }
        getAllItemsFetchLoading={getAllItemsFetchLoading}
        handleSelectItemsOnAllPages={(totalItems, pageSize) =>
          handleSelectItemsOnAllPages(totalItems, pageSize)
        }
        sideMenuItems={navigations?.filter(
          (navigation) => navigation.groupKey === "default-navigation"
        )}
        selectItemHandler={(item) => selectItemHandler(item)}
        selectAllItems={() => {
          if (selectedItems.length === deletedRecords.length) {
            setSelectedItems([]);
          } else {
            const recycleBinSessionData = JSON.parse(
              sessionStorage.getItem("bulkProcessRecycleBinData") || "{}"
            );
            const data = recycleBinSessionData?.[modelName] || {};
            const idsToCheck: string[] = [];
            for (const key in data) {
              if (data[key]?.length) idsToCheck.push(...data[key]);
            }
            if (idsToCheck.length) {
              setSelectedItems(
                updatedModelData?.length > 0
                  ? [
                      ...updatedModelData.filter(
                        (data) => !idsToCheck?.includes(data.id)
                      ),
                    ]
                  : [...deletedRecords].filter(
                      (data) => !idsToCheck?.includes(data.id)
                    )
              );
            } else {
              setSelectedItems(
                updatedModelData?.length > 0
                  ? [...updatedModelData]
                  : [...deletedRecords]
              );
            }
          }
        }}
        fieldsList={fieldsList}
        selectedItems={selectedItems}
        setSelectedItems={(items) => setSelectedItems(items)}
        sideMenuLoading={navigations.length === 0 ? true : false}
        pageLoading={deleteRecordsDataLoading}
        modelName={modelName}
        onMenuItemChange={(item) => {
          setCurrentPageNumber(1);
          setSelectedItems([]);
          router?.replace(`${appName}/rb-${item.name}`);
        }}
        deleteSelectedItemsPermanently={() => setDeleteModal(true)}
        restoreSelectedItemsBack={() => setRestoreModal(true)}
        onPageChange={(pageNumber) => {
          setCurrentPageNumber(pageNumber);
          setDeleteRecordsDataLoading(true);
          fetchDeletedRecords({
            variables: {
              modelName: getModelName(modelName),
              fields: ["name", "updatedBy", "updatedAt", "recordStatus"],
              filters: [
                {
                  name: "recordStatus",
                  operator: "eq",
                  value: "d",
                },
              ],
              pageNumber: pageNumber,
            },
          }).then((response) => {
            if (response?.data?.fetch?.message.includes("success")) {
              setDeletedRecords(response?.data?.fetch.data);
              setItemsCount(response?.data?.fetch.count);
            }
            setDeleteRecordsDataLoading(false);
          });
        }}
        navigations={navigations}
        currentLabel={`${modelName
          ?.replace("rb", "")[0]
          ?.toLowerCase()}${modelName?.replace("rb", "").slice(1)}`}
      />
      {(deleteModal || restoreModal) && (
        <RecycleBinModals
          modalType={deleteModal ? "delete" : "recycle"}
          modelName={modelName}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setRecycleBinModal={
            deleteModal
              ? () => setDeleteModal(false)
              : () => setRestoreModal(false)
          }
        />
      )}
    </>
  );
};
