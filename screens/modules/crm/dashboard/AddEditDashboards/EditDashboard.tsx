import { useLazyQuery, useMutation } from "@apollo/client";
import { FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { AppModels } from "../../../../../models/AppModels";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { DashboardForm } from "./DashboardForm";
import { ISharingRuleData } from "../../../../../models/shared";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";

export type EditDashboardProps = {};

export enum AllowedForms {
  Add = "add",
  Edit = "edit",
}

export const EditDashboard = observer(({}: EditDashboardProps) => {
  const { t } = useTranslation("common");
  let { appName, modelName, id } = getAppPathParts();
  const router = useRouter();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const { navigations } = useContext(NavigationStoreContext);
  const [dashboarById, setDashboardById] = React.useState<IDashboardDetails>();
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [dataFetchLoading, setDataFetchLoading] = React.useState<boolean>(true);
  const [moduleViewSharingData, setModuleViewSharingData] =
    React.useState<ISharingRuleData | null>(null);

  const [getDashboards] = useLazyQuery<FetchData<IDashboardDetails>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
          const currentDashboard = responseOnCompletion.fetch.data.filter(
            (data) => data.id === id
          )[0];
          setDashboardById(currentDashboard);
          setModuleViewSharingData({
            sharedType: currentDashboard.sharedType,
            sharedUsers: currentDashboard.sharedUsers,
          });
          setDataFetchLoading(false);
          return;
        } else if (
          responseOnCompletion?.fetch?.messageKey.includes("requires-view")
        ) {
          Toast.error(responseOnCompletion?.fetch?.message);
          setDataFetchLoading(false);
          return;
        }
        Toast.error("Unknown Error");
        setDataFetchLoading(false);
        return;
      },
    }
  );

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
          id: id,
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

  React.useEffect(() => {
    getDashboards({
      variables: {
        modelName: AppModels.Dashboard,
        fields: [
          "id",
          "name",
          "widgets",
          "createdBy",
          "sharedUsers",
          "sharedType",
        ],
        filters: [
          {
            operator: "eq",
            name: "id",
            value: id,
          },
        ],
      },
    });
  }, [id]);

  return (
    <DashboardForm
      data={dashboarById}
      type={AllowedForms.Edit}
      handleSave={(values) => handleDashboardSave(values)}
      savingProcess={savingProcess}
      dataFetchLoading={dataFetchLoading}
      moduleViewSharingData={moduleViewSharingData}
      genericModels={genericModels}
      allModulesFetched={allModulesFetched}
      navigations={navigations}
      allLayoutFetched={allLayoutFetched}
    />
  );
});
