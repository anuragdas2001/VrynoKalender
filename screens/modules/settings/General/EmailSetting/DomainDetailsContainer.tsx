import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { DomainRecordItem } from "./DomainRecordItem";

export const DomainDetailsContainer = ({
  spfData,
  dkimData,
  returnPathData,
  mxData,
  handleShowDomainRecords,
  handleDomainCheck,
  data,
}: {
  spfData: any;
  dkimData: any;
  returnPathData: any;
  mxData: any;
  handleShowDomainRecords: () => void;
  handleDomainCheck: (id: string, domain: string) => void;
  data: any;
}) => {
  return (
    <div className="mt-6">
      <div>
        <p className="font-semibold">
          DNS Setup for{" "}
          <span className="text-vryno-theme-blue">{data[0].domain}</span>
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Follow the instrucstions below to configure SPF & DKIM records for
          this domain. We highly recommend that you do this to ensure your
          messages are delivered correctly and quick
        </p>
        <div className="flex gap-x-4 mt-6">
          <div className="w-40">
            <Button
              id="check-records"
              kind={"primary"}
              buttonType={"thin"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDomainCheck(data[0].id, data[0].domain);
              }}
              userEventName="domain-details:check-details-click"
            >
              <p>Check Records</p>
            </Button>
          </div>
          <div className="w-36">
            <Button
              id="back"
              kind={"back"}
              buttonType={"thin"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShowDomainRecords();
              }}
              userEventName="domain-details:back-click"
            >
              <p>Back</p>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <DomainRecordItem data={spfData} />
        <DomainRecordItem data={dkimData} />
        <DomainRecordItem data={returnPathData} />
        <DomainRecordItem data={mxData} />
      </div>
    </div>
  );
};
