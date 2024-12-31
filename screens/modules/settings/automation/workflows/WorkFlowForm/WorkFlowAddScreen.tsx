import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import WorkFlowForm from "./WorkFlowForm";
import { getSettingsPathParts } from "../../../../crm/shared/utils/getSettingsPathParts";
import { getEditConfig } from "./workflowHelper";
import moment from "moment";
import { FormikValues } from "formik";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";
import { observer } from "mobx-react-lite";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";

const WorkFlowAddScreen = observer(() => {
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
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const { appName } = getSettingsPathParts();

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
        toast.success(`Workflow created successfully`);
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
    setSaveProcessing(true);
    try {
      await saveRule({
        variables: {
          id: null,
          modelName: "rule",
          saveInput: {
            name: values.name,
            recordModuleName: values.moduleName,
            recordServiceName: appName,
            typeKey: values.typeKey,
            typeConfig: {
              triggeringEvent: values.executeWhen,
              editConfig: getEditConfig(values.executeWhen, values),
              schedulerConfig:
                values.typeKey === "datetime-field-action"
                  ? {
                      executorField: values.executorField,
                      executionTime:
                        values.executionTime === "same"
                          ? null
                          : user?.timezone
                          ? getCorrectTimezone(
                              values.customTime,
                              user?.timezone
                            )
                              ?.split("T")[1]
                              .replace("Z", "")
                          : moment(values.customTime)
                              .toISOString()
                              .split("T")[1]
                              .replace("Z", ""),
                      frequency: values.frequency,
                      beforeAfterEvent: {
                        type: values?.timeFrame.includes("after")
                          ? "after"
                          : "before",
                        days: values?.timeFrame.includes("days")
                          ? values?.repetitions
                          : null,
                        weeks: values?.timeFrame.includes("weeks")
                          ? values?.repetitions
                          : null,
                        months: values?.timeFrame.includes("months")
                          ? values?.repetitions
                          : null,
                        years: values?.timeFrame.includes("years")
                          ? values?.repetitions
                          : null,
                      },
                    }
                  : null,
            },
            description: values.description,
          },
        },
      }).then(async (responseOnCompletionRule) => {
        if (
          responseOnCompletionRule.data.save.data &&
          responseOnCompletionRule.data.save.data.id &&
          responseOnCompletionRule.data.save.messageKey.includes("-success")
        ) {
          try {
            await saveCondition({
              variables: {
                id: null,
                modelName: "condition",
                saveInput: {
                  ruleId: responseOnCompletionRule.data.save.data.id,
                  recordModuleName: values.moduleName,
                  recordServiceName: appName,
                  typeKey: values.executeOn,
                  typeConfig:
                    values.executeOn === "matches"
                      ? values.conditionList.map(
                          (val: {
                            name: string;
                            operator: string;
                            value: string | null;
                            logicalOperator: string | null;
                          }) => {
                            if (val.logicalOperator) {
                              return {
                                targetField: val.name,
                                targetCondition: val.operator,
                                targetValue: val.value,
                                logicalOperator: val?.logicalOperator,
                              };
                            } else {
                              return {
                                targetField: val.name,
                                targetCondition: val.operator,
                                targetValue: val.value,
                              };
                            }
                          }
                        )
                      : [],
                  filters:
                    values.executeOn === "matches" ? values.conditionList : [],
                  expression: values["expressionWFCondition"],
                },
              },
            }).then(async (responseOnCompletionCondition) => {
              if (
                responseOnCompletionCondition.data.save.data &&
                responseOnCompletionCondition.data.save.data.id &&
                responseOnCompletionCondition.data.save.messageKey.includes(
                  "-success"
                )
              ) {
                try {
                  await saveRuleAction({
                    variables: {
                      id: null,
                      modelName: "ruleAction",
                      saveInput: {
                        ruleId: responseOnCompletionRule.data.save.data.id,
                        conditionId:
                          responseOnCompletionCondition.data.save.data.id,
                        actionIds: Array.isArray(values.actionId)
                          ? [...values.actionId]
                          : values.actionId
                          ? [values.actionId]
                          : values.actionId,
                        typeKey: values.actionType,
                      },
                    },
                  });
                } catch (error) {}
              }
              setSaveProcessing(false);
              if (
                responseOnCompletionCondition.data.save.messageKey &&
                !responseOnCompletionCondition.data.save.messageKey.includes(
                  "-success"
                )
              ) {
                toast.error(responseOnCompletionCondition.data.save.message);
                return;
              }
            });
          } catch (error) {}
        }
        setSaveProcessing(false);
        if (
          responseOnCompletionRule.data.save.messageKey &&
          !responseOnCompletionRule.data.save.messageKey.includes("-success")
        ) {
          toast.error(responseOnCompletionRule.data.save.message);
          return;
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WorkFlowForm
      rule={{
        typeKey: "record-action",
        typeConfig: {
          triggeringEvent: "create",
          schedulerConfig: {
            frequency: "once",
            beforeAfterEvent: {
              type: "after",
              days: 1,
              weeks: null,
              months: null,
              years: null,
            },
          },
        },
      }}
      handleSave={(values) => handleSave(values)}
      editMode={false}
      dataFetchProcessing={false}
      appName={appName}
      saveLoading={saveProcessing}
      condition={undefined}
      navigations={navigations}
      genericModels={genericModels}
      allModulesFetched={allModulesFetched}
      allLayoutFetched={allLayoutFetched}
      userPreferences={userPreferences}
    />
  );
});

export default WorkFlowAddScreen;
