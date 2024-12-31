import { useTranslation } from "next-i18next";
import React, { Dispatch, SetStateAction } from "react";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../components/TailwindControls/Modals/DeleteModal";
import { Toast } from "../../../components/TailwindControls/Toast";
import { IBaseModuleRecord } from "../../../models/shared";
import { getModelName } from "./RecycleBinScreen";
import { useMutation } from "@apollo/client";
import { mutationNameGenerator } from "../../../graphql/helpers/mutationNameGenerator";
import { SupportedMutationNames } from "../../../graphql/helpers/graphQLShared";
import { generateBulkUpdateMutation } from "../../../graphql/mutations/moduleUpdateMutation";

export type RecycleBinModalsProps = {
  modalType: "delete" | "recycle";
  setRecycleBinModal: () => void;
  selectedItems: IBaseModuleRecord[];
  modelName: string;
  setSelectedItems: Dispatch<SetStateAction<IBaseModuleRecord[]>>;
};

export const RecycleBinModals = ({
  modalType,
  setRecycleBinModal,
  selectedItems,
  modelName,
  setSelectedItems,
}: RecycleBinModalsProps) => {
  const { t } = useTranslation(["customizations", "common"]);

  const [deleteItemsLoading, setDeleteItemsLoading] =
    React.useState<boolean>(false);
  const [restoreItemsLoading, setRestoreItemsLoading] =
    React.useState<boolean>(false);

  const [bulkUpdateDelete] = useMutation(
    generateBulkUpdateMutation(getModelName(modelName)),
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
    }
  );

  const recycleMutationHelper = (operation: string, message: string) => {
    const mutationModelName = mutationNameGenerator(
      SupportedMutationNames.bulkUpdate,
      getModelName(modelName)
    );
    const itemIds = selectedItems.map((item) => item.id);
    bulkUpdateDelete({
      variables: {
        ids: itemIds,
        recordStatus: operation,
      },
    }).then((response) => {
      if (
        response?.data?.[mutationModelName]?.messageKey.includes("-success")
      ) {
        const responseId = response?.data?.[mutationModelName].id;
        Toast.success(t(response?.data?.[mutationModelName]?.message));
        setSelectedItems([]);
        const recycleBinSessionData = JSON.parse(
          sessionStorage.getItem("bulkProcessRecycleBinData") || "{}"
        );
        const updatedRecycleBinSessionData: { string: string[] } = {
          ...recycleBinSessionData,
          [modelName]: Object.keys(recycleBinSessionData?.[modelName] || {})
            ?.length
            ? {
                ...recycleBinSessionData[modelName],
                [responseId]: itemIds,
              }
            : {
                [responseId]: itemIds,
              },
        };
        sessionStorage.setItem(
          "bulkProcessRecycleBinData",
          JSON.stringify(updatedRecycleBinSessionData)
        );
      } else {
        Toast.error(response?.data?.[mutationModelName]?.message);
      }
      setDeleteItemsLoading(false);
      setRestoreItemsLoading(false);
      setRecycleBinModal();
    });
  };

  const deleteBinItemsHandler = async () => {
    if (selectedItems.length) {
      setDeleteItemsLoading(true);
      try {
        recycleMutationHelper("p", "Items deleted successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const restoreBinHandler = async () => {
    if (selectedItems.length) {
      setRestoreItemsLoading(true);
      try {
        recycleMutationHelper("a", "Items restored successfully");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <DeleteModal
        id={`${modalType}-selected-items`}
        modalHeader={`${
          modalType === "delete" ? "Permanent Delete" : "Restore Items"
        } `}
        modalMessage={`${
          modalType === "delete"
            ? "Do you want to permanently delete these items?"
            : "Do you wish to restore these items?"
        } `}
        loading={
          modalType === "delete" ? deleteItemsLoading : restoreItemsLoading
        }
        rightButton={`${modalType === "delete" ? "Delete" : "Restore"}`}
        onDelete={
          modalType === "delete"
            ? () => deleteBinItemsHandler()
            : () => restoreBinHandler()
        }
        onCancel={setRecycleBinModal}
        onOutsideClick={setRecycleBinModal}
      />
      <Backdrop />
    </>
  );
};
