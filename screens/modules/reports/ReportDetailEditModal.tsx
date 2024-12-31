import { Formik } from "formik";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import GenericFormModalContainer from "../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import FormInputBox from "../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormTextAreaBox from "../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { toast } from "react-toastify";
import React from "react";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { IReport } from "../../../models/IReport";

export const ReportDetailEditModal = ({
  setReportDetailsEditModal,
  reportDetailsEditModal,
  updateReport,
}: {
  setReportDetailsEditModal: (data: {
    visible: boolean;
    data: any | null;
  }) => void;
  reportDetailsEditModal: {
    visible: boolean;
    data: any | null;
  };
  updateReport: (id: string, data: IReport) => void;
}) => {
  const [updateProcessing, setUpdateProcessing] = React.useState(false);
  const validationSchema = Yup.object().shape({
    reportName: Yup.string()
      .min(5, "Minimum character length is 5")
      .required("Report Name is required."),
  });

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
        setReportDetailsEditModal({ visible: false, data: null });
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
        formHeading={"Update Report"}
        onOutsideClick={() =>
          setReportDetailsEditModal({ visible: false, data: null })
        }
        limitWidth
        onCancel={() =>
          setReportDetailsEditModal({ visible: false, data: null })
        }
      >
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              reportName: reportDetailsEditModal.data?.name || "",
              reportDescription: reportDetailsEditModal.data?.description || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setUpdateProcessing(true);
              serverUpdateReport({
                variables: {
                  id: reportDetailsEditModal.data.id,
                  modelName: "report",
                  saveInput: {
                    name: values.reportName,
                    description: values.reportDescription,
                  },
                },
              });
            }}
          >
            {({ handleSubmit }) => (
              <>
                <FormInputBox
                  name="reportName"
                  label="Report Name"
                  required
                  disabled={updateProcessing}
                />
                <FormTextAreaBox
                  name="reportDescription"
                  label="Description"
                  rows={3}
                  maxCharLength={300}
                  disabled={updateProcessing}
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
          setReportDetailsEditModal({ visible: false, data: null })
        }
      />
    </>
  );
};
