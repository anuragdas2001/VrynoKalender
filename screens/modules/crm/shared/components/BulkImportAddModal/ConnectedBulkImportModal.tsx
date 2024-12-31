import React from "react";
import {
  getMergedFieldList,
  getProcessedFieldList,
} from "../../utils/getOrderedFieldsList";
import { FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { bulkImportJobUploadHandler } from "../../utils/bulkImportHandler";
import { BulkImportAddModal, BulkImportProps } from "./BulkImportAddModal";
import { useAppFetchQuery } from "../../utils/useAppFetchQuery";
import {
  postSaveMutation,
  useAppSaveMutation,
} from "../../utils/useAppSaveMutation";
import { IBulkImport } from "../../../../../../models/shared";
import { ILayout } from "../../../../../../models/ILayout";
import { ICustomField } from "../../../../../../models/ICustomField";
import { AppModels } from "../../../../../../models/AppModels";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";

export const ConnectedBulkImportModal = ({
  formDetails,
  onCancel,
}: BulkImportProps) => {
  const { t } = useTranslation(["common"]);
  const [layouts, setLayouts] = React.useState<ILayout[]>([]);
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [sampleListHeaders, setSampleListHeaders] = React.useState<string[]>(
    []
  );
  const [layoutsFetchLoading, setLayoutFetchLoading] =
    React.useState<boolean>(true);
  const [loadingState, setLoadingState] = React.useState(false);

  useAppFetchQuery<ILayout>({
    appPath: formDetails.appName || "",
    onDataRecd: (data) => {
      setLayouts(data);
      setFieldsList(data[0].config.fields);
      setLayoutFetchLoading(false);
    },
    variables: {
      modelName: AppModels.Layout,
      fields: ["id", "name", "moduleName", "layout", "config"],
      filters: [
        {
          name: "moduleName",
          operator: "eq",
          value: formDetails.parentModelName,
        },
      ],
    },
  });

  React.useEffect(() => {
    setSampleListHeaders(
      getProcessedFieldList(
        getMergedFieldList(fieldsList, layouts[0]?.layout || [])
      ).map((item) => item.label)
    );
  }, [fieldsList, layouts]);

  const postSuccessCreation = (data: IBulkImport) => {
    onCancel();
  };

  const [createBulkImportMutation] = useAppSaveMutation<IBulkImport>({
    appPath: formDetails.appName || "",
  });

  const handleBulkImportCreation = async (values: FormikValues) => {
    setLoadingState(true);
    const fileId = await bulkImportJobUploadHandler(values.fileId[0]);

    try {
      const { data } = await createBulkImportMutation({
        variables: {
          id: null,
          modelName: "BulkImportJob",
          saveInput: {
            fileKey: fileId,
            fileName: values.fileId[0]?.name,
            moduleName: formDetails.parentModelName,
          },
        },
      });
      postSaveMutation(
        data,
        t,
        "File uploaded successfully",
        postSuccessCreation
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      <BulkImportAddModal
        formDetails={formDetails}
        onCancel={onCancel}
        sampleListHeaders={sampleListHeaders}
        handleBulkImportCreation={handleBulkImportCreation}
        loadingState={loadingState}
        layoutsFetchLoading={layoutsFetchLoading}
        t={t}
      />
    </>
  );
};
export default ConnectedBulkImportModal;
