import React, { useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import {
  ISimplifiedCustomField,
  getSortedFieldList,
} from "../../../../crm/shared/utils/getOrderedFieldsList";
import { ICustomField } from "../../../../../../models/ICustomField";
import { WorkFlowFormFields } from "./WorkFlowFormFields";
import {
  ICriteriaFilterRow,
  IUserPreference,
  IWorkflowCondition,
  IWorkflowRule,
} from "../../../../../../models/shared";
import { customFilterValueExtractor } from "../../../../crm/generic/GenericAddCustomView/customViewHelpers/customFilterHelper";
import { workflowFilterGenerator } from "./workflowFilterGenerator";
import {
  customViewFilterDataGenerator,
  customViewInitialDataDataGenerator,
} from "../../../../crm/generic/GenericAddCustomView/customViewHelpers/customViewFetchHelpers";
import { updateFieldsListDataTypeForFilters } from "../../../../../layouts/GenericViewComponentMap";
import { User } from "../../../../../../models/Accounts";
import { ActionType } from "../../shared/actionTypes";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type ConnectedWorkFlowFormFieldsProps = {
  handleSave: () => void;
  modules: { value: string; label: string }[];
  loading?: boolean;
  editMode: boolean;
  appName?: string;
  actionTypes: ActionType[];
  rule: Partial<IWorkflowRule> | undefined;
  user: User | null;
  condition: IWorkflowCondition | undefined;
  conditionExecuteList: ICriteriaFilterRow[];
  fieldsList: ICustomField[];
  fieldsListLoading: boolean;
  conditionConditionList: ICriteriaFilterRow[];
  setFieldsList: (value: ICustomField[]) => void;
  setFieldsListLoading: (value: boolean) => void;
  setConditionExecuteList: (value: ICriteriaFilterRow[]) => void;
  setConditionConditionList: (value: ICriteriaFilterRow[]) => void;
  setProcessedFieldList: (value: ISimplifiedCustomField[]) => void;
  processedFieldList: ISimplifiedCustomField[];
  dataFetchProcessing: boolean;
  resetForm: any;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
};

const ConnectedWorkFlowFormFields = ({
  handleSave,
  modules,
  loading,
  editMode,
  appName,
  actionTypes,
  rule,
  user,
  condition,
  conditionExecuteList,
  conditionConditionList,
  fieldsList,
  fieldsListLoading,
  setFieldsList,
  setFieldsListLoading,
  setConditionExecuteList,
  setConditionConditionList,
  setProcessedFieldList,
  processedFieldList,
  dataFetchProcessing,
  resetForm,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
}: ConnectedWorkFlowFormFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [savedExecuteWhen, setSavedExecuteWhen] = useState<boolean>(editMode);
  const [savedConditionOn, setSavedConditionOn] = useState<boolean>(editMode);

  React.useEffect(() => {
    if (allLayoutFetched && values["moduleName"] && allModulesFetched) {
      setFieldsList(
        updateFieldsListDataTypeForFilters(
          getSortedFieldList(
            genericModels[values["moduleName"]]?.fieldsList
              ?.filter((field) => field.name !== "layoutId")
              ?.filter((field) => field.name !== "recordStatus")
              ?.filter(
                (field) => !["image", "recordImage"].includes(field.dataType)
              )
          )
        )
      );
      setFieldsListLoading(false);
    }
  }, [allLayoutFetched, values["moduleName"], allModulesFetched]);

  const handleExecuteWhenSave = () => {
    if (
      ["create", "create_update", "delete"].includes(values.executeWhen || "")
    ) {
      setSavedExecuteWhen(true);
      return;
    }
    if (values.executeWhenEditMoreOptions === "any") {
      setFieldValue("specifiedFieldCondition", []);
      setSavedExecuteWhen(true);
      return;
    }
    const specifiedFieldCondition = workflowFilterGenerator(
      values,
      conditionExecuteList,
      processedFieldList,
      "WFExecute",
      user?.timezone
    );
    if (!specifiedFieldCondition) {
      setSavedExecuteWhen(false);
      return;
    }
    setSavedExecuteWhen(true);
    setFieldValue(
      "specifiedFieldCondition",
      specifiedFieldCondition?.map((val: any, index: number) => {
        return {
          ...val,
          anyValue:
            values[`executeWhenFieldListoperator${index + 1}`] === "any"
              ? true
              : false,
        };
      }) || []
    );
  };

  const handleConditionFormSave = () => {
    if (values.executeOn === "all" || values.executeOn === undefined) {
      setFieldValue("conditionList", []);
      setSavedConditionOn(true);
      return;
    }
    let filterData = workflowFilterGenerator(
      values,
      conditionConditionList,
      processedFieldList,
      "WFCondition",
      user?.timezone
    );
    if (!filterData) {
      setSavedConditionOn(false);
      return;
    }
    setSavedConditionOn(true);
    setFieldValue("conditionList", filterData || []);
  };
  React.useEffect(() => {
    if (fieldsList.length) {
      setProcessedFieldList(
        fieldsList.map((field: ICustomField) => {
          return {
            value: field.name,
            label: field.label["en"],
            dataType: field.dataType,
            systemDefined: field.systemDefined,
          };
        })
      );
    }
  }, [fieldsList]);
  React.useEffect(() => {
    if (editMode && !dataFetchProcessing && processedFieldList.length) {
      let fieldsListData: Record<string, any> = {};
      let specifiedFieldCondition = [],
        filterData = [];
      if (
        rule?.typeConfig?.editConfig?.filters?.length &&
        Object.keys(conditionExecuteList?.[0]).length === 2
      ) {
        const executeFilterData =
          customFilterValueExtractor(rule?.typeConfig?.editConfig?.filters) ||
          [];
        const generatedExecuteListData = customViewFilterDataGenerator(
          executeFilterData,
          processedFieldList,
          "WFExecute"
        );
        let executeFieldInitialData = customViewInitialDataDataGenerator(
          executeFilterData,
          processedFieldList,
          "WFExecute"
        );
        fieldsListData = { ...fieldsListData, ...executeFieldInitialData };
        setFieldValue(
          "expressionWFExecute",
          rule?.typeConfig?.editConfig?.expression || ""
        );
        setConditionExecuteList(generatedExecuteListData);
        specifiedFieldCondition = workflowFilterGenerator(
          values,
          generatedExecuteListData,
          processedFieldList,
          "WFExecute"
        );
      }
      if (
        condition?.filters?.length &&
        Object.keys(conditionConditionList?.[0]).length === 2
      ) {
        const conditionFilterData = condition?.filters || [];
        const generatedConditionListData = customViewFilterDataGenerator(
          conditionFilterData,
          processedFieldList,
          "WFCondition"
        );
        let conditionFieldInitialData = customViewInitialDataDataGenerator(
          conditionFilterData,
          processedFieldList,
          "WFCondition"
        );
        fieldsListData = { ...fieldsListData, ...conditionFieldInitialData };
        setFieldValue("expressionWFCondition", condition.expression);
        setConditionConditionList(generatedConditionListData);
        filterData = workflowFilterGenerator(
          values,
          generatedConditionListData,
          processedFieldList,
          "WFCondition"
        );
      }
      for (const key in fieldsListData) {
        setFieldValue(`${key}`, fieldsListData[key]);
      }
      setFieldValue(
        "specifiedFieldCondition",
        specifiedFieldCondition
          ? specifiedFieldCondition?.map((val: any, index: number) => {
              return {
                ...val,
                anyValue:
                  values[`executeWhenFieldListoperator${index + 1}`] === "any"
                    ? true
                    : false,
              };
            })
          : []
      );

      setFieldValue("conditionList", filterData || []);
    }
  }, [processedFieldList, dataFetchProcessing]);
  return (
    <WorkFlowFormFields
      editMode={editMode}
      savedExecuteWhen={savedExecuteWhen}
      savedConditionOn={savedConditionOn}
      modules={modules}
      user={user}
      fieldsList={fieldsList}
      fieldsListLoading={fieldsListLoading}
      loading={loading}
      handleSave={handleSave}
      setSavedExecuteWhen={(value) => setSavedExecuteWhen(value)}
      setSavedConditionOn={(value) => setSavedConditionOn(value)}
      handleConditionFormSave={handleConditionFormSave}
      handleExecuteWhenSave={handleExecuteWhenSave}
      appName={appName}
      actionTypes={actionTypes}
      conditionExecuteList={conditionExecuteList}
      conditionConditionList={conditionConditionList}
      setConditionExecuteList={setConditionExecuteList}
      setConditionConditionList={setConditionConditionList}
      resetForm={resetForm}
      userPreferences={userPreferences}
    />
  );
};
export default ConnectedWorkFlowFormFields;
