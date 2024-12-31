import React from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { IEmailTemplate } from "../../../../../models/shared";
import { TemplateScreen } from "./TemplateScreen";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";

const templateButtons: {
  [templateName: string]: { moduleName: string; label: string };
} = {
  "email-template": {
    moduleName: "emailTemplate",
    label: "Email Template",
  },
  "module-template": {
    moduleName: "moduleTemplate",
    label: "Module Template",
  },
};

const emailTemplateVariables = {
  modelName: "emailTemplate",
  fields: [
    "id",
    "name",
    "subject",
    "templateServiceName",
    "templateModuleName",
    "fileKey",
    "templateType",
    "attachmentFileKeys",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
  ],
  filters: [
    {
      operator: "is_empty",
      name: "templateType",
      value: ["${empty}"],
    },
  ],
};

const moduleTemplateVariables = {
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
  filters: [],
};

const ConnectedTemplates = ({
  templateType,
}: {
  templateType: "email-template" | "module-template";
}) => {
  const { t } = useTranslation();
  const [emailTemplates, setEmailTemplates] = React.useState<IEmailTemplate[]>(
    []
  );
  const [emailTemplateItemsCount, setEmailTemplateItemsCount] =
    React.useState<number>(0);
  const [emailTemplateViewPermission, setEmailTemplateViewPermission] =
    React.useState(true);

  const [moduleTemplates, setModuleTemplates] = React.useState<
    IEmailTemplate[]
  >([]);
  const [moduleTemplateItemsCount, setModuleTemplateItemsCount] =
    React.useState<number>(0);
  const [moduleTemplateViewPermission, setModuleTemplateViewPermission] =
    React.useState(true);

  const [currentPageNumber, setCurrentpageNumber] = React.useState<number>(1);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({
    visible: false,
    id: null,
  });
  const [dataFetchProcessing, setDataFetchProcessing] = React.useState(true);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const { query } = useRouter();
  const [appName, menuItem, ...additionalParts] =
    (query?.slug as string[]) ?? [];

  const [fetchEmailTemplates] = useLazyQuery<
    FetchData<IEmailTemplate>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
  });

  const [deleteEmailTemplate] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        const updatedEmailTemplates = emailTemplates.filter(
          (template) => template.id !== responseOnCompletion.save.data.id
        );
        const updatedModuleTemplate = moduleTemplates.filter(
          (template) => template.id !== responseOnCompletion.save.data.id
        );
        if (updatedEmailTemplates?.length !== emailTemplates?.length) {
          setEmailTemplateItemsCount(emailTemplateItemsCount - 1);
        }
        if (moduleTemplates?.length !== updatedModuleTemplate?.length) {
          setModuleTemplateItemsCount(moduleTemplateItemsCount - 1);
        }
        setEmailTemplates(updatedEmailTemplates);
        setModuleTemplates(updatedModuleTemplate);
        toast.success(`Template Deleted Successfully`);
        setSavingProcess(false);
        return;
      }
      setSavingProcess(false);
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  React.useEffect(() => {
    const handleFetchingEmails = async () => {
      if (additionalParts?.[0] === "email-template")
        await fetchEmailTemplates({
          context: {
            headers: {
              vrynopath: "notify",
            },
          },
          variables: emailTemplateVariables,
        }).then((responseOnCompletion) => {
          if (responseOnCompletion?.data?.fetch?.data?.length) {
            setEmailTemplates(responseOnCompletion.data.fetch.data);
            setEmailTemplateItemsCount(responseOnCompletion.data?.fetch.count);
          } else if (
            responseOnCompletion?.data?.fetch.messageKey.includes(
              "requires-view"
            )
          ) {
            setEmailTemplateViewPermission(false);
            if (window?.location?.href?.split("/")?.pop() === "email-template")
              toast.error(responseOnCompletion?.data?.fetch.message);
          }
        });

      if (additionalParts?.[0] === "module-template")
        await fetchEmailTemplates({
          context: {
            headers: {
              vrynopath: "crm",
            },
          },
          variables: moduleTemplateVariables,
        }).then((responseOnCompletion) => {
          if (responseOnCompletion?.data?.fetch?.data?.length) {
            setModuleTemplates(responseOnCompletion.data.fetch.data);
            setModuleTemplateItemsCount(responseOnCompletion.data?.fetch.count);
          } else if (
            responseOnCompletion?.data?.fetch.messageKey.includes(
              "requires-view"
            )
          ) {
            setModuleTemplateViewPermission(false);
            if (window?.location?.href?.split("/")?.pop() === "module-template")
              toast.error(responseOnCompletion?.data?.fetch.message);
          }
        });
      setDataFetchProcessing(false);
    };
    handleFetchingEmails();
  }, []);

  return (
    <>
      <TemplateScreen
        dataFetchProcessing={dataFetchProcessing}
        templateButtons={templateButtons}
        currentTemplateType={templateType}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => {
          setCurrentpageNumber(pageNumber);
          fetchEmailTemplates({
            variables: { ...emailTemplateVariables, pageNumber: pageNumber },
          });
        }}
        emailTemplateViewPermission={emailTemplateViewPermission}
        emailTemplates={emailTemplates}
        emailTemplateItemsCount={emailTemplateItemsCount}
        moduleTemplateViewPermission={moduleTemplateViewPermission}
        moduleTemplates={moduleTemplates}
        moduleTemplateItemsCount={moduleTemplateItemsCount}
        filterValue={filterValue}
        setFilterValue={(value) => setFilterValue(value)}
        deleteEmailTemplate={(item) =>
          setDeleteModal({ visible: true, id: item.id })
        }
      />
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete ${
              templateType === "email-template" ? "Email" : "Module"
            } Template`}
            modalMessage={`Are you sure you want to delete this template?`}
            loading={savingProcess}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={async () => {
              setSavingProcess(true);
              await deleteEmailTemplate({
                context: {
                  headers: {
                    vrynopath:
                      templateType === "email-template" ? "notify" : "crm",
                  },
                },
                variables: {
                  id: deleteModal.id,
                  modelName:
                    templateType === "email-template"
                      ? "emailTemplate"
                      : "moduleTemplate",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              });
              if (
                templateType === "email-template"
                  ? emailTemplates.length === 1
                  : moduleTemplates.length === 1
              ) {
                fetchEmailTemplates({
                  context: {
                    headers: {
                      vrynopath:
                        templateType === "email-template" ? "notify" : "crm",
                    },
                  },
                  variables:
                    templateType === "email-template"
                      ? {
                          ...emailTemplateVariables,
                          pageNumber: currentPageNumber - 1,
                        }
                      : {
                          ...moduleTemplateVariables,
                          pageNumber: currentPageNumber - 1,
                        },
                });
              }
              setDeleteModal({ visible: false, id: null });
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: null })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: null })}
          />
        </>
      )}
    </>
  );
};

export default ConnectedTemplates;
