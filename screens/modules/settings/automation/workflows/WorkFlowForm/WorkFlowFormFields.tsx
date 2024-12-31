import React, { useEffect, useRef } from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import EditBoxLineIcon from "remixicon-react/EditBoxLineIcon";
import SaveIcon from "remixicon-react/SaveLineIcon";
import FormTextAreaBox from "../../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useRouter } from "next/router";
import { FormikValues, useFormikContext } from "formik";
import { ConditionForm } from "./ConditionsForm";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { ExecuteWhenFieldList } from "./ExecuteWhenFieldList";
import RequiredIndicator from "../../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";
import {
  WorkFlowFormFieldsProps,
  dateAfterOptions,
  dateBeforeOptions,
  executeWhenOptions,
} from "./WorkFlowFormFieldsPropsAndUtils";
import FormTimePicker from "../../../../../../components/TailwindControls/Form/TimePicker/FormTimePicker";
import _ from "lodash";
import { RenderWorkflowCondition } from "./RenderWorkflowCondition";

export const WorkFlowFormFields = ({
  editMode,
  savedExecuteWhen,
  savedConditionOn,
  modules,
  fieldsList,
  fieldsListLoading,
  loading,
  appName,
  user,
  actionTypes,
  handleSave,
  setSavedExecuteWhen,
  setSavedConditionOn,
  handleConditionFormSave,
  handleExecuteWhenSave,
  conditionExecuteList,
  conditionConditionList,
  userPreferences,
  setConditionExecuteList,
  setConditionConditionList,
  resetForm,
}: WorkFlowFormFieldsProps) => {
  const router = useRouter();
  const { values, handleChange, setFieldValue } =
    useFormikContext<FormikValues>();
  const [dateOptions, setDateOptions] = React.useState<
    { value: string; label: string }[]
  >([...dateBeforeOptions, ...dateAfterOptions]);

  React.useEffect(() => {
    if (values["executorField"] && fieldsList?.length > 0) {
      const dateFields = fieldsList
        ?.filter(
          (field) => field.dataType === "date" || field.dataType === "datetime"
        )
        ?.filter((field) => field.visible);
      const selectedField = dateFields?.filter(
        (field) => field.name === values["executorField"]
      );
      if (selectedField?.length > 0 && !selectedField[0].addInForm) {
        setDateOptions([...dateAfterOptions]);
      } else {
        setDateOptions([...dateBeforeOptions, ...dateAfterOptions]);
      }
    }
  }, [values["executorField"]]);

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });

  const executeWhenOptionsLabel = savedExecuteWhen
    ? executeWhenOptions?.filter(
        (option) => option.value === values["executeWhen"]
      )[0]?.label
    : "";

  return (
    <>
      <GenericBackHeader
        heading={`${editMode ? "Edit" : "Create"} WorkFlow`}
        onClick={() => {
          router.push("crm/workflows");
        }}
      >
        <div>
          <Button
            id="save-workflow"
            buttonType="thin"
            kind="primary"
            loading={loading}
            disabled={loading || !values["actionId"]}
            onClick={() => handleSave()}
            userEventName="workflow-save:submit-click"
          >
            <span className="flex items-center justify-center gap-x-1">
              <SaveIcon size={18} />
              <span className="text-base">Save</span>
            </span>
          </Button>
        </div>
      </GenericBackHeader>
      <div ref={heightRef} className="p-4 overflow-y-auto">
        <div
          className={`px-6 ${
            values["moduleName"] && values["name"]
              ? "transition duration-300 ease-out translate-y-1"
              : ""
          } `}
        >
          <div className="p-4 bg-white rounded-xl">
            <div className="sm:grid sm:grid-cols-2 gap-x-4">
              <FormDropdown
                name="moduleName"
                label="Module Name"
                options={modules}
                required={true}
                disabled={editMode || values["actions"]}
                onChange={async (selectedOption) => {
                  setFieldValue(
                    "moduleName",
                    selectedOption.currentTarget.value
                  );
                }}
              />
              <FormInputBox
                name="name"
                label="Rule Name"
                required={true}
                disabled={!values["moduleName"]}
              />
            </div>
            <FormTextAreaBox
              name="description"
              label="Rule Description"
              rows={1}
              disabled={!values["moduleName"]}
            />
          </div>
          <div
            className={`${
              values["moduleName"] && values["name"] ? "" : "hidden"
            } ${savedExecuteWhen ? "m-6 mb-0" : "m-6"}  py-2 flex gap-x-10`}
          >
            <div className="w-24">
              <Button
                id="execute-when-button"
                buttonType="pointedRightBox"
                userEventName="workflow-execute-when-click"
              >
                <span>When</span>
              </Button>
            </div>
            <div className="bg-white rounded-xl px-6 w-full">
              {!savedExecuteWhen && (
                <>
                  <FormRadioButton
                    name="typeKey"
                    label="Execute this rule based on"
                    required={true}
                    disabled={
                      !values["moduleName"] ||
                      editMode ||
                      (!fieldsListLoading &&
                        fieldsList
                          ?.filter(
                            (field) =>
                              field.dataType === "date" ||
                              field.dataType === "datetime"
                          )
                          ?.filter((field) => field.visible)?.length <= 0)
                    }
                    options={[
                      { value: "record-action", label: "Record Action" },
                      {
                        value: "datetime-field-action",
                        label: "Date/Time field",
                      },
                    ]}
                    showOptionsInRow={true}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value === "datetime-field-action") {
                        setFieldValue("executeWhen", "create_update");
                      } else {
                        setFieldValue("executeWhen", "create");
                      }
                    }}
                  />
                  {values["typeKey"] === "datetime-field-action" ? (
                    <div className="grid grid-cols-2 gap-x-6 max-w-[70%]">
                      <FormDropdown
                        name="executorField"
                        label="Choose field to execute rule"
                        required={true}
                        options={fieldsList
                          ?.filter(
                            (field) =>
                              field.dataType === "date" ||
                              field.dataType === "datetime"
                          )
                          ?.filter((field) => field.visible)
                          ?.map((field) => {
                            return { value: field.name, label: field.label.en };
                          })}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                      <div className={`flex flex-col`}>
                        <label
                          className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray`}
                        >
                          {`Define execution date`}
                          <RequiredIndicator required={true} />
                        </label>
                        <div className={`grid grid-cols-4`}>
                          <FormInputBox
                            name="repetitions"
                            type="number"
                            disabled={!values[`executorField`]}
                          />
                          <div className="col-span-3">
                            <FormDropdown
                              name="timeFrame"
                              disabled={!values[`executorField`]}
                              options={dateOptions}
                            />
                          </div>
                        </div>
                      </div>
                      <FormRadioButton
                        name="executionTime"
                        disabled={
                          typeof (values[`repetitions`] as Number) !==
                            "number" ||
                          values["repetitions"] < 0 ||
                          !values[`timeFrame`]
                        }
                        label="Execute time"
                        required={true}
                        options={
                          values["executorField"] &&
                          fieldsList?.length > 0 &&
                          fieldsList
                            ?.filter(
                              (field) => field.name === values["executorField"]
                            )
                            ?.filter((field) => field.visible)?.length > 0 &&
                          fieldsList?.filter(
                            (field) => field.name === values["executorField"]
                          )[0].dataType === "date"
                            ? [
                                {
                                  value: "custom",
                                  label: (
                                    <FormTimePicker
                                      name={`customTime`}
                                      disabled={
                                        typeof (values[
                                          `repetitions`
                                        ] as Number) !== "number" ||
                                        values["repetitions"] < 0 ||
                                        !values[`timeFrame`] ||
                                        !(values["executionTime"] === "custom")
                                      }
                                      timezone={user?.timezone}
                                    />
                                  ),
                                },
                              ]
                            : [
                                {
                                  value: "same",
                                  label: "Same as time in field",
                                },
                                {
                                  value: "custom",
                                  label: (
                                    <FormTimePicker
                                      name={`customTime`}
                                      disabled={
                                        typeof (values[
                                          `repetitions`
                                        ] as Number) !== "number" ||
                                        values["repetitions"] < 0 ||
                                        !values[`timeFrame`] ||
                                        !(values["executionTime"] === "custom")
                                      }
                                    />
                                  ),
                                },
                              ]
                        }
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                      <FormDropdown
                        name="frequency"
                        label="Recurr"
                        disabled={!values[`executionTime`]}
                        options={[
                          {
                            value: "once",
                            label: "Once",
                          },
                          { value: "daily", label: "Every Day" },
                          { value: "weekly", label: "Every Week" },
                          { value: "monthly", label: "Every Month" },
                          { value: "yearly", label: "Every Year" },
                        ]}
                      />
                    </div>
                  ) : values["typeKey"] === "record-action" ? (
                    <FormRadioButton
                      name="executeWhen"
                      label="When do you want to execute this rule?"
                      required={true}
                      disabled={!values["moduleName"]}
                      options={executeWhenOptions.map((option) => {
                        return {
                          label: option.label,
                          value: option.value,
                          render:
                            option.value === "update" ? (
                              <div className={`w-full border rounded-md px-4`}>
                                <FormRadioButton
                                  name="executeWhenEditMoreOptions"
                                  required={true}
                                  options={[
                                    {
                                      value: "any",
                                      label: "Any field gets modified.",
                                      render: undefined,
                                    },
                                    {
                                      value: "specific",
                                      label: "Specific field(s) gets modified.",
                                      render: (
                                        <ExecuteWhenFieldList
                                          fieldsList={fieldsList.filter(
                                            (field) =>
                                              field.dataType !== "autoNumber"
                                          )}
                                          resetForm={resetForm}
                                          conditionList={conditionExecuteList}
                                          setConditionList={
                                            setConditionExecuteList
                                          }
                                          userPreferences={userPreferences}
                                        />
                                      ),
                                    },
                                  ]}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                />
                              </div>
                            ) : undefined,
                        };
                      })}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  ) : null}
                </>
              )}
              {savedExecuteWhen && (
                <div className="flex m-4 gap-x-4 items-center">
                  <span className="text-sm text-vryno-icon">
                    {`${executeWhenOptionsLabel}: ${
                      executeWhenOptionsLabel === "Create"
                        ? `This rule will be executed when a ${values["moduleName"]} is created.`
                        : executeWhenOptionsLabel === "Modify"
                        ? `This rule will be executed when a ${values["moduleName"]} is modified with conditions as:`
                        : executeWhenOptionsLabel === "Delete"
                        ? `This rule will be executed when a ${values["moduleName"]} is deleted.`
                        : values["typeKey"] === "datetime-field-action"
                        ? `This rule will execute when we create or modify ${
                            values["typeKey"] === "datetime-field-action" &&
                            fieldsList?.length > 0
                              ? `(${
                                  fieldsList
                                    ?.filter(
                                      (field) =>
                                        field.name === values["executorField"]
                                    )
                                    ?.filter((field) => field.visible)?.length >
                                  0
                                    ? _.get(
                                        fieldsList.filter(
                                          (field) =>
                                            field.name ===
                                            values[`executorField`]
                                        )[0].label,
                                        "en",
                                        ""
                                      )
                                    : values["executorField"]
                                }) field.`
                              : "."
                          }`
                        : `This rule will be executed when a ${values["moduleName"]} is created or modified.`
                    }`}
                    {executeWhenOptionsLabel === "Modify" ? (
                      values["executeWhenEditMoreOptions"] == "any" ? (
                        <div>ANY field is modified</div>
                      ) : (
                        <div>
                          <RenderWorkflowCondition
                            conditionList={conditionExecuteList}
                            fieldsList={fieldsList}
                            uniqueCustomName={"WFExecute"}
                            conditionListName={"specifiedFieldCondition"}
                          />
                        </div>
                      )
                    ) : (
                      ""
                    )}
                  </span>
                  <Button
                    id="workflow-edit-icon"
                    customStyle="w-8 h-8 rounded-full bg-vryno-theme-blue flex items-center justify-center cursor-pointer"
                    onClick={() => setSavedExecuteWhen(false)}
                    userEventName="workflow-edit:action-click"
                  >
                    <EditBoxLineIcon size={18} color="white" />
                  </Button>
                </div>
              )}
              {!savedExecuteWhen && (
                <div className="flex flex-row mb-4 w-full justify-end">
                  <div>
                    <Button
                      id="save-executeWhen"
                      buttonType="thin"
                      onClick={() => {
                        handleExecuteWhenSave();
                      }}
                      disabled={
                        !values["executeWhen"] ||
                        !values["moduleName"] ||
                        !values["name"] ||
                        (values["typeKey"] === "datetime-field-action" &&
                          !values["executorField"]) ||
                        values["repetitions"] < 0
                      }
                      userEventName="workflow-execute-when:save-click"
                    >
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ConditionForm
            savedExecuteWhen={savedExecuteWhen}
            modules={modules}
            fieldsList={fieldsList}
            editMode={editMode}
            handleConditionFormSave={handleConditionFormSave}
            savedConditionOn={savedConditionOn}
            setSavedConditionOn={(value) => setSavedConditionOn(value)}
            appName={appName}
            actionTypes={actionTypes}
            resetForm={resetForm}
            conditionList={conditionConditionList}
            setConditionList={setConditionConditionList}
            userPreferences={userPreferences}
          />
        </div>
      </div>
    </>
  );
};
