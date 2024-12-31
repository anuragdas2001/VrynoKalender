import React from "react";
import EmailSettingsForm from "./EmailSettingsForm";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";

export const EmailSettingsContainer = ({
  handleSave,
  emailSetting,
  savingProcess,
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
  deleteDomainRecords,
  handleDomainCheck,
  showTrackingDomainRecord,
  trackDomainLoading,
  // showTrackingRecordList,
  handleTrackDomain,
  handleShowTrackingDomainRecord,
  handleTrackingDomainCheck,
  trackDomainRecords,
  rootLoading,
  viewPermission,
}: {
  handleSave: (value: any) => void;
  emailSetting: any;
  savingProcess: boolean;
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
  deleteDomainRecords: (id: string, type: string) => void;
  handleDomainCheck: (id: string, domain: string) => void;
  showTrackingDomainRecord: boolean;
  trackDomainLoading: boolean;
  // showTrackingRecordList: boolean;
  handleTrackDomain: (trackDomain: string) => void;
  handleShowTrackingDomainRecord: () => void;
  handleTrackingDomainCheck: (id: string, trackDomain: string) => void;
  trackDomainRecords: any;
  rootLoading: boolean;
  viewPermission: boolean;
}) => {
  const [deleteModal, setDeleteModal] = React.useState({
    visible: false,
    id: "",
    type: "",
  });
  const handleDeleteDomain = (id: string, type: string) => {
    setDeleteModal({ visible: true, id: id, type: type });
  };
  const handleDeleteTrackingDomain = (id: string, type: string) => {
    setDeleteModal({ visible: true, id: id, type: type });
  };
  const resetDeleteModalProp = () => {
    setDeleteModal({ visible: false, id: "", type: "" });
  };

  return (
    <>
      <EmailSettingsForm
        data={emailSetting}
        handleSave={(values) => handleSave(values)}
        loading={savingProcess}
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
        // showTrackingRecordList={showTrackingRecordList}
        handleTrackDomain={handleTrackDomain}
        handleShowTrackingDomainRecord={handleShowTrackingDomainRecord}
        handleDeleteTrackingDomain={handleDeleteTrackingDomain}
        handleTrackingDomainCheck={handleTrackingDomainCheck}
        trackDomainRecords={trackDomainRecords}
        rootLoading={rootLoading}
        viewPermission={viewPermission}
      />
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={"custom_model_delete_modal"}
            modalHeader={"Delete Domain"}
            modalMessage={`Are you sure you want to delete ${deleteModal.type}?`}
            leftButton={"Cancel"}
            rightButton={"Delete"}
            loading={false}
            onCancel={() => resetDeleteModalProp()}
            onDelete={async () => {
              await deleteDomainRecords(deleteModal.id, deleteModal.type);
              resetDeleteModalProp();
            }}
            onOutsideClick={() => resetDeleteModalProp()}
          />
          <Backdrop onClick={() => resetDeleteModalProp()} />
        </>
      )}
    </>
  );
};
