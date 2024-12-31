import React, { useContext } from "react";
import { useRouter } from "next/router";
import TemplateForm from "./TemplateForm";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { IEmailTemplate } from "../../../../../../models/shared";
import { Config } from "../../../../../../shared/constants";
import { getDataFromUrl } from "../../../../crm/shared/utils/getDataFromUrl";
import { dataUploadHandler } from "../../../../crm/shared/utils/dataUploadHandler";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { camelCase } from "change-case";
import { FormikValues } from "formik";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { UserStoreContext } from "../../../../../../stores/UserStore";

const TemplateEditScreen = observer(({ id }: { id: string }) => {
  const router = useRouter();
  const { appName, ui } = getAppPathParts();
  const modelName = camelCase(ui || "");
  const { t } = useTranslation();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const [existingFileKey, setExistingFileKey] = React.useState<string | null>(
    null
  );
  const [existingJsonKey, setExistingJsonKey] = React.useState<string | null>(
    null
  );
  const [emailTemplate, setEmailTemplate] = React.useState<any>({});

  const [fetchTemplate] = useLazyQuery<FetchData<IEmailTemplate>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      onCompleted: async (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data?.length) {
          let fetchedData = responseOnCompletion.fetch.data[0];
          let fileKeyData = await getDataFromUrl(
            `${Config.metaPrivateUploadUrl()}${
              modelName === "moduleTemplate" ? "crm" : "notify"
            }/${modelName}/${responseOnCompletion.fetch.data[0].fileKey}`
          ).then((data) => data);
          let jsonFileKeyData = null;
          if (responseOnCompletion.fetch.data[0].jsonFileKey) {
            jsonFileKeyData = await getDataFromUrl(
              `${Config.metaPrivateUploadUrl()}${
                modelName === "moduleTemplate" ? "crm" : "notify"
              }/${modelName}/${responseOnCompletion.fetch.data[0].jsonFileKey}`
            ).then((data) => data);
          }

          setExistingFileKey(fetchedData.fileKey);
          setExistingJsonKey(fetchedData.jsonKey);
          setEmailTemplate({
            ...fetchedData,
            fileKey: fileKeyData,
            jsonFileKey: jsonFileKeyData ? jsonFileKeyData : null,
            templateModuleName: fetchedData.templateModuleName,
          });
        }
      },
    }
  );

  const [updateEmailTemplate] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-success")
      ) {
        toast.success(
          `${
            modelName === "moduleTemplate"
              ? "Module template"
              : "Email template"
          } updated successfully`
        );
        setSaveProcessing(false);
        router.push(
          `/settings/crm/templates/${
            modelName === "moduleTemplate"
              ? "module-template"
              : "email-template"
          }`
        );
        return;
      }
      setSaveProcessing(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleSave = async (values: Record<string, string>) => {
    setSaveProcessing(true);
    const fileKey = await dataUploadHandler(
      values.fileKey,
      existingFileKey,
      modelName as "emailTemplate" | "moduleTemplate" | undefined,
      modelName === "moduleTemplate" ? "crm" : "notify"
    );
    let jsonFileKey = null;
    if (values.htmlEditor) {
      jsonFileKey = await dataUploadHandler(
        JSON.stringify(values.htmlEditor),
        existingJsonKey,
        modelName as "emailTemplate" | "moduleTemplate" | undefined,
        modelName === "moduleTemplate" ? "crm" : "notify"
      );
    }

    let emailTemplateVariables: FormikValues = {
      name: values.name,
      subject: values.subject,
      templateServiceName: "crm",
      templateModuleName: values.templateModuleName,
      fileKey: fileKey,
      attachmentFileKeys:
        values.attachmentFileKeys && JSON.stringify(values.attachmentFileKeys),
    };
    if (values?.switchEditor) {
      emailTemplateVariables["contentType"] = "html";
    }
    if (jsonFileKey) {
      emailTemplateVariables["jsonFileKey"] = jsonFileKey;
    }

    try {
      await updateEmailTemplate({
        context: {
          headers: {
            vrynopath: modelName === "moduleTemplate" ? "crm" : "notify",
          },
        },
        variables: {
          id: emailTemplate.id,
          modelName: modelName,
          saveInput: {
            ...emailTemplateVariables,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (modelName) {
      let filters = [{ operator: "eq", name: "id", value: id }];
      fetchTemplate({
        context: {
          headers: {
            vrynopath: modelName === "moduleTemplate" ? "crm" : "notify",
          },
        },
        variables: {
          modelName: modelName,
          fields: [
            "id",
            "name",
            "subject",
            "templateServiceName",
            "templateModuleName",
            "fileKey",
            "jsonFileKey",
            "attachmentFileKeys",
            "contentType",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
          ],
          filters:
            modelName === "moduleTemplate"
              ? [...filters]
              : [
                  ...filters,
                  {
                    operator: "is_empty",
                    name: "templateType",
                    value: ["${empty}"],
                  },
                ],
        },
      });
    }
  }, [modelName]);

  if (Object.keys(emailTemplate).length > 0) {
    return (
      <TemplateForm
        data={emailTemplate}
        appName={appName}
        modelName={modelName}
        handleSave={(values) => handleSave(values)}
        editMode={true}
        loading={saveProcessing}
        genericModels={genericModels}
        allModulesFetched={allModulesFetched}
        allLayoutFetched={allLayoutFetched}
        user={user}
      />
    );
  } else return null;
});
export default TemplateEditScreen;
