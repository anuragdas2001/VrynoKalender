import DownArrow from "remixicon-react/ArrowDownSLineIcon";
import UpArrow from "remixicon-react/ArrowUpSLineIcon";
import ThumbUpIcon from "remixicon-react/ThumbUpFillIcon";
import ThumbDownIcon from "remixicon-react/ThumbDownFillIcon";
import LongRightArrowIcon from "remixicon-react/ArrowRightLineIcon";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { ClickOutsideToClose } from "../../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import React, { useContext } from "react";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { IStageMetadata } from "../../../../settings/customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";

export const GenericDealStagePipelineDetails = ({
  modelData,
  successOpen,
  failedOpen,
  handleSuccessOpen,
  handleFailedOpen,
  stagesData,
  saveLoading,
  handleStageSave,
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
  pipelineLabelDict: {
    dealName: string;
    expectedRevenue: string;
  };
}) => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const successRef = React.useRef(null);
  const failedRef = React.useRef(null);
  ClickOutsideToClose(successRef, (value: boolean) => handleSuccessOpen(false));
  ClickOutsideToClose(failedRef, (value: boolean) => handleFailedOpen(false));
  return (
    <div className="flex flex-col xl:flex-row gap-x-6 justify-between text-xs">
      <div className="flex flex-col lg:flex-row whitespace-nowrap lg:items-center">
        <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row">
          <div className="sm:border-r pr-4 w-full sm:w-1/2 lg:w-auto lg:max-w-[222px] xl:max-w-[264px] 2xl:max-w-none">
            <p className="text-vryno-dark-gray">{pipelineLabelDict.dealName}</p>
            <p className="font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
              {modelData?.name || "-"}
            </p>
          </div>
          <div className="lg:border-r p-0 sm:px-4 w-full sm:w-1/2 lg:w-auto">
            <div className="text-vryno-dark-gray">Start Date</div>
            <div className="font-semibold">
              {getDateAndTime(modelData?.createdAt, user ?? undefined)}
            </div>
          </div>
        </div>
        <div className="hidden lg:block border-r px-4">
          <LongRightArrowIcon size={30} className="text-vryno-gray" />
        </div>
        <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row mt-2 lg:mt-0">
          <div className="sm:border-r pr-4 lg:px-4 w-full sm:w-1/2 lg:w-auto">
            <p className="text-vryno-dark-gray">Closed At</p>
            <p className="font-semibold">
              {getDateAndTime(modelData?.closedAt, user ?? undefined)}
            </p>
          </div>
          <div className="p-0 sm:pl-4 w-full sm:w-1/2 lg:w-auto">
            <p className="text-vryno-dark-gray">
              {pipelineLabelDict.expectedRevenue}
            </p>
            <p className="font-semibold">{modelData?.expectedRevenue || "-"}</p>
          </div>
        </div>
      </div>

      <div className="flex mt-2 xl:mt-0">
        <div className="flex whitespace-nowrap mr-4">
          <ThumbUpIcon size={16} className="text-green-500 mr-1 mt-0.5" />
          <span className="mt-0.5">Success</span>
          <span>
            {successOpen ? (
              <span className="cursor-pointer relative" ref={successRef}>
                <Button
                  id="dealStagePipeline-success-stages-dropdown-close"
                  onClick={() => handleSuccessOpen(false)}
                  customStyle=""
                  userEventName="dealStagePipeline-success-stages-dropdown-close:action-click"
                >
                  <UpArrow className={"text-gray-500"} />
                </Button>
                <div className="absolute z-10 bg-white w-28 right-0 border flex flex-col overflow-y-scroll max-h-[137px]">
                  {stagesData.length ? (
                    stagesData
                      .filter((item) => item.dealCategory === "closed won")
                      .map((item, index: number) => {
                        return (
                          <Button
                            id={`success-${item.name.toLowerCase()}-stage`}
                            customStyle={`px-1 py-1 border-b min-h-[26px] ${
                              saveLoading
                                ? "bg-vryno-medium-fade-blue"
                                : "bg-vryno-light-fade-blue"
                            }`}
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStageSave(item);
                              handleSuccessOpen(false);
                            }}
                            disabled={saveLoading}
                            userEventName={`success-${item.name.toLowerCase()}-stage:item-click`}
                          >
                            <p
                              className={`text-left text-xs truncate ${
                                modelData?.dealStageId === item.id
                                  ? "text-gray-900"
                                  : "text-vryno-gray-text"
                              }`}
                            >
                              {item.name}
                            </p>
                          </Button>
                        );
                      })
                  ) : (
                    <></>
                  )}
                </div>
              </span>
            ) : (
              <span className="cursor-pointer">
                <Button
                  id="dealStagePipeline-success-stages-dropdown-open"
                  onClick={() => handleSuccessOpen(true)}
                  customStyle=""
                  userEventName="dealStagePipeline-success-stages-dropdown-open:action-click"
                >
                  <DownArrow className={"text-gray-500"} />
                </Button>
              </span>
            )}
          </span>
        </div>

        <div className="flex">
          <ThumbDownIcon size={16} className="text-red-500 mr-1 mt-0.5" />
          <span className="mt-0.5">Failed</span>
          <span>
            {failedOpen ? (
              <span className="cursor-pointer relative" ref={failedRef}>
                <Button
                  id="dealStagePipeline-failed-stages-dropdown-close"
                  onClick={() => handleFailedOpen(false)}
                  customStyle=""
                  userEventName="dealStagePipeline-failed-stages-dropdown-close:action-click"
                >
                  <UpArrow className={"text-gray-500"} />
                </Button>
                <div className="absolute z-10 bg-white w-28 right-0 border flex flex-col overflow-y-scroll max-h-[137px]">
                  {stagesData.length ? (
                    stagesData
                      .filter((item) => item.dealCategory === "closed lost")
                      .map((item, index: number) => {
                        return (
                          <Button
                            id={`failed-${item.name.toLowerCase()}-stage`}
                            customStyle={`px-1 py-1 border-b min-h-[26px] ${
                              saveLoading
                                ? "bg-vryno-medium-fade-blue"
                                : "bg-vryno-light-fade-blue"
                            }`}
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStageSave(item);
                              handleFailedOpen(false);
                            }}
                            disabled={saveLoading}
                            userEventName={`failed-${item.name.toLowerCase()}-stage:item-click`}
                          >
                            <p
                              className={`text-left text-xs truncate ${
                                modelData?.dealStageId === item.id
                                  ? "text-gray-900"
                                  : "text-vryno-gray-text"
                              }`}
                            >
                              {item.name}
                            </p>
                          </Button>
                        );
                      })
                  ) : (
                    <></>
                  )}
                </div>
              </span>
            ) : (
              <span className="cursor-pointer">
                <Button
                  id="dealStagePipeline-failed-stages-dropdown-open"
                  onClick={() => handleFailedOpen(true)}
                  customStyle=""
                  userEventName="dealStagePipeline-failed-stages-dropdown-open:action-click"
                >
                  <DownArrow className={"text-gray-500"} />
                </Button>
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
