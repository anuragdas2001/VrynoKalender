import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import React from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { IWorkflowRule } from "../../../../../models/shared";
import { WorkFlowScreen } from "./WorkFlowScreen";
import { toast } from "react-toastify";

const workflowRuleVariables = {
  modelName: "rule",
  fields: [
    "id",
    "name",
    "recordModuleName",
    "typeConfig",
    "typeKey",
    "description",
    "recordStatus",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  filters: [
    {
      operator: "in",
      name: "recordStatus",
      value: ["a", "i"],
    },
  ],
};

export const ConnectedWorkFlowScreen = () => {
  const { t } = useTranslation();
  const [rules, setRules] = React.useState<IWorkflowRule[]>([]);
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [currentPageNumber, setCurrentpageNumber] = React.useState<number>(1);
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
  const [statusChangeProcess, setStatusChangeProcess] = React.useState(false);

  const [getWorkflowActions] = useLazyQuery<
    FetchData<IWorkflowRule>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (responseOnCompletion) => {
      setDataFetchProcessing(false);
      if (responseOnCompletion?.fetch?.data?.length) {
        setRules(responseOnCompletion.fetch.data);
        setItemsCount(responseOnCompletion.fetch.count);
      } else if (
        responseOnCompletion?.fetch.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
        toast.error(responseOnCompletion?.fetch.message);
      }
    },
  });
  const [deleteWorkflowRule] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        setDeleteProcessing(false);
        setRules(
          rules.filter((rule) => rule.id !== responseOnCompletion.save.data.id)
        );
        setItemsCount(itemsCount - 1);
        Toast.success(`Workflow deleted successfully`);
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

  const [saveRule] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
  });

  const handleStatusChange = (id: string, recordStatus: "a" | "i") => {
    saveRule({
      variables: {
        id: id,
        modelName: "rule",
        saveInput: { recordStatus: recordStatus },
      },
    }).then(async (responseOnCompletionRule) => {
      if (
        responseOnCompletionRule?.data?.save?.data &&
        responseOnCompletionRule.data.save.messageKey.includes("-success")
      ) {
        setRules(
          rules.map((rule) => {
            if (rule.id === responseOnCompletionRule.data.save.data.id) {
              rule.recordStatus = recordStatus;
            }
            return rule;
          })
        );
        setStatusChangeProcess(false);
        Toast.success(responseOnCompletionRule.data.save.message);
      } else {
        setStatusChangeProcess(false);
        if (responseOnCompletionRule?.data?.save?.messageKey) {
          Toast.error(responseOnCompletionRule.data.save.message);
          return;
        }
        Toast.error(t("common:unknown-message"));
      }
    });
  };

  React.useEffect(() => {
    getWorkflowActions({
      variables: workflowRuleVariables,
    });
  }, []);

  return (
    <>
      <WorkFlowScreen
        rules={rules}
        dataFetchLoading={dataFetchProcessing}
        viewPermission={viewPermission}
        deleteWorkFlowRule={(item) =>
          setDeleteModal({ visible: true, id: item.id })
        }
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => {
          setCurrentpageNumber(pageNumber);
          getWorkflowActions({
            variables: { ...workflowRuleVariables, pageNumber: pageNumber },
          });
        }}
        filterValue={filterValue}
        setFilterValue={(value) => setFilterValue(value)}
        statusChangeProcess={statusChangeProcess}
        handleStatusChange={handleStatusChange}
        setStatusChangeProcess={(value) => setStatusChangeProcess(value)}
      />
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete Workflow`}
            modalMessage={`Are you sure you want to delete this Rule?`}
            loading={deleteProcessing}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={async () => {
              setDeleteProcessing(true);
              await deleteWorkflowRule({
                variables: {
                  id: deleteModal.id,
                  modelName: "rule",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              }).then();
              if (rules.length === 1) {
                getWorkflowActions({
                  variables: {
                    ...workflowRuleVariables,
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
};
