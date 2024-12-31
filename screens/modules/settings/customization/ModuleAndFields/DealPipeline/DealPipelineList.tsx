import { DealPipelineItem } from "./DealPipelineItem";
import React, { Dispatch, SetStateAction } from "react";
import { IPipelineMetadata, IStageMetadata } from "./ConnectedDealPipeline";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

export const DealPipelineList = ({
  pipelineList,
  globalStagesList,
  handlePipelineStatusToggle,
  handlePipelineStageUpdate,
  handlePipelineDefault,
  handlePipelineEdit,
  appName,
  modelName,
  setRefetchPipelineData,
  stageUpdated,
}: {
  pipelineList: IPipelineMetadata[];
  globalStagesList: IStageMetadata[];
  handlePipelineStatusToggle: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineStageUpdate: (
    pipelineItem: IPipelineMetadata,
    stagesIdArray: string[],
    updateGlobalStageList?: boolean
  ) => void;
  handlePipelineDefault: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineEdit: (pipelineItem: IPipelineMetadata) => void;
  appName: string;
  modelName: string;
  setRefetchPipelineData: Dispatch<SetStateAction<boolean>>;
  stageUpdated: boolean;
}) => {
  return pipelineList ? (
    pipelineList?.map((item) => (
      <DealPipelineItem
        key={item.id}
        item={item}
        pipelineList={pipelineList}
        globalStagesList={globalStagesList}
        handlePipelineStatusToggle={handlePipelineStatusToggle}
        handlePipelineStageUpdate={handlePipelineStageUpdate}
        handlePipelineDefault={handlePipelineDefault}
        handlePipelineEdit={handlePipelineEdit}
        appName={appName}
        modelName={modelName}
        setRefetchPipelineData={setRefetchPipelineData}
        stageUpdated={stageUpdated}
      />
    ))
  ) : (
    <ItemsLoader currentView={"List"} loadingItemCount={2} />
  );
};
