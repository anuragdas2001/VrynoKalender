import { GenericDealStagePipelineDetails } from "./GenericDealStagePipelineDetails";
import { GenericDealStagePipelineCarousel } from "./GenericDealStagePipelineCarousel";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { IStageMetadata } from "../../../../settings/customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";

export const GenericDealStagePipelineContainer = ({
  modelData,
  successOpen,
  failedOpen,
  handleSuccessOpen,
  handleFailedOpen,
  stagesData,
  saveLoading,
  handleStageSave,
  dealStagesLoading,
  hasPipeline,
  pipelineLabelDict,
}: {
  modelData: any;
  successOpen: boolean;
  failedOpen: boolean;
  handleSuccessOpen: (value: boolean) => void;
  handleFailedOpen: (value: boolean) => void;
  stagesData: IStageMetadata[];
  saveLoading: boolean;
  handleStageSave: (stageData: IStageMetadata) => void;
  dealStagesLoading: boolean;
  hasPipeline: boolean;
  pipelineLabelDict: {
    dealName: string;
    expectedRevenue: string;
  };
}) => {
  return (
    <div className="px-6 pt-6">
      <GenericHeaderCardContainer
        cardHeading="Pipeline Details"
        extended={true}
        id="deal-pipeline"
        allowOverflow={true}
      >
        <div className="mt-5 relative z-10">
          <GenericDealStagePipelineDetails
            modelData={modelData}
            successOpen={successOpen}
            failedOpen={failedOpen}
            handleSuccessOpen={handleSuccessOpen}
            handleFailedOpen={handleFailedOpen}
            stagesData={stagesData}
            saveLoading={saveLoading}
            handleStageSave={handleStageSave}
            pipelineLabelDict={pipelineLabelDict}
          />
          <GenericDealStagePipelineCarousel
            dealStagesLoading={dealStagesLoading}
            hasPipeline={hasPipeline}
            stagesData={stagesData}
            modelData={modelData}
            saveLoading={saveLoading}
            handleStageSave={handleStageSave}
          />
        </div>
      </GenericHeaderCardContainer>
    </div>
  );
};
