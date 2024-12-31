import TickCircleIcon from "remixicon-react/CheckboxCircleFillIcon";
import MinusCircleIcon from "remixicon-react/IndeterminateCircleFillIcon";
import CloseCircleIcon from "remixicon-react/CloseCircleFillIcon";
import RefreshLineIcon from "remixicon-react/RefreshLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { BaseGenericObjectType } from "../../../../../models/shared";

export const DomainRecordList = ({
  data,
  handleDeleteDomain,
  handleDomainCheck,
  handleShowDomainRecords,
}: {
  data: any;
  handleDeleteDomain: (id: string, type: string) => void;
  handleDomainCheck: (id: string, domain: string) => void;
  handleShowDomainRecords: () => void;
}) => {
  const dnsRecordListRenderHelper = (status: string, text: string) => {
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
      columnName: "domain",
      label: "Domain",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "dnsRecords",
      label: "Status",
      dataType: SupportedDataTypes.singleline,
      render: (record: BaseGenericObjectType) => {
        return (
          <div className="flex gap-2.5">
            {dnsRecordListRenderHelper(record.spfStatus, "SPF")}
            {dnsRecordListRenderHelper(record.dkimStatus, "DKIM")}
            {dnsRecordListRenderHelper(record.returnPathStatus, "Return Path")}
            {dnsRecordListRenderHelper(record.mxStatus, "MX")}
          </div>
        );
      },
    },
    {
      columnName: "domainVerifiedOn",
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
              id="domain-record-refresh"
              onClick={() => {
                handleDomainCheck(record.id, record.domain);
              }}
              customStyle=""
              userEventName="domain-record-edit:action-click"
            >
              <RefreshLineIcon
                size={16}
                className={"text-vryno-theme-blue-secondary"}
              />
            </Button>
            <Button
              id="domain-record-delete"
              onClick={() => {
                handleDeleteDomain(record.id, "Domain");
              }}
              customStyle=""
              userEventName="domain-record-delete:action-click"
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
        handleRowClick={handleShowDomainRecords}
        oldGenericListUI={true}
      />
    </div>
  );
};
