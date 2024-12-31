import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import { AddPipelineModal } from "./AddPipelineModal";
import { DealPipelineList } from "./DealPipelineList";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { IPipelineMetadata, IStageMetadata } from "./ConnectedDealPipeline";
import React, { Dispatch, SetStateAction } from "react";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { FormikValues } from "formik";

export const DealPipelineContainer = ({
  pipelineList,
  globalStagesList,
  handlePipelineDefault,
  appName,
  modelName,
  setRefetchPipelineData,
  stageUpdated,
  manipulatePipeline,
}: {
  pipelineList: IPipelineMetadata[];
  globalStagesList: IStageMetadata[];
  handlePipelineDefault: (pipelineItem: IPipelineMetadata) => void;
  appName: string;
  modelName: string;
  setRefetchPipelineData: Dispatch<SetStateAction<boolean>>;
  stageUpdated: boolean;
  manipulatePipeline: (
    id: string,
    saveInput: {
      name: string;
      isDefault?: boolean;
      stages?: string[];
      recordStatus?: string;
    },
    updateGlobalStageList?: boolean
  ) => void;
}) => {
  const [formModal, setFormModal] = React.useState({
    visible: false,
    id: "",
    editMode: false,
    name: "",
  });

  const handleCreatePipeline = (pipelineId: string, values: FormikValues) => {
    if (pipelineId === "") {
      const saveInput = {
        name: values.pipelineName as string,
      };
      manipulatePipeline("", saveInput);
    } else {
      const saveInput = {
        name: values.pipelineName,
      };
      manipulatePipeline(pipelineId, saveInput);
    }
  };

  const handlePipelineStageUpdate = (
    pipelineItem: IPipelineMetadata,
    stagesIdArray: string[],
    updateGlobalStageList = false
  ) => {
    const saveInput = {
      name: pipelineItem.name,
      isDefault: pipelineItem.isDefault,
      stages: stagesIdArray,
      recordStatus: pipelineItem.recordStatus,
    };
    manipulatePipeline(pipelineItem.id, saveInput, updateGlobalStageList);
  };

  const handlePipelineStatusToggle = (pipelineItem: IPipelineMetadata) => {
    const saveInput = {
      name: pipelineItem.name,
      isDefault: pipelineItem.isDefault,
      stages: pipelineItem.stages,
      recordStatus: pipelineItem.recordStatus === "a" ? "i" : "a",
    };
    manipulatePipeline(pipelineItem.id, saveInput);
  };

  const handleUpdateFormModal = (value: {
    visible: boolean;
    id: string;
    editMode: boolean;
    name: string;
  }) => {
    setFormModal(value);
  };

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 24);
    }
  });

  return (
    <>
      <GenericBackHeader heading={"Deal Pipeline"} addButtonInFlexCol={true}>
        <div className="col-span-3 sm:col-span-2">
          <Button
            id="create-new-pipeline"
            onClick={() => {
              handleUpdateFormModal({
                visible: true,
                id: "",
                editMode: false,
                name: "",
              });
            }}
            buttonType="thin"
            kind="primary"
            userEventName="open-add-pipeline-modal-click"
          >
            <div className="flex">
              <CircleIcon size={20} className="mr-1" />
              <span>Create New</span>
            </div>
          </Button>
        </div>
      </GenericBackHeader>
      {pipelineList.length ? (
        <div className={`px-6 sm:pt-6`}>
          <div
            ref={heightRef}
            className="bg-white py-6 px-4 w-full rounded-xl shadow-sm flex flex-row"
          >
            <div className="w-full h-full overflow-x-hidden overflow-y-auto pr-2 card-scroll">
              <DealPipelineList
                pipelineList={pipelineList}
                globalStagesList={globalStagesList}
                handlePipelineStatusToggle={handlePipelineStatusToggle}
                handlePipelineStageUpdate={handlePipelineStageUpdate}
                handlePipelineDefault={handlePipelineDefault}
                handlePipelineEdit={(item: IPipelineMetadata) => {
                  handleUpdateFormModal({
                    visible: true,
                    id: item.id,
                    editMode: true,
                    name: item.name,
                  });
                }}
                appName={appName}
                modelName={modelName}
                setRefetchPipelineData={setRefetchPipelineData}
                stageUpdated={stageUpdated}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <ItemsLoader currentView="List" loadingItemCount={4} />
        </div>
      )}
      {formModal.visible && (
        <>
          <AddPipelineModal
            onOutsideClick={() =>
              handleUpdateFormModal({
                visible: false,
                id: "",
                editMode: false,
                name: "",
              })
            }
            handleCreatePipeline={handleCreatePipeline}
            modalValues={formModal}
          />
          <Backdrop
            onClick={() =>
              handleUpdateFormModal({
                visible: false,
                id: "",
                editMode: false,
                name: "",
              })
            }
          />
        </>
      )}
    </>
  );
};
