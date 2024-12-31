import TickCircleIcon from "remixicon-react/CheckboxCircleFillIcon";
import MinusCircleIcon from "remixicon-react/IndeterminateCircleFillIcon";
import CloseCircleIcon from "remixicon-react/CloseCircleFillIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";

export const TrackingDomainContainer = ({
  trackDomainRecords,
  trackDomainData,
  domainName,
  handleShowTrackingDomainRecord,
  handleTrackingDomainCheck,
}: {
  trackDomainRecords: any;
  trackDomainData: any;
  domainName: string;
  handleShowTrackingDomainRecord: () => void;
  handleTrackingDomainCheck: (id: string, trackDomain: string) => void;
}) => {
  return (
    <div className="mt-6">
      <p className="font-semibold">
        for <span className="text-vryno-theme-blue">{domainName}</span>
      </p>
      <p className="text-sm text-gray-400 mt-4">
        This is the domain that requests for tracked links, will be directed
        through when you use click tracking
      </p>
      <div className="flex gap-x-4 mt-6">
        <div className="w-40">
          <Button
            id="open-card"
            kind={"primary"}
            buttonType={"thin"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleTrackingDomainCheck(
                trackDomainData[0].id,
                trackDomainData[0].trackingDomain
              );
            }}
            userEventName="emailSetting-check-records-click"
          >
            <p>Check Records</p>
          </Button>
        </div>
        <div className="w-36">
          <Button
            id="open-card"
            kind={"back"}
            buttonType={"thin"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShowTrackingDomainRecord();
            }}
            userEventName="emailSetting-details:back-click"
          >
            <p>Back</p>
          </Button>
        </div>
      </div>
      {trackDomainRecords.map((val: any, index: number) => {
        for (const key in val) {
          return (
            <div className="text-xsm font-medium mt-4" key={index}>
              {key === "neutral" ? (
                <div className="text-vryno-gray flex gap-2 items-center">
                  <MinusCircleIcon size={16} className={"min-w-[16px]"} />
                  <p>{val[key]}</p>
                </div>
              ) : key === "warning" ? (
                <div className="text-toast-error flex gap-2 items-center">
                  <CloseCircleIcon size={16} className={"min-w-[16px]"} />
                  <p>{val[key]}</p>
                </div>
              ) : key === "ok" ? (
                <div className="text-toast-success flex gap-2 items-center">
                  <TickCircleIcon size={16} className={"min-w-[16px]"} />
                  <p>{val[key]}</p>
                </div>
              ) : (
                <div>No Status Found</div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
