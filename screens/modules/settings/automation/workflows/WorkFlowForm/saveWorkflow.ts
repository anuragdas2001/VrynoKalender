import {
  ApolloCache,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import {
  IWorkflowCondition,
  IWorkflowRule,
  IWorkflowRuleAction,
} from "../../../../../../models/shared";
import { toast } from "react-toastify";
import { getEditConfig } from "./workflowHelper";
import moment from "moment";
import { getCorrectTimezone } from "../../../../../../shared/dateTimeTimezoneFormatter";

async function invokeSaveAction(
  responseOnCompletionCondition: FetchResult<any>,
  saveRuleAction: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  ruleAction: IWorkflowRuleAction | undefined,
  responseOnCompletionRule: FetchResult<any>,
  values: Record<string, string>,
  appName: string,
  setSaveProcessing: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void
) {
  if (
    responseOnCompletionCondition.data.save.data &&
    responseOnCompletionCondition.data.save.data.id &&
    responseOnCompletionCondition.data.save.messageKey.includes("-success")
  ) {
    try {
      await saveRuleAction({
        variables: {
          id: ruleAction?.id,
          modelName: "ruleAction",
          saveInput: {
            ruleId: responseOnCompletionRule.data.save.data.id,
            conditionId: responseOnCompletionCondition.data.save.data.id,
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
    !responseOnCompletionCondition.data.save.messageKey.includes("-success")
  ) {
    toast.error(responseOnCompletionCondition.data.save.message);
    return;
  }
}

async function saveConditionAndAction(
  responseOnCompletionRule: FetchResult<any>,
  saveCondition: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  condition: IWorkflowCondition | undefined,
  values: Record<string, any>,
  appName: string,
  saveRuleAction: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  ruleAction: IWorkflowRuleAction | undefined,
  setSaveProcessing: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void
) {
  if (
    responseOnCompletionRule.data.save.data &&
    responseOnCompletionRule.data.save.data.id &&
    responseOnCompletionRule.data.save.messageKey.includes("-success")
  ) {
    try {
      await saveCondition({
        variables: {
          id: condition?.id,
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
            filters: values.executeOn === "matches" ? values.conditionList : [],
            expression: values["expressionWFCondition"],
          },
        },
      }).then(async (responseOnCompletionCondition) => {
        await invokeSaveAction(
          responseOnCompletionCondition,
          saveRuleAction,
          ruleAction,
          responseOnCompletionRule,
          values,
          appName,
          setSaveProcessing
        );
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
}

export async function saveWorkflow(
  setSaveProcessing: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void,
  values: Record<string, string>,
  saveRule: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  rule: IWorkflowRule | undefined,
  appName: string,
  saveCondition: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  condition: IWorkflowCondition | undefined,
  saveRuleAction: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: string } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>,
  ruleAction: IWorkflowRuleAction | undefined,
  timezone?: string
) {
  setSaveProcessing(true);
  try {
    await saveRule({
      variables: {
        id: rule?.id,
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
                        : timezone
                        ? getCorrectTimezone(values.customTime, timezone)
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
      await saveConditionAndAction(
        responseOnCompletionRule,
        saveCondition,
        condition,
        values,
        appName,
        saveRuleAction,
        ruleAction,
        setSaveProcessing
      );
    });
  } catch (error) {
    console.error(error);
  }
}
