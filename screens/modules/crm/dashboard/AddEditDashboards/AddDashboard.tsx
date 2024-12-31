import { useMutation } from "@apollo/client";
import { FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { DashboardForm } from "./DashboardForm";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";

export type AddDashboardProps = {};

export enum AllowedForms {
  Add = "add",
  Edit = "edit",
}

export const AddDashboard = observer(({}: AddDashboardProps) => {
  const { t } = useTranslation("common");
  let { appName, modelName } = getAppPathParts();
  const router = useRouter();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const { navigations } = useContext(NavigationStoreContext);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [saveDashboard] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        router.push(`${appName}/${modelName}/dashboard`);
        Toast.success(responseOnCompletion.save.message);
        setSavingProcess(false);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setSavingProcess(false);
        return;
      }
      setSavingProcess(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  const handleDashboardSave = async (values: FormikValues) => {
    setSavingProcess(true);
    try {
      await saveDashboard({
        variables: {
          id: null,
          modelName: "Dashboard",
          saveInput: {
            name: values.name,
            widgets: values.widgets,
            sharedUsers: values.sharedUsers ?? [],
            sharedType: values["sharedType"] ?? "onlyMe",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardForm
      data={{}}
      type={AllowedForms.Add}
      handleSave={(values) => handleDashboardSave(values)}
      savingProcess={savingProcess}
      dataFetchLoading={false}
      moduleViewSharingData={null}
      genericModels={genericModels}
      allModulesFetched={allModulesFetched}
      navigations={navigations}
      allLayoutFetched={allLayoutFetched}
    />
  );
});
