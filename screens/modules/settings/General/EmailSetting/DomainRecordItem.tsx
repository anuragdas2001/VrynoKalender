import TickCircleIcon from "remixicon-react/CheckboxCircleFillIcon";
import MinusCircleIcon from "remixicon-react/IndeterminateCircleFillIcon";
import CloseCircleIcon from "remixicon-react/CloseCircleFillIcon";

export const DomainRecordItem = ({ data }: { data: any }) => {
  return (
    <div>
      <div className="text-base font-semibold pb-1 border-b">
        <p>{data.label}</p>
      </div>
      <div className="text-xsm font-medium mt-4 ">
        <div>
          {data.status === "neutral" ? (
            <div className="text-vryno-gray flex gap-2 items-center">
              <MinusCircleIcon size={16} className={"min-w-[16px]"} />
              <p data-testid={`${data.label}-status`} data-value={"false"}>
                {data.statusData[data.status]}
              </p>
            </div>
          ) : data.status === "warning" ? (
            <div className="text-toast-error flex gap-2 items-center">
              <CloseCircleIcon size={16} className={"min-w-[16px]"} />
              <p data-testid={`${data.label}-status`} data-value={"false"}>
                {data.statusData[data.status]}
              </p>
            </div>
          ) : data.status === "ok" ? (
            <div className="text-toast-success flex gap-2 items-center">
              <TickCircleIcon size={16} className={"min-w-[16px]"} />
              <p data-testid={`${data.label}-status`} data-value={"true"}>
                {data.statusData[data.status]}
              </p>
            </div>
          ) : (
            <div>No Status Found</div>
          )}
        </div>
      </div>
      <div
        className="text-xsm mt-4 text-gray-400"
        data-testid={`${data?.label}-instruction`}
      >
        {data.instruction}
      </div>
      <div
        className="text-sm mt-4 p-4 bg-vryno-header-color break-words"
        data-testid={`${data?.label}-setup`}
      >
        {data.setup}
      </div>
    </div>
  );
};
