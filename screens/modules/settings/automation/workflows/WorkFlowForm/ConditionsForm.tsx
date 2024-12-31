import { FormikState, FormikValues, useFormikContext } from "formik";
import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import { ICustomField } from "../../../../../../models/ICustomField";
import { AfterSaveCondition } from "./AfterSaveCondition";
import { WorkFlowAction } from "./WorkFlowAction";
import { CustomViewConditionsFilterContainer } from "../../../../crm/generic/GenericAddCustomView/CustomViewConditionsFilterContainer";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../../models/shared";
import { datatypeOperatorDict } from "../../../../../../shared/datatypeOperatorDict";
import { ActionType } from "../../shared/actionTypes";

export type ConditionFormProps = {
  savedExecuteWhen: boolean;
  savedConditionOn: boolean;
  setSavedConditionOn: (value: boolean) => void;
  modules: { value: string; label: string }[];
  fieldsList: ICustomField[];
  editMode: boolean;
  handleConditionFormSave: () => void;
  appName?: string;
  actionTypes: {
    label: string;
    value: string;
    groupBy?: string;
    onClick?: (item: ActionType) => void;
  }[];
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  conditionList: ICriteriaFilterRow[];
  userPreferences: IUserPreference[];
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
};

export const ConditionForm = ({
  savedExecuteWhen,
  savedConditionOn,
  modules,
  fieldsList,
  editMode,
  setSavedConditionOn,
  handleConditionFormSave,
  appName,
  actionTypes,
  setConditionList,
  conditionList,
  userPreferences,
  resetForm,
}: ConditionFormProps) => {
  const { values, handleChange } = useFormikContext<FormikValues>();

  const getModuleLabel = () => {
    return modules.filter((module) => module.value === values["moduleName"])[0]
      ?.label;
  };

  return (
    savedExecuteWhen && (
      <div className="mb-10">
        <div className="mx-16">
          <div className="border-l border-vryno-theme-light-blue h-12"></div>
        </div>
        <div className={`mx-6 mt-4 flex gap-x-10`}>
          <div className="arrow_circle_right flex items-center justify-center w-24 h-24 p-4">
            Condition
          </div>
          {!savedConditionOn && (
            <div className="bg-white rounded-lg w-full p-6">
              <FormRadioButton
                name="executeOn"
                label={`Which ${getModuleLabel()} would you like to apply this rule to?`}
                required={true}
                options={[
                  {
                    value: "matches",
                    label: `${getModuleLabel()} matching certain criteria`,
                  },
                  { value: "all", label: `All ${getModuleLabel()}` },
                ]}
                showOptionsInRow={true}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              {values["executeOn"] === "matches" && fieldsList.length > 0 && (
                <CustomViewConditionsFilterContainer
                  resetForm={resetForm}
                  conditionList={conditionList}
                  setConditionList={setConditionList}
                  fieldsList={fieldsList.filter(
                    (field) =>
                      field.visible === true &&
                      field.dataType in datatypeOperatorDict
                  )}
                  modelName={values["moduleName"]}
                  editMode={true}
                  convertToBoolean={true}
                  uniqueCustomName={"WFCondition"}
                  datatypeOperatorDict={datatypeOperatorDict}
                  excludedName={["conditionList"]}
                  userPreferences={userPreferences}
                />
              )}

              <div className="flex flex-row mb-4 w-full justify-end">
                <div className="w-32 md:w-44">
                  <Button
                    id="save-executeWhen"
                    buttonType="thin"
                    onClick={() => {
                      handleConditionFormSave();
                    }}
                    disabled={!values["executeOn"]}
                    userEventName="condition-save:submit-click"
                  >
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          {savedConditionOn && (
            <AfterSaveCondition
              fieldsList={fieldsList}
              setSavedConditionOn={(value) => setSavedConditionOn(value)}
              executeOn={values["executeOn"]}
              moduleLabel={getModuleLabel()}
              conditionList={conditionList}
              uniqueCustomName={"WFCondition"}
            />
          )}
        </div>
        {savedConditionOn && (
          <WorkFlowAction
            appName={appName}
            editMode={editMode}
            modules={modules}
            actionTypes={actionTypes
              ?.filter((actionType) => {
                if (values["moduleName"] === "note") {
                  if (actionType.value === "webhook") return actionType;
                  else return null;
                } else {
                  return actionType;
                }
              })
              ?.filter((actionType) => actionType)}
          />
        )}
      </div>
    )
  );
};
