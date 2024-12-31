import { LazyQueryResult, QueryLazyOptions } from "@apollo/client";
import {
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import {
  IWorkflowCondition,
  IWorkflowRule,
  IWorkflowRuleAction,
} from "../../../../../../models/shared";
import { customFilterValueExtractor } from "../../../../crm/generic/GenericAddCustomView/customViewHelpers/customFilterHelper";
import { toast } from "react-toastify";

export function fetchWorkflow(
  setDataFetchProcessing: (
    value: ((prevState: boolean) => boolean) | boolean
  ) => void,
  getRule: (
    options?: QueryLazyOptions<FetchVars>
  ) => Promise<LazyQueryResult<FetchData<IWorkflowRule>, FetchVars>>,
  id: string,
  setRule: (
    value:
      | ((prevState: IWorkflowRule | undefined) => IWorkflowRule | undefined)
      | IWorkflowRule
      | undefined
  ) => void,
  getCondition: (
    options?: QueryLazyOptions<FetchVars>
  ) => Promise<LazyQueryResult<FetchData<IWorkflowCondition>, FetchVars>>,
  setCondition: (
    value:
      | ((
          prevState: IWorkflowCondition | undefined
        ) => IWorkflowCondition | undefined)
      | IWorkflowCondition
      | undefined
  ) => void,
  getRuleAction: (
    options?: QueryLazyOptions<FetchVars>
  ) => Promise<LazyQueryResult<FetchData<IWorkflowRuleAction>, FetchVars>>
) {
  setDataFetchProcessing(true);
  getRule({
    variables: {
      modelName: "rule",
      fields: [
        "id",
        "name",
        "recordModuleName",
        "recordServiceName",
        "typeConfig",
        "typeKey",
        "description",
        "recordStatus",
        "createdAt",
        "createdBy",
        "updatedAt",
        "updatedBy",
      ],
      filters: [{ name: "id", operator: "eq", value: id }],
    },
  }).then(async (fetchedRuleData) => {
    if (fetchedRuleData.data?.fetch.data.length) {
      setRule(fetchedRuleData.data.fetch.data[0]);
      getCondition({
        variables: {
          modelName: "condition",
          fields: [
            "id",
            "recordModuleName",
            "recordServiceName",
            "typeConfig",
            "filters",
            "expression",
            "typeKey",
            "ruleId",
            "recordStatus",
            "createdAt",
            "createdBy",
            "updatedAt",
            "updatedBy",
          ],
          filters: [
            {
              name: "ruleId",
              operator: "eq",
              value: fetchedRuleData.data.fetch.data[0].id,
            },
          ],
        },
      }).then(async (fetchedConditionData) => {
        if (
          fetchedConditionData.data?.fetch.data.length &&
          fetchedRuleData.data?.fetch.data.length
        ) {
          let fetchedData = fetchedConditionData.data.fetch.data[0];
          const updatedFilterData = customFilterValueExtractor(
            fetchedData.filters
          );
          if (updatedFilterData) {
            fetchedData = { ...fetchedData, filters: updatedFilterData };
          }
          setCondition(fetchedData);
          getRuleAction({
            variables: {
              modelName: "ruleAction",
              fields: ["id", "typeKey", "ruleId", "conditionId", "actionIds"],
              filters: [
                {
                  name: "ruleId",
                  operator: "eq",
                  value: fetchedRuleData.data?.fetch.data[0].id,
                },
                {
                  name: "conditionId",
                  operator: "eq",
                  value: fetchedData.id,
                },
              ],
            },
          });
        } else if (fetchedConditionData.data?.fetch.data.length == 0) {
          toast.error(
            "No condition data found, error while saving, please set values."
          );
          setDataFetchProcessing(false);
        }
      });
    }
  });
}
