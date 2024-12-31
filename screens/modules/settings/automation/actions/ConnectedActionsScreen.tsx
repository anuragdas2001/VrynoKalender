import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { IWorkflowAction } from "../../../../../models/shared";
import { ActionsScreen } from "./ActionsScreen";
import { toast } from "react-toastify";
import { actionTypes, activitiesName } from "../shared/actionTypes";
import { observer } from "mobx-react-lite";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { UserStoreContext } from "../../../../../stores/UserStore";

export type ActionType = {
  label: string;
  value: string;
  moduleName?: string;
  groupBy?: string;
  onClick?: (item: any) => void;
};

const webhookUrlMethods = [
  { label: "POST", value: "post", visible: true },
  { label: "GET", value: "get", visible: false },
  { label: "PUT", value: "put", visible: false },
  { label: "DELETE", value: "delete", visible: false },
];

const actionsVariable = {
  modelName: "action",
  fields: [
    "id",
    "name",
    "recordModuleName",
    "recordServiceName",
    "typeConfig",
    "typeKey",
    "ruleId",
    "conditionId",
    "executorConfig",
    "executorTypeKey",
    "recordStatus",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  filters: [],
};

export const ConnectedActionScreens = observer(() => {
  const { t } = useTranslation();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { navigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allModulesFetched,
    allLayoutFetched,
    userPreferences,
  } = generalModelStore;
  const [actions, setActions] = React.useState<IWorkflowAction[]>([]);
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [dataFetchProcessing, setDataFetchProcessing] = React.useState(true);
  const [deleteProcessing, setDeleteProcessing] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({
    visible: false,
    id: null,
  });
  const [viewPermission, setViewPermission] = React.useState(true);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const [getAction] = useLazyQuery<FetchData<IWorkflowAction>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "workflow",
        },
      },
      onCompleted: (fetchedActionData) => {
        setDataFetchProcessing(false);
        if (fetchedActionData?.fetch?.data?.length) {
          setActions(fetchedActionData.fetch.data);
          setDataFetchProcessing(false);
          setItemsCount(fetchedActionData.fetch.count);
        } else if (
          fetchedActionData?.fetch.messageKey.includes("requires-view")
        ) {
          setViewPermission(false);
          toast.error(fetchedActionData?.fetch.message);
        }
      },
    }
  );

  const [deleteAction] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        setDeleteProcessing(false);
        setActions(
          actions.filter(
            (action) => action.id !== responseOnCompletion.save.data.id
          )
        );
        setItemsCount(itemsCount - 1);
        Toast.success(`Action deleted successfully`);
        return;
      }
      setDeleteProcessing(false);
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    },
  });

  React.useEffect(() => {
    getAction({
      variables: actionsVariable,
    });
  }, []);

  const handleUpdatedActions = (values: IWorkflowAction) => {
    let updatedActions = [...actions];
    const updatedIndex = updatedActions?.findIndex(
      (updatedAction) => updatedAction.id === values.id
    );
    if (updatedIndex === -1) {
      setActions([values, ...actions]);
      setItemsCount(itemsCount + 1);
    } else {
      updatedActions[updatedIndex] = values;
      setActions(updatedActions);
    }
  };

  return (
    <>
      <ActionsScreen
        actions={actions}
        actionTypes={actionTypes}
        webhookUrlMethods={webhookUrlMethods}
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => {
          setCurrentPageNumber(pageNumber);
          getAction({
            variables: { ...actionsVariable, pageNumber: pageNumber },
          });
        }}
        updateAction={(values: IWorkflowAction) => handleUpdatedActions(values)}
        dataFetchLoading={dataFetchProcessing}
        viewPermission={viewPermission}
        filterValue={filterValue}
        activitiesName={activitiesName}
        navigations={navigations}
        user={user}
        genericModels={genericModels}
        allModulesFetched={allModulesFetched}
        allLayoutFetched={allLayoutFetched}
        userPreferences={userPreferences}
        setFilterValue={(value) => setFilterValue(value)}
        deleteAction={(item) => setDeleteModal({ visible: true, id: item.id })}
      />
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete Action`}
            modalMessage={`Are you sure you want to delete this Action?`}
            loading={deleteProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={async () => {
              setDeleteProcessing(true);
              await deleteAction({
                variables: {
                  id: deleteModal.id,
                  modelName: "action",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              }).then();
              if (actions.length === 1) {
                getAction({
                  variables: {
                    ...actionsVariable,
                    pageNumber: currentPageNumber - 1,
                  },
                });
              }
              setDeleteModal({ visible: false, id: null });
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: null })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: null })}
          />
        </>
      )}
    </>
  );
});
