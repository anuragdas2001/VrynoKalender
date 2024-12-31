import React, { useContext } from "react";
import { useRouter } from "next/router";
import TemplateForm from "./TemplateForm";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { dataUploadHandler } from "../../../../crm/shared/utils/dataUploadHandler";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { camelCase } from "change-case";
import _ from "lodash";
import { FormikValues } from "formik";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { UserStoreContext } from "../../../../../../stores/UserStore";

const TemplateAddScreen = observer(() => {
  const router = useRouter();
  const { appName, ui } = getAppPathParts();
  const modelName = camelCase(ui || "");
  const { t } = useTranslation();
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const [saveEmailTemplate] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: modelName === "moduleTemplate" ? "crm" : "notify",
      },
    },
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-success")
      ) {
        toast.success(data.save.message);
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

  const handleSave = async (values: FormikValues) => {
    setSaveProcessing(true);
    const fileKey = await dataUploadHandler(
      values.fileKey,
      null,
      modelName as "emailTemplate" | "moduleTemplate" | undefined,
      modelName === "moduleTemplate" ? "crm" : "notify"
    );
    let jsonFileKey = null;
    if (values.htmlEditor) {
      jsonFileKey = await dataUploadHandler(
        JSON.stringify(values.htmlEditor),
        null,
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
      await saveEmailTemplate({
        variables: {
          id: null,
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

  return (
    <TemplateForm
      data={{}}
      appName={appName}
      modelName={modelName}
      handleSave={(values) => handleSave(values)}
      loading={saveProcessing}
      editMode={false}
      genericModels={genericModels}
      allModulesFetched={allModulesFetched}
      allLayoutFetched={allLayoutFetched}
      user={user}
    />
  );
});

export default TemplateAddScreen;
