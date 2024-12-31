import React from "react";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { SettingsSideBar } from "../../SettingsSidebar";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { NoViewPermission } from "../../../crm/shared/components/NoViewPermission";
import { EmailSettingsFormContainer } from "./EmailSettingsFormContainer";

export interface IEmailSettingsFormRootProps {
  data?: Record<string, string | null>;
  handleSave: (values: Record<string, string | null | undefined>) => void;
  loading: boolean;
  handleConfigureDomain: (domain: string) => void;
  domainRecords: any;
  spfData: any;
  dkimData: any;
  returnPathData: any;
  mxData: any;
  trackDomainData: any;
  showDomainRecords: boolean;
  domainLoading: boolean;
  handleShowDomainRecords: () => void;
  domainData: any;
  handleDeleteDomain: (id: string, type: string) => void;
  handleDomainCheck: (id: string, domain: string) => void;
  showTrackingDomainRecord: boolean;
  trackDomainLoading: boolean;
  // showTrackingRecordList: boolean;
  handleTrackDomain: (trackDomain: string) => void;
  handleShowTrackingDomainRecord: () => void;
  handleDeleteTrackingDomain: (id: string, type: string) => void;
  handleTrackingDomainCheck: (id: string, trackDomain: string) => void;
  trackDomainRecords: any;
}

interface IEmailSettingsFormProps extends IEmailSettingsFormRootProps {
  rootLoading: boolean;
  viewPermission: boolean;
}

const EmailSettingsForm = ({
  data,
  handleSave,
  loading,
  handleConfigureDomain,
  domainRecords,
  spfData,
  dkimData,
  returnPathData,
  mxData,
  trackDomainData,
  showDomainRecords,
  domainLoading,
  handleShowDomainRecords,
  domainData,
  handleDeleteDomain,
  handleDomainCheck,
  showTrackingDomainRecord,
  trackDomainLoading,
  // showTrackingRecordList,
  handleTrackDomain,
  handleShowTrackingDomainRecord,
  handleDeleteTrackingDomain,
  handleTrackingDomainCheck,
  trackDomainRecords,
  rootLoading,
  viewPermission,
}: IEmailSettingsFormProps) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  return (
    <>
      <GenericBackHeader heading="Email Campaign" />
      <div className="sm:hidden w-40 mt-4 mb-5">
        <SideDrawer
          sideMenuClass={sideMenuClass}
          setSideMenuClass={setSideMeuClass}
          buttonType={"thin"}
        >
          <SettingsSideBar />
        </SideDrawer>
      </div>
      {rootLoading ? (
        viewPermission ? (
          <EmailSettingsFormContainer
            data={data}
            handleSave={handleSave}
            loading={loading}
            handleConfigureDomain={handleConfigureDomain}
            domainRecords={domainRecords}
            spfData={spfData}
            dkimData={dkimData}
            returnPathData={returnPathData}
            mxData={mxData}
            trackDomainData={trackDomainData}
            showDomainRecords={showDomainRecords}
            domainLoading={domainLoading}
            handleShowDomainRecords={handleShowDomainRecords}
            domainData={domainData}
            handleDeleteDomain={handleDeleteDomain}
            handleDomainCheck={handleDomainCheck}
            showTrackingDomainRecord={showTrackingDomainRecord}
            trackDomainLoading={trackDomainLoading}
            // showTrackingRecordList={  // showTrackingRecordList}
            handleTrackDomain={handleTrackDomain}
            handleShowTrackingDomainRecord={handleShowTrackingDomainRecord}
            handleDeleteTrackingDomain={handleDeleteTrackingDomain}
            handleTrackingDomainCheck={handleTrackingDomainCheck}
            trackDomainRecords={trackDomainRecords}
          />
        ) : (
          <NoViewPermission modelName="Email Campaign" marginTop="mt-2" />
        )
      ) : (
        <div className="px-6">
          <ItemsLoader currentView="List" loadingItemCount={2} />
        </div>
      )}
    </>
  );
};

export default EmailSettingsForm;
