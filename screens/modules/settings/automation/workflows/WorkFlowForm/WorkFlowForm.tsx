import React, { useContext } from "react";
import { Formik, FormikValues } from "formik";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import * as Yup from "yup";
import ConnectedWorkFlowFormFields from "./ConnectedWorkFlowFormFields";
import {
  ICriteriaFilterRow,
  IUserPreference,
  IWorkflowCondition,
  IWorkflowRule,
  IWorkflowRuleAction,
} from "../../../../../../models/shared";
import { get } from "lodash";
import { PageLoader } from "../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { getSortedModuleByNavigation } from "../../../../crm/shared/utils/getSortedModuleListAccordingToNavigation";
import { ISimplifiedCustomField } from "../../../../crm/shared/utils/getOrderedFieldsList";
import moment from "moment";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { ICustomField } from "../../../../../../models/ICustomField";
import { actionTypes } from "../../shared/actionTypes";
import { INavigation } from "../../../../../../models/INavigation";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

let initialValues = {
  name: "",
  moduleName: null,
  executeWhen: [],
  executeOn: "",
  description: "",
  conditionList: [],
  status: "",
  emailrecievingUsers: [],
};

export type WorkFlowFormProps = {
  rule?: Partial<IWorkflowRule>;
  condition: IWorkflowCondition | undefined;
  ruleAction?: IWorkflowRuleAction;
  handleSave: (values: FormikValues) => void;
  editMode: boolean;
  appName: string;
  saveLoading?: boolean;
  dataFetchProcessing: boolean;
  navigations: INavigation[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
};

const WorkFlowForm = ({
  rule,
  condition,
  ruleAction,
  handleSave,
  editMode,
  appName,
  saveLoading,
  dataFetchProcessing,
  navigations,
  genericModels,
  allModulesFetched,
  allLayoutFetched,
  userPreferences,
}: WorkFlowFormProps) => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const [modulesFetched, setModulesFetched] = React.useState<IModuleMetadata[]>(
    []
  );
  const [fieldsListLoading, setFieldsListLoading] =
    React.useState<boolean>(true);
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [processedFieldList, setProcessedFieldList] = React.useState<
    ISimplifiedCustomField[]
  >([]);
  const [moduleFetchLoading, setModuleFetchLoading] =
    React.useState<boolean>(true);

  const [conditionConditionList, setConditionConditionList] = React.useState<
    ICriteriaFilterRow[]
  >([{ fieldNameWFCondition: "", valueWFCondition: "" }]);
  const [conditionExecuteList, setConditionExecuteList] = React.useState<
    ICriteriaFilterRow[]
  >([{ fieldNameWFExecute: "", valueWFExecute: "" }]);

  const validationSchema = Yup.object().shape({
    moduleName: Yup.string().required("Please select one module"),
    name: Yup.string().required("Please enter a name for the rule"),
    actions: Yup.string().required("Please select on action type"),
    executeOn: Yup.string().required("Please choose a option"),
    actionType: Yup.string().required("Please choose a option"),
    executeWhen: Yup.string().required(
      "Please choose a option to perform action when"
    ),
  });

  React.useEffect(() => {
    if (allModulesFetched) {
      let responseData = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (
              genericModels[model]?.moduleInfo?.customizationAllowed === true ||
              ["crm.note"].indexOf(
                genericModels[model]?.moduleInfo?.uniqueName
              ) != -1
            )
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined)
          ?.filter(
            (moduleItem: IModuleMetadata) =>
              moduleItem.name !== "quotedItem" &&
              moduleItem.name !== "orderedItem" &&
              moduleItem.name !== "invoicedItem" &&
              moduleItem.name !== "purchaseItem"
          ),
      ];
      setModulesFetched([...responseData]);
      setModuleFetchLoading(false);
    }
  }, [allModulesFetched]);

  if (moduleFetchLoading) {
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
    <>
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <Formik
          initialValues={{
            ...initialValues,
            moduleName: get(rule, "recordModuleName", ""),
            name: rule?.name,
            executeWhen: rule?.typeConfig?.triggeringEvent,
            typeKey: rule?.typeKey,
            description: rule?.description,
            executeOn: condition?.typeKey,
            conditionList: condition?.filters,
            actionId: ruleAction?.actionIds,
            actionType: ruleAction?.typeKey ?? "instant",
            specifiedFieldCondition: get(
              rule?.typeConfig?.editConfig,
              "specifiedFieldCondition",
              []
            ),
            executeWhenEditMoreOptions:
              rule?.typeConfig?.triggeringEvent === "update"
                ? rule?.typeConfig?.editConfig?.anyField
                  ? "any"
                  : "specific"
                : false,
            executorField: rule?.typeConfig?.schedulerConfig?.executorField,
            executionTime:
              rule?.typeConfig?.schedulerConfig?.executionTime === null ||
              rule?.typeConfig?.schedulerConfig?.executionTime === undefined
                ? "same"
                : "custom",
            customTime:
              rule?.typeConfig?.schedulerConfig?.executionTime === null ||
              rule?.typeConfig?.schedulerConfig?.executionTime === undefined
                ? moment(new Date()).toISOString()
                : moment(new Date())
                    .toISOString()
                    .split("T")[0]
                    .concat(
                      `T${rule?.typeConfig?.schedulerConfig?.executionTime}`
                    ),
            frequency: rule?.typeConfig?.schedulerConfig?.frequency,
            repetitions:
              rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.days ??
              rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.weeks ??
              rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.months ??
              rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.years,
            timeFrame:
              rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.type ===
              "before"
                ? rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.days
                  ? "daysbefore"
                  : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.weeks
                  ? "weeksbefore"
                  : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.months
                  ? "monthsbefore"
                  : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.weeks
                  ? "yearsbefore"
                  : "daysbefore"
                : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.days
                ? "daysafter"
                : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.weeks
                ? "weeksafter"
                : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.months
                ? "monthsafter"
                : rule?.typeConfig?.schedulerConfig?.beforeAfterEvent?.years
                ? "yearsafter"
                : "daysafter",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSave(values);
          }}
        >
          {({ handleSubmit, resetForm }) => (
            <ConnectedWorkFlowFormFields
              handleSave={handleSubmit}
              modules={getSortedModuleByNavigation(
                navigations,
                modulesFetched
              )?.map((module) => {
                return { value: module.name, label: module.label?.en };
              })}
              loading={saveLoading}
              editMode={editMode}
              appName={appName}
              actionTypes={actionTypes}
              rule={rule}
              user={user}
              fieldsList={fieldsList}
              fieldsListLoading={fieldsListLoading}
              setFieldsList={setFieldsList}
              setFieldsListLoading={setFieldsListLoading}
              condition={condition}
              conditionExecuteList={conditionExecuteList}
              conditionConditionList={conditionConditionList}
              setConditionExecuteList={(value: ICriteriaFilterRow[]) =>
                setConditionExecuteList(value)
              }
              setConditionConditionList={(value: ICriteriaFilterRow[]) =>
                setConditionConditionList(value)
              }
              processedFieldList={processedFieldList}
              setProcessedFieldList={(value: ISimplifiedCustomField[]) =>
                setProcessedFieldList(value)
              }
              dataFetchProcessing={dataFetchProcessing}
              resetForm={resetForm}
              genericModels={genericModels}
              allModulesFetched={allModulesFetched}
              allLayoutFetched={allLayoutFetched}
              userPreferences={userPreferences}
            />
          )}
        </Formik>
      </form>
    </>
  );
};

export default WorkFlowForm;
