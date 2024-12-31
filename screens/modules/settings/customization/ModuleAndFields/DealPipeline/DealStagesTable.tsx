import React from "react";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import Switch from "react-switch";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import { ActionWrapper } from "../../../../crm/shared/components/ActionWrapper";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { IStageMetadata } from "./ConnectedDealPipeline";

export const DealStagesTable = ({
  stagesData,
  handleOrderUpdate,
  handleStageToggle,
  handleShowAddStageModal,
}: {
  stagesData: IStageMetadata[];
  handleOrderUpdate: (record: IStageMetadata, move: string) => void;
  handleStageToggle: (currentStatus: IStageMetadata) => void;
  handleShowAddStageModal: (
    visible: boolean,
    stageData: IStageMetadata | null
  ) => void;
}) => {
  const stagesTableHeader = [
    {
      columnName: "order",
      label: "Order",
      dataType: SupportedDataTypes.singleline,
      render: (record: IStageMetadata) => {
        let order = record.order;
        return (
          <div className="flex">
            <Button
              id="deal-stage-table-up-arrow"
              onClick={() => handleOrderUpdate(record, "backward")}
              customStyle={`cursor-pointer w-6 h-6 rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue ${
                order === 0 ? "hidden" : "flex"
              }`}
              userEventName="dealStage-item-order-up:action-click"
            >
              <ArrowUpIcon size={16} className="text-white" />
            </Button>
            <Button
              id="deal-stage-table-down-arrow"
              onClick={() => handleOrderUpdate(record, "forward")}
              customStyle={`cursor-pointer w-6 h-6 rounded-md flex justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue ${
                order === stagesData.length - 1 ? "hidden" : "flex"
              }`}
              userEventName="dealStage-item-order-down:action-click"
            >
              <ArrowDownIcon size={16} className="text-white" />
            </Button>
          </div>
        );
      },
    },
    {
      columnName: "name",
      label: "Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "status",
      label: "Status",
      dataType: SupportedDataTypes.uuid,
      render: (record: IStageMetadata) => {
        return (
          <Switch
            id={"stage-status-toggle"}
            name={"stage-switch"}
            value={record.recordStatus}
            checked={record.recordStatus === "a" ? true : false}
            onChange={() => {
              handleStageToggle(record);
            }}
            onColor="#4DBE8D"
            offColor="#DBDBDB"
            width={44}
            height={23}
            handleDiameter={12}
          />
        );
      },
    },
    {
      label: "Actions",
      columnName: "actions",
      dataType: SupportedDataTypes.singleline,
      render: (item: IStageMetadata, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2 items-center">
                <EditBoxIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                  onClick={() => handleShowAddStageModal(true, item)}
                />
              </div>
            }
          />
        );
      },
    },
  ];

  return (
    <div className="flex justify-between items-center mt-5 overflow-x-scroll">
      <GenericList
        tableHeaders={stagesTableHeader}
        listSelector={false}
        data={stagesData}
        stickyHeader={false}
        oldGenericListUI={true}
      />
    </div>
  );
};
