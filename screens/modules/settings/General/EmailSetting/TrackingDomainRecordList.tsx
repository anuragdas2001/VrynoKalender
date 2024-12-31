import TickCircleIcon from "remixicon-react/CheckboxCircleFillIcon";
import MinusCircleIcon from "remixicon-react/IndeterminateCircleFillIcon";
import CloseCircleIcon from "remixicon-react/CloseCircleFillIcon";
import RefreshLineIcon from "remixicon-react/RefreshLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { BaseGenericObjectType } from "../../../../../models/shared";

export const TrackingDomainRecordList = ({
  handleShowTrackingDomainRecord,
  handleDeleteTrackingDomain,
  handleTrackingDomainCheck,
  data,
}: {
  handleShowTrackingDomainRecord: () => void;
  handleDeleteTrackingDomain: (id: string, type: string) => void;
  handleTrackingDomainCheck: (id: string, trackDomain: string) => void;
  data: any;
}) => {
  const trackRecordListRenderHelper = (status: string, text: string) => {
    return status === "neutral" ? (
      <div className="text-vryno-gray flex gap-1 items-center">
        <MinusCircleIcon size={14} />
        <p className="">{text}</p>
      </div>
    ) : status === "warning" ? (
      <div className="text-toast-error flex gap-1 items-center">
        <CloseCircleIcon size={14} />
        <p className="">{text}</p>
      </div>
    ) : (
      <div className="text-toast-success flex gap-1 items-center">
        <TickCircleIcon size={14} />
        <p className="">{text}</p>
      </div>
    );
  };

  const tableHeaders = [
    {
      columnName: "trackingDomain",
      label: "Sub Domain",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "trackingStatus",
      label: "Status",
      dataType: SupportedDataTypes.singleline,
      render: (record: BaseGenericObjectType) => {
        return (
          <div className="flex gap-2.5">
            {trackRecordListRenderHelper(record.cnameStatus, "CNAME")}
            {trackRecordListRenderHelper(record.sslStatus, "SSL")}
          </div>
        );
      },
    },
    {
      columnName: "trackDomainVerifiedOn",
      label: "Verified On",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "actions",
      label: "Actions",
      dataType: SupportedDataTypes.uuid,
      render: (record: BaseGenericObjectType) => {
        return (
          <td className="flex gap-x-4 py-2 px-6">
            <Button
              id="track-domain-edit"
              onClick={() => {
                handleTrackingDomainCheck(record.id, record.trackingDomain);
              }}
              customStyle=""
              userEventName="tracking-domain-edit:action-click"
            >
              <RefreshLineIcon
                size={16}
                className={"text-vryno-theme-blue-secondary"}
              />
            </Button>
            <Button
              id="track-domain-delete"
              onClick={() => {
                handleDeleteTrackingDomain(record.id, "Tracking Domain");
              }}
              customStyle=""
              userEventName="tracking-domain-delete:action-click"
            >
              <DeleteIcon
                size={16}
                className={"text-vryno-theme-blue-secondary"}
              />
            </Button>
          </td>
        );
      },
    },
  ];

  return (
    <div className="overflow-y-auto">
      <GenericList
        data={data}
        tableHeaders={tableHeaders}
        listSelector={false}
        handleRowClick={handleShowTrackingDomainRecord}
        oldGenericListUI={true}
      />
    </div>
  );
};
