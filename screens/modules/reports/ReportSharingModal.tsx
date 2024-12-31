import { Formik } from "formik";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { toast } from "react-toastify";
import React from "react";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { IReport } from "../../../models/IReport";
import { RecordSharingCriteriaContainer } from "../crm/generic/GenericAddCustomView/RecordSharingCriteriaContainer";
import { ISharingRuleData } from "../../../models/shared";

export const ReportSharingModal = ({
  setReportSharingOptionsModal,
  reportSharingOptionsModal,
  updateReport,
  moduleViewSharingData,
}: {
  setReportSharingOptionsModal: (data: {
    visible: boolean;
    data: any | null;
  }) => void;
  reportSharingOptionsModal: {
    visible: boolean;
    data: any | null;
  };
  updateReport: (id: string, data: IReport) => void;
  moduleViewSharingData: ISharingRuleData | null;
}) => {
  const [updateProcessing, setUpdateProcessing] = React.useState(false);

  const [serverUpdateReport] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-success")
      ) {
        toast.success("Report updated successfully");
        updateReport(data.save.data.id, data.save.data);
        setUpdateProcessing(false);
        setReportSharingOptionsModal({ visible: false, data: null });
        return;
      }
      setUpdateProcessing(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  return (
    <>
      <GenericFormModalContainer
        formHeading={"Share this with"}
        onOutsideClick={() =>
          setReportSharingOptionsModal({ visible: false, data: null })
        }
        limitWidth
        onCancel={() =>
          setReportSharingOptionsModal({ visible: false, data: null })
        }
      >
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              sharedUsers: [],
              sharedType: "onlyMe",
            }}
            onSubmit={(values) => {
              setUpdateProcessing(true);
              serverUpdateReport({
                variables: {
                  id: reportSharingOptionsModal.data.id,
                  modelName: "report",
                  saveInput: {
                    sharedUsers: values["sharedUsers"] ?? [],
                    sharedType: values["sharedType"] ?? "onlyMe",
                  },
                },
              });
            }}
          >
            {({ handleSubmit }) => (
              <>
                <RecordSharingCriteriaContainer
                  recordCreatedById={
                    reportSharingOptionsModal?.data?.createdBy ?? null
                  }
                  editMode={true}
                  moduleViewSharingData={moduleViewSharingData}
                  showLabel={false}
                />
                <div className="mt-4">
                  <Button
                    id="update-report-btn"
                    onClick={() => handleSubmit()}
                    userEventName="update-report:submit-click"
                    disabled={updateProcessing}
                    loading={updateProcessing}
                  >
                    Update
                  </Button>
                </div>
              </>
            )}
          </Formik>
        </form>
      </GenericFormModalContainer>
      <Backdrop
        onClick={() =>
          setReportSharingOptionsModal({ visible: false, data: null })
        }
      />
    </>
  );
};
