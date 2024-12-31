import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import WorkFlowForm from "./WorkFlowForm";
import { getSettingsPathParts } from "../../../../crm/shared/utils/getSettingsPathParts";
import {
  IWorkflowCondition,
  IWorkflowRule,
  IWorkflowRuleAction,
} from "../../../../../../models/shared";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { PageLoader } from "../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { fetchWorkflow } from "./fetchWorkflow";
import { saveWorkflow } from "./saveWorkflow";
import { FormikValues } from "formik";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { observer } from "mobx-react-lite";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";

const WorkFlowEditScreen = observer(({ id }: { id: string }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const userContext = useContext(UserStoreContext);
  const { navigations } = useContext(NavigationStoreContext);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const {
    genericModels,
    allModulesFetched,
    allLayoutFetched,
    userPreferences,
  } = generalModelStore;
  const { user } = userContext;
  const { appName } = getSettingsPathParts();
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const [rule, setRule] = React.useState<IWorkflowRule>();
  const [condition, setCondition] = React.useState<IWorkflowCondition>();
  const [ruleAction, setRuleAction] = React.useState<IWorkflowRuleAction>();
  const [dataFetchProcessing, setDataFetchProcessing] = React.useState(true);

  const [getRule] = useLazyQuery<FetchData<IWorkflowRule>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "workflow",
        },
      },
    }
  );

  const [getCondition] = useLazyQuery<FetchData<IWorkflowCondition>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "workflow",
        },
      },
    }
  );

  const [getRuleAction] = useLazyQuery<
    FetchData<IWorkflowRuleAction>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (fetchedActionData) => {
      if (fetchedActionData?.fetch.data.length) {
        setRuleAction(fetchedActionData.fetch.data[0]);
        setDataFetchProcessing(false);
      }
      setDataFetchProcessing(false);
    },
  });

  React.useEffect(() => {
    fetchWorkflow(
      setDataFetchProcessing,
      getRule,
      id,
      setRule,
      getCondition,
      setCondition,
      getRuleAction
    );
  }, []);

  const [saveRule] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
  });

  const [saveCondition] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
  });

  const [saveRuleAction] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes(`-success`)
      ) {
        toast.success(`Workflow updated successfully`);
        setSaveProcessing(false);
        router.push(`${appName}/workflows`);
        return;
      }
      setSaveProcessing(false);
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleSave = async (values: FormikValues) => {
    await saveWorkflow(
      setSaveProcessing,
      values,
      saveRule,
      rule,
      appName,
      saveCondition,
      condition,
      saveRuleAction,
      ruleAction,
      user?.timezone
    );
  };

  if (dataFetchProcessing) {
    return (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  }
  return (
    <WorkFlowForm
      rule={rule}
      condition={condition}
      ruleAction={ruleAction}
      handleSave={(values) => handleSave(values)}
      editMode={true}
      appName={appName}
      saveLoading={saveProcessing}
      dataFetchProcessing={dataFetchProcessing}
      navigations={navigations}
      genericModels={genericModels}
      allModulesFetched={allModulesFetched}
      allLayoutFetched={allLayoutFetched}
      userPreferences={userPreferences}
    />
  );
});

export default WorkFlowEditScreen;
