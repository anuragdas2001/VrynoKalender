import React, { useState } from "react";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import {
  IEmailTemplate,
  IGeneratedFile,
} from "../../../../../../models/shared";
import { ExportPdfModalForm } from "./ExportPdfModalForm";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import { FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { downloadFile } from "../../../shared/utils/downloadFile";
import { Config } from "../../../../../../shared/constants";

type ExportPdfModalProps = {
  formHeading: string;
  selectedItem: any;
  modelName: string;
  onCancel: (value: boolean) => void;
};

export const ExportPdfModal = ({
  formHeading,
  selectedItem,
  modelName,
  onCancel,
}: ExportPdfModalProps) => {
  const { t } = useTranslation();
  const [moduleTemplates, setModuleTemplates] = useState<IEmailTemplate[]>([]);
  const [currentGeneratedFile, setCurrentGeneratedFile] =
    useState<IGeneratedFile>();
  const [dataFetchProcessing, setDataFetchProcessing] = useState<boolean>(true);
  const [savingProcess, setSavingProcess] = useState<boolean>(false);
  const [alreadyGenerated, setAlreadyGenerated] =
    React.useState<boolean>(false);

  const [fetchModuleTemplates] = useLazyQuery<
    FetchData<IEmailTemplate>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
  });

  const [checkPdfExistance] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  const [generatePdf] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (data) => {
      setSavingProcess(false);
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-success")
      ) {
        setCurrentGeneratedFile(data.save.data);
        downloadFile(
          `${Config.metaPrivateUploadUrl()}crm/fileRegistry/${
            data.save.data.fileKey
          }`,
          data.save.data.fileName
        );
        setSavingProcess(false);
        onCancel(false);
        return;
      }
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleGeneratePdf = (values: FormikValues) => {
    setSavingProcess(true);
    checkPdfExistance({
      variables: {
        modelName: "fileRegistry",
        fields: [
          "id",
          "templateId",
          "fileName",
          "fileFormat",
          "fileKey",
          "recordId",
          "generationType",
        ],
        filters: [
          { operator: "eq", name: "templateId", value: [values.templateId] },
          { operator: "eq", name: "recordId", value: [selectedItem?.id] },
        ],
      },
    }).then((response) => {
      if (
        response?.data?.fetch?.data &&
        response?.data?.fetch?.data.length > 0 &&
        response?.data?.fetch?.messageKey &&
        response?.data?.fetch?.messageKey.includes("-success")
      ) {
        setAlreadyGenerated(true);
        setCurrentGeneratedFile(response?.data?.fetch?.data[0]);
        setSavingProcess(false);
      } else {
        generatePdf({
          variables: {
            id: null,
            modelName: "fileRegistry",
            saveInput: {
              templateId: values.templateId,
              fileName: values.name,
              fileFormat: "pdf",
              recordId: selectedItem?.id,
              generationType: "immediate",
            },
          },
        });
      }
    });
  };

  const handleGeneratePdfNew = (values: FormikValues) => {
    setSavingProcess(true);
    generatePdf({
      variables: {
        id: currentGeneratedFile?.id,
        modelName: "fileRegistry",
        saveInput: {
          fileName: values.name,
          generationType: "immediate",
        },
      },
    });
  };

  React.useEffect(() => {
    if (!modelName) return;
    const handleFetchingEmails = async () => {
      await fetchModuleTemplates({
        context: {
          headers: {
            vrynopath: "crm",
          },
        },
        variables: {
          modelName: "moduleTemplate",
          fields: [
            "id",
            "name",
            "subject",
            "templateServiceName",
            "templateModuleName",
            "fileKey",
            "attachmentFileKeys",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
          ],
          filters: [
            { operator: "eq", name: "templateModuleName", value: [modelName] },
          ],
        },
      }).then((responseOnCompletion) => {
        if (responseOnCompletion?.data?.fetch?.data?.length) {
          setModuleTemplates(responseOnCompletion.data.fetch.data);
        }
        setDataFetchProcessing(false);
      });
    };
    handleFetchingEmails();
  }, [modelName]);

  return (
    <>
      <GenericFormModalContainer
        formHeading={formHeading}
        limitWidth={true}
        onCancel={() => onCancel(false)}
        onOutsideClick={() => onCancel(false)}
      >
        {!dataFetchProcessing ? (
          <ExportPdfModalForm
            moduleTemplates={moduleTemplates}
            alreadyGenerated={alreadyGenerated}
            currentGeneratedFile={currentGeneratedFile}
            savingProcess={savingProcess}
            setAlreadyGenerated={(value) => setAlreadyGenerated(value)}
            handleSave={(value) => handleGeneratePdf(value)}
            handleSaveNew={(value) => handleGeneratePdfNew(value)}
            onCancel={onCancel}
          />
        ) : (
          <div className="w-full max-w-sm flex flex-col  items-center justify-center">
            <Loading color="Blue" />
          </div>
        )}
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
