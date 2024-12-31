import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
} from "@apollo/client";
import {
  UpdateInstanceData,
  UpdateInstanceVars,
} from "../../../graphql/mutations/instances";
import DeleteModal from "../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import React from "react";
import { SampleModalType } from "./InstanceDashboard";

export function InstanceRemoveSampleModal({
  removeSampleDataModal,
  sampleDataRemovalLoading,
  setRemoveSampleDataModal,
  setSampleDataRemovalLoading,
  UpdateInstance,
}: {
  removeSampleDataModal: SampleModalType;
  sampleDataRemovalLoading: boolean;
  setRemoveSampleDataModal: (
    value: ((prevState: SampleModalType) => SampleModalType) | SampleModalType
  ) => void;
  setSampleDataRemovalLoading: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void;
  UpdateInstance: (
    options?: MutationFunctionOptions<
      UpdateInstanceData,
      UpdateInstanceVars,
      DefaultContext,
      ApolloCache<unknown>
    >
  ) => Promise<FetchResult<UpdateInstanceData>>;
}) {
  if (!removeSampleDataModal.visible) {
    return null;
  }
  return (
    <>
      <DeleteModal
        id={removeSampleDataModal?.item?.id}
        modalHeader="Remove Sample Data"
        modalMessage="Are you sure you want to Remove Sample Data for this instance?"
        leftButton="Cancel"
        rightButton="Delete"
        loading={sampleDataRemovalLoading}
        onCancel={() =>
          setRemoveSampleDataModal({ visible: false, item: null })
        }
        onDelete={() => {
          setSampleDataRemovalLoading(true);
          UpdateInstance({
            variables: {
              id: removeSampleDataModal.item
                ? removeSampleDataModal.item.id
                : "",
              instance: {
                name: removeSampleDataModal.item
                  ? removeSampleDataModal.item.name
                  : "",
                isSample: false,
              },
            },
          }).then();
        }}
        onOutsideClick={() =>
          setRemoveSampleDataModal({ visible: false, item: null })
        }
      />
      <Backdrop
        onClick={() => setRemoveSampleDataModal({ visible: false, item: null })}
      />
    </>
  );
}
