import { useContext, useEffect, useState } from "react";
import { getAppPathParts } from "../crm/shared/utils/getAppPathParts";
import { IBaseModuleRecord } from "../../../models/shared";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../graphql/queries/fetchQuery";
import { Toast } from "../../../components/TailwindControls/Toast";
import { useCrmFetchLazyQuery } from "../crm/shared/utils/operations";
import { INavigation } from "../../../models/INavigation";
import React from "react";
import { useMassRecycleBinSessionId } from "../../../pages/recycle-bin/[[...slug]]";
import { RecycleBinContainer } from "./RecycleBinContainer";
import { ICustomField } from "../../../models/ICustomField";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";
import { camelCase } from "lodash";

export const getModelName = (modelName: string) => {
  return camelCase(modelName.replace("rb", ""));
};

export type RecycleBinItemListProps = {
  itemsCount: number;
  currentPageNumber: number;
  deletedRecords: IBaseModuleRecord[];
  selectedItems: IBaseModuleRecord[];
  sideMenuLoading: boolean;
  pageLoading: boolean;
  modelName: string;
  sideMenuItems: INavigation[];
  fieldsList: ICustomField[];
  getAllItemsFetchLoading: boolean;
  setSelectedItems: (items: IBaseModuleRecord[]) => void;
  selectAllItems: () => void;
  onMenuItemChange: (item: { label: string; name: string }) => void;
  selectItemHandler: (item: IBaseModuleRecord) => void;
  onPageChange: (pageNumber: number) => void;
  deleteSelectedItemsPermanently: () => void;
  restoreSelectedItemsBack?: () => void;
  handleSelectItemsOnAllPages?: (totalItems: number, pageSize: number) => void;
  navigations: INavigation[];
  currentLabel: string;
};

export const RecycleBinScreen = observer(() => {
  const { appName, modelName } = getAppPathParts();
  const [updatedModuleName, setUpdatedModuleName] = React.useState<string>("");
  const { navigations: storedNavigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched } = generalModelStore;
  const { massRecycleBinSessionId, setMassRecycleBinSessionId } =
    useMassRecycleBinSessionId();
  const [navigations, setNavigations] =
    useState<INavigation[]>(storedNavigations);
  const [deletedRecords, setDeletedRecords] = useState<IBaseModuleRecord[]>([]);
  const [deleteRecordsDataLoading, setDeleteRecordsDataLoading] =
    useState<boolean>(true);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);

  const [fetchDeletedRecords] = useLazyQuery<
    FetchData<IBaseModuleRecord>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onError: (error) => {
      Toast.error(error.message);
    },
  });

  const [fetchNavigations] = useCrmFetchLazyQuery<INavigation>({
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (navigations.length === 0) {
      fetchNavigations({
        variables: {
          modelName: "NavigationItem",
          fields: [
            "label",
            "groupKey",
            "uniqueName",
            "navType",
            "name",
            "visible",
            "order",
            "systemDefined",
            "parentNavigation",
            "navTypeMetadata",
          ],
          filters: [],
        },
      }).then((result) => {
        if (result?.data?.fetch?.data) {
          setNavigations(result.data.fetch.data);
        }
      });
    }
  }, [navigations]);

  React.useEffect(() => {
    if (modelName) {
      setUpdatedModuleName(getModelName(modelName));
    }
  }, [modelName]);

  React.useEffect(() => {
    if (massRecycleBinSessionId?.[updatedModuleName]?.length && appName) {
      setDeleteRecordsDataLoading(true);
      fetchDeletedRecords({
        variables: {
          modelName: updatedModuleName,
          fields: ["name", "updatedBy", "updatedAt", "recordStatus"],
          filters: [
            {
              name: "recordStatus",
              operator: "eq",
              value: "d",
            },
          ],
          pageNumber: currentPageNumber,
        },
      }).then((response) => {
        if (response?.data?.fetch?.message.includes("success")) {
          setDeletedRecords(response?.data?.fetch.data);
          setItemsCount(response?.data?.fetch.count);
        }
        setDeleteRecordsDataLoading(false);
      });
      setMassRecycleBinSessionId({
        ...massRecycleBinSessionId,
        [updatedModuleName]: [],
      });
    }
  }, [massRecycleBinSessionId?.[updatedModuleName], appName]);

  return (
    <RecycleBinContainer
      appName={appName}
      modelName={updatedModuleName}
      fetchDeletedRecords={fetchDeletedRecords}
      itemsCount={itemsCount}
      currentPageNumber={currentPageNumber}
      deletedRecords={deletedRecords}
      navigations={navigations}
      deleteRecordsDataLoading={deleteRecordsDataLoading}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
      setCurrentPageNumber={(value: number) => setCurrentPageNumber(value)}
      setDeleteRecordsDataLoading={(value: boolean) =>
        setDeleteRecordsDataLoading(value)
      }
      setDeletedRecords={(value: IBaseModuleRecord[]) =>
        setDeletedRecords(value)
      }
      setItemsCount={(value: number) => setItemsCount(value)}
    />
  );
});
