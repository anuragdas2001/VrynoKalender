import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
} from "@apollo/client";
import {
  DeleteInstanceData,
  DeleteInstanceVars,
} from "../../../graphql/mutations/instances";
import DeleteModal from "../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import React from "react";

export function InstanceDeleteModal({
  deleteModal,
  deleteInstanceProcessing,
  setDeleteModal,
  serverDeleteInstance,
  setDeleteInstanceProcessing,
}: {
  deleteModal: IDeleteModalState;
  deleteInstanceProcessing: boolean;
  setDeleteModal: (
    value:
      | ((prevState: IDeleteModalState) => IDeleteModalState)
      | IDeleteModalState
  ) => void;
  serverDeleteInstance: (
    options?: MutationFunctionOptions<
      DeleteInstanceData,
      DeleteInstanceVars,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult<DeleteInstanceData>>;
  setDeleteInstanceProcessing: (value: boolean) => void;
}) {
  if (!deleteModal.visible) {
    return null;
  }
  return (
    <>
      <DeleteModal
        id={deleteModal.id}
        modalHeader="Delete Instance"
        modalMessage="Are you sure you want to delete this instance?"
        leftButton="Cancel"
        rightButton="Delete"
        loading={deleteInstanceProcessing}
        onCancel={() => setDeleteModal({ visible: false, id: "" })}
        onDelete={(id) => {
          setDeleteInstanceProcessing(true);
          serverDeleteInstance({
            variables: {
              id: deleteModal.id,
            },
          }).then();
        }}
        onOutsideClick={() => setDeleteModal({ visible: false, id: "" })}
      />
      <Backdrop onClick={() => setDeleteModal({ visible: false, id: "" })} />
    </>
  );
}
