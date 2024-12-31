import Switch from "react-switch";
import ButtonWithDropdown from "../../../../../../components/TailwindControls/Form/Button/ButtonWithDropdown";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import { DealStagesTable } from "./DealStagesTable";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import CheckBox from "../../../../../../components/TailwindControls/Form/Checkbox/CheckBox";
import { IPipelineMetadata, IStageMetadata } from "./ConnectedDealPipeline";
import GenericHeaderCardContainerTransparentBackground from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainerTransparentDropdown";
import { toast } from "react-toastify";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { IDealPipelineLaunchStagesArray } from "./DealPipelineItem";

export const DealPipelineItemContent = ({
  item,
  handlePipelineStatusToggle,
  handlePipelineDefault,
  handlePipelineEdit,
  extended,
  getExtendedValue,
  launchStagesArray,
  stagesData,
  handleOrderUpdate,
  handleStageToggle,
  handleShowAddStageModal,
}: {
  item: IPipelineMetadata;
  handlePipelineStatusToggle: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineDefault: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineEdit: (pipelineItem: IPipelineMetadata) => void;
  extended: boolean;
  getExtendedValue: (extendedValue: boolean) => void;
  launchStagesArray: IDealPipelineLaunchStagesArray[];
  stagesData: IStageMetadata[];
  handleOrderUpdate: (record: IStageMetadata, move: string) => void;
  handleStageToggle: (record: IStageMetadata) => void;
  handleShowAddStageModal: (
    visible: boolean,
    stageData: IStageMetadata | null
  ) => void;
}) => {
  return (
    <GenericHeaderCardContainerTransparentBackground
      cardHeading={item.name}
      extended={extended}
      key={item.id}
      getExtendedValue={getExtendedValue}
      marginBottom={"mb-4"}
    >
      <div className="pt-3">
        <div className="text-xsm flex flex-wrap md:flex-nowrap justify-between items-center pl-5 gap-6">
          <div className="flex">
            <span className="text-gray-500 mr-2">Name:</span>
            <span>{item.name}</span>
            <Button
              id="deal-pipeline-item-edit"
              onClick={() => {
                handlePipelineEdit(item);
              }}
              customStyle="flex"
              userEventName="dealPipeline-item-edit:action-click"
            >
              <EditBoxIcon
                size={20}
                className="text-vryno-theme-light-blue cursor-pointer ml-4"
              />
            </Button>
          </div>
          <div className="flex items-center gap-1 justify-between md:justify-end grow lg:gap-8">
            <div>
              <CheckBox
                onChange={() => {
                  if (item.isDefault) {
                    toast.error("Error: Must have a default pipeline.");
                    return;
                  }
                  handlePipelineDefault(item);
                }}
                name={"pipeline-default"}
                label={"Default"}
                value={item.isDefault}
                labelSize="text-xsm"
                checkboxGap={2}
              />
            </div>
            <div className="flex items-center">
              <Switch
                id={"pipeline-status-toggle"}
                name={"status"}
                onChange={() => handlePipelineStatusToggle(item)}
                value={item.recordStatus}
                checked={item.recordStatus === "a" ? true : false}
                onColor="#4DBE8D"
                offColor="#DBDBDB"
                width={44}
                height={23}
                handleDiameter={12}
                disabled={true}
              />
              <span className="text-gray-500 ml-2">Status</span>
            </div>
            <ButtonWithDropdown
              id={`create-new-${item.name}-stage`}
              dropdownTop={"top-7"}
              onClick={() => {
                handleShowAddStageModal(true, null);
              }}
              kind="primary"
              launchMenuArray={
                launchStagesArray.length
                  ? launchStagesArray
                  : [
                      {
                        label: "No unique stages",
                        onClick: () => {},
                        visible: true,
                        labelClasses:
                          "text-vryno-dropdown-icon bg-vryno-select",
                      },
                    ]
              }
            >
              <span
                className={`px-2 sm:px-4 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
              >
                <CircleIcon size={20} className="sm:mr-1" />
                <span className={`hidden sm:flex truncate`}>Stage</span>
              </span>
            </ButtonWithDropdown>
          </div>
        </div>
        <div className="md:px-8">
          <DealStagesTable
            stagesData={stagesData}
            handleOrderUpdate={handleOrderUpdate}
            handleStageToggle={handleStageToggle}
            handleShowAddStageModal={handleShowAddStageModal}
          />
        </div>
      </div>
    </GenericHeaderCardContainerTransparentBackground>
  );
};
