import DownloadDataIcon from "remixicon-react/FileDownloadLineIcon";
import { CSVLink } from "react-csv";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import FormFileDropper from "../../../../../../components/TailwindControls/Form/FileDropper/FormFileDropper";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import { TFunction } from "next-i18next";

export type FormDetailProps = {
  type: "Add" | "Edit" | "Conversion" | null;
  parentId: string | null;
  parentModelName: string;
  aliasName: string;
  id: string | null;
  modelName: string | null;
  appName: string | null;
};

export type BulkImportProps = {
  formDetails: FormDetailProps;
  onCancel: () => void;
};

let validationSchema = Yup.object().shape({
  fileId: Yup.array()
    .nullable()
    .min(1, "Please select a file")
    .max(1, "Please select a file"),
});

export const BulkImportAddModal = ({
  formDetails,
  onCancel,
  sampleListHeaders,
  handleBulkImportCreation,
  loadingState,
  t,
  layoutsFetchLoading,
}: BulkImportProps & {
  sampleListHeaders: string[];
  t: TFunction;
  handleBulkImportCreation: (values: FormikValues) => Promise<void>;
  loadingState: boolean;
  layoutsFetchLoading: boolean;
}) => {
  return (
    <GenericFormModalContainer
      topIconType="Close"
      formHeading={`Import ${formDetails?.aliasName}`}
      onCancel={onCancel}
      onOutsideClick={onCancel}
    >
      {layoutsFetchLoading ? (
        <div className="w-full h-full flex items-center justify-center py-10">
          <Loading color="Blue" />
        </div>
      ) : (
        <div className="w-full h-full mt-8 flex flex-col">
          <CSVLink
            data={[sampleListHeaders]}
            filename={`${formDetails.parentModelName}.csv`}
            className="mx-auto"
          >
            <Button
              id="bulk-import-add-modal-download-sample-data"
              customStyle="py-3.5 px-2 w-full text-sm rounded-md flex justify-center bg-vryno-theme-blue"
              userEventName="bulkImport-add-modal-download-sample-data"
              renderChildrenOnly={true}
            >
              <span className="flex text-white">
                <DownloadDataIcon className="text-white mr-2" />
                DownLoad Sample Data
              </span>
            </Button>
          </CSVLink>
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <Formik
              initialValues={{
                fileId: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleBulkImportCreation({ ...values })}
            >
              {({ handleSubmit, values }) => (
                <>
                  <FormFileDropper name="fileId" />
                  <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
                    <Button
                      id="cancel-form"
                      onClick={onCancel}
                      kind="back"
                      userEventName="bulkImport-modal-save:cancel-click"
                    >
                      {t("common:cancel")}
                    </Button>
                    <Button
                      id="save-form"
                      onClick={() => handleSubmit()}
                      kind="primary"
                      disabled={!values["fileId"] || loadingState}
                      loading={loadingState}
                      userEventName="bulkImport-modal-save:cancel-click"
                    >
                      {t("common:save")}
                    </Button>
                  </div>
                </>
              )}
            </Formik>
          </form>
        </div>
      )}
    </GenericFormModalContainer>
  );
};
