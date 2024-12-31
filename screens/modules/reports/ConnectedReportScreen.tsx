import React, { useContext, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { observer } from "mobx-react-lite";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import { GenericReportScreen } from "./GenericReportScreen";
import { SupportedApps } from "../../../models/shared";
import GenericFormModalContainer from "../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { useRouter } from "next/router";
import { ReportStoreContext } from "../../../stores/ReportStore";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInputBox from "../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { toast } from "react-toastify";
import { NoViewPermission } from "../crm/shared/components/NoViewPermission";
import FormTextAreaBox from "../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";

interface IConnectedGenericEmailProps {
  appName: SupportedApps;
  id?: string;
}

export const ConnectedGenericReport = observer(
  ({ appName, id }: IConnectedGenericEmailProps) => {
    const validationSchema = Yup.object().shape({
      reportName: Yup.string()
        .min(5, "Minimum character length is 5")
        .required("Report Name is required."),
    });
    const router = useRouter();
    const [addReportModal, setAddReportModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [itemsCount, setItemsCount] = React.useState<number>(0);
    const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    const { importReports, setNewReportName, reports } =
      useContext(ReportStoreContext);
    const [hasViewPermission, setHasViewPermission] = React.useState(true);

    const [getReports] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
      onCompleted: (responseOnCompletion) => {
        setLoading(false);
        if (responseOnCompletion?.fetch?.data) {
          importReports(responseOnCompletion.fetch.data);
          setItemsCount(responseOnCompletion.fetch.count);
        } else if (responseOnCompletion?.fetch.messageKey.includes("view")) {
          toast.error(responseOnCompletion?.fetch.message);
          setHasViewPermission(false);
          return;
        } else {
          toast.error(responseOnCompletion?.fetch.message);
          return;
        }
      },
    });

    const closeAddReportModel = () => {
      setAddReportModal(false);
      setNewReportName("");
    };

    useEffect(() => {
      setLoading(true);
      getReports({
        variables: {
          modelName: "report",
          fields: [
            "id",
            "name",
            "description",
            "fileKey",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
            "sharedUsers",
            "sharedType",
          ],
          filters: [],
        },
      });
    }, []);

    return hasViewPermission ? (
      <>
        <GenericReportScreen
          reports={reports}
          appName={appName}
          loading={loading}
          itemsCount={itemsCount}
          currentPageNumber={currentPageNumber}
          onPageChange={(pageNumber) => {
            setCurrentPageNumber(pageNumber);
            getReports({
              variables: {
                modelName: "report",
                fields: [
                  "id",
                  "name",
                  "fileKey",
                  "createdAt",
                  "createdBy",
                  "updatedAt",
                  "updatedBy",
                  "sharedUsers",
                  "sharedType",
                ],
                filters: [],
                pageNumber: pageNumber,
              },
            });
          }}
          // selectedButton={selectedButton}
          handleAddReport={(value) => setAddReportModal(value)}
        />
        {addReportModal && (
          <>
            <GenericFormModalContainer
              formHeading={"Create New Report"}
              onCancel={() => closeAddReportModel()}
              onOutsideClick={() => closeAddReportModel()}
              limitWidth
            >
              <form onSubmit={(e) => e.preventDefault()} className="w-full">
                <Formik
                  initialValues={{ reportName: "", description: "" }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    router.push(
                      `/reports/crm/add/new?name=${encodeURIComponent(
                        values["reportName"]
                      )}&description=${values["description"]}`
                    );
                  }}
                >
                  {({ handleSubmit, handleChange }) => (
                    <>
                      <FormInputBox
                        name="reportName"
                        label="Report Name"
                        onChange={(e) => {
                          handleChange(e);
                          setNewReportName(e.target.value);
                        }}
                        required
                      />
                      <FormTextAreaBox
                        name="description"
                        label="Description"
                        rows={3}
                        maxCharLength={300}
                      />
                      <div className="mt-4">
                        <Button
                          id="add-report-btn"
                          onClick={() => handleSubmit()}
                          userEventName="add-report:submit-click"
                        >
                          Add Report
                        </Button>
                      </div>
                    </>
                  )}
                </Formik>
              </form>
            </GenericFormModalContainer>
            <Backdrop onClick={() => closeAddReportModel()} />
          </>
        )}
      </>
    ) : (
      <NoViewPermission />
    );
  }
);
