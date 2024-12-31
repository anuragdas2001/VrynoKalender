import React, { useContext } from "react";
import { FormikValues, useFormikContext } from "formik";
import FormRadioButton from "../../../../../../components/TailwindControls/Form/RadioButton/FormRadioButton";
import FormDateTimePicker from "../../../../../../components/TailwindControls/Form/DateTimePicker/FormDateTimePicker";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { IWorkflowAction } from "../../../../../../models/shared";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { useRouter } from "next/router";
import { SupportedLabelLocations } from "../../../../../../components/TailwindControls/SupportedLabelLocations";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import _ from "lodash";
import FormMultipleValuesDropdown from "../../../../../../components/TailwindControls/Form/MultipleValuesDropdown/FormMultipleValuesDropdown";
import { ActionType, activitiesName } from "../../shared/actionTypes";

const actionFields = [
  "id",
  "name",
  "recordModuleName",
  "recordServiceName",
  "typeConfig",
  "typeKey",
  "ruleId",
  "conditionId",
  "executorConfig",
  "executorTypeKey",
  "recordStatus",
  "createdAt",
  "createdBy",
  "updatedAt",
  "updatedBy",
];

export type WorkFlowActionProps = {
  appName?: string;
  editMode: boolean;
  modules: { value: string; label: string }[];
  actionTypes: {
    label: string;
    value: string;
    groupBy?: string;
    onClick?: (item: ActionType) => void;
  }[];
};
export const WorkFlowAction = ({
  appName,
  editMode,
  modules,
  actionTypes,
}: WorkFlowActionProps) => {
  const router = useRouter();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>();
  const [actions, setActions] = React.useState<IWorkflowAction[]>([]);
  const [nonGroupedActionTypes, setNonGroupedActionTypes] = React.useState<
    ActionType[]
  >([]);
  const [groupedActionTypes, setGroupedActionTypes] = React.useState<
    | {
        [groupLabel: string]: (
          | {
              label: string;
              value: string | null;
              visible?: boolean | undefined;
              extraInfoField?: boolean | undefined;
            }
          | undefined
        )[];
      }
    | undefined
  >({});
  const [currentSelectedAction, setCurrentSelectedAction] = React.useState<{
    label: string;
    value: string;
    groupBy?: string;
    onClick?: (item: ActionType) => void;
  }>();

  const [getAction] = useLazyQuery<FetchData<IWorkflowAction>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "workflow",
        },
      },
      onCompleted: (fetchedActionData) => {
        if (fetchedActionData?.fetch?.messageKey.includes("-success")) {
          setActions(fetchedActionData.fetch.data);
        }
      },
    }
  );

  React.useEffect(() => {
    if (!values["actions"] || values["moduleName"]) return;
    getAction({
      variables: {
        modelName: "action",
        fields: [...actionFields],
        filters: [
          { name: "executorTypeKey", operator: "eq", value: values["actions"] },
          {
            name: "recordModuleName",
            operator: "eq",
            value: values["moduleName"],
          },
        ],
      },
    });
  }, [values["actions"], values["moduleName"]]);

  React.useEffect(() => {
    if (!editMode) return;
    getAction({
      variables: {
        modelName: "action",
        fields: [...actionFields],
        filters: [{ name: "id", operator: "in", value: values["actionId"] }],
      },
    }).then((fetchedActionData) => {
      if (
        fetchedActionData?.data?.fetch.data &&
        fetchedActionData?.data?.fetch.data?.length > 0 &&
        fetchedActionData?.data?.fetch?.messageKey.includes("-success")
      ) {
        setFieldValue(
          "actions",
          fetchedActionData?.data?.fetch.data[0].executorTypeKey
        );
        getAction({
          variables: {
            modelName: "action",
            fields: [...actionFields],
            filters: [
              {
                name: "executorTypeKey",
                operator: "eq",
                value: fetchedActionData?.data?.fetch.data[0].executorTypeKey,
              },
              {
                name: "recordModuleName",
                operator: "eq",
                value: values["moduleName"],
              },
            ],
          },
        }).then((response) => {
          if (response?.data?.fetch?.messageKey.includes("-success")) {
            setActions(response?.data.fetch.data);
          }
        });
      }
    });
  }, [editMode]);

  React.useEffect(() => {
    if (values["actions"]) {
      const findIndex = actionTypes.findIndex(
        (actionType) => actionType.value === values["actions"]
      );
      if (findIndex === -1) return;
      setCurrentSelectedAction(actionTypes[findIndex]);
    }
  }, [values["actions"]]);

  React.useEffect(() => {
    if (currentSelectedAction) {
      if (currentSelectedAction.onClick) {
        (currentSelectedAction as any)?.onClick(currentSelectedAction);
        return;
      }
      getAction({
        variables: {
          modelName: "action",
          fields: [...actionFields],
          filters: [
            {
              name: "executorTypeKey",
              operator: "eq",
              value: currentSelectedAction.value,
            },
            {
              name: "recordModuleName",
              operator: "eq",
              value: values["moduleName"],
            },
          ],
        },
      });
    }
  }, [currentSelectedAction]);

  React.useEffect(() => {
    let updatedNonGroupedActionTypes: {
      label: string;
      value: string;
      groupBy?: string | undefined;
    }[] = [];
    let updatedGroupedActionTypes: {
      [groupLabel: string]: {
        label: string;
        value: string | null;
        visible?: boolean | undefined;
        extraInfoField?: boolean | undefined;
      }[];
    } = {};

    if (actionTypes?.length > 0) {
      actionTypes?.forEach((actionType) => {
        if (actionType?.groupBy) {
          updatedGroupedActionTypes[actionType.groupBy] = [
            ..._.get(updatedGroupedActionTypes, actionType.groupBy, []),
            { label: actionType.label, value: actionType.value },
          ];
        } else {
          updatedNonGroupedActionTypes.push(actionType);
        }
      });
    }
    setGroupedActionTypes({ ...updatedGroupedActionTypes });
    setNonGroupedActionTypes([...updatedNonGroupedActionTypes]);
  }, [actionTypes]);

  return (
    <>
      <div className="w-full flex items-center justify-center my-2">
        <div className="border-l border-vryno-theme-light-blue h-12"></div>
      </div>
      <div className={`mx-6 mt-4 flex gap-x-10`}>
        <div className="bg-white rounded-lg w-full ml-32 p-6">
          <div
            className={`grid ${
              values["actionType"] === "scheduled" ? "grid-cols-2" : ""
            } w-full gap-x-4 `}
          >
            <div className="hidden">
              <FormRadioButton
                name="actionType"
                label="Send Options"
                required={true}
                labelLocation={SupportedLabelLocations.OnLeftSide}
                options={[{ value: "instant", label: "Instant Action" }]}
                onChange={(e) => {
                  handleChange(e);
                  setFieldValue("scheduledDatetime", "");
                  setFieldValue("actionId", null);
                }}
                showOptionsInRow={
                  values["actionType"] === "scheduled" ? false : true
                }
              />
              {values["actionType"] === "scheduled" && (
                <FormDateTimePicker
                  name="scheduledDatetime"
                  required={true}
                  label={"Select Date & Time"}
                  type="datetime"
                  modelName={"action"}
                  user={user ?? undefined}
                />
              )}
            </div>
            <div className="col-span-full grid grid-cols-5 gap-x-6">
              <div className="col-span-2">
                <FormDropdown
                  required={true}
                  name="actions"
                  label={"Action Type"}
                  options={nonGroupedActionTypes}
                  optionGroups={groupedActionTypes}
                  onChange={(selectedOption) => {
                    setFieldValue("actionId", null);
                    setFieldValue(
                      "actions",
                      selectedOption.currentTarget.value
                    );
                  }}
                />
              </div>
              {currentSelectedAction && !currentSelectedAction?.onClick && (
                <div className="w-full col-span-3">
                  {actions?.length > 0 ? (
                    activitiesName
                      ?.map((action) => action.value)
                      .includes(values["actions"]) ? (
                      <FormMultipleValuesDropdown
                        required={true}
                        name="actionId"
                        label={"Select Action"}
                        options={actions?.map((action) => {
                          return { label: action.name, value: action.id };
                        })}
                        editMode={editMode}
                      />
                    ) : (
                      <FormDropdown
                        required={true}
                        name="actionId"
                        label={"Select Action"}
                        options={actions?.map((action) => {
                          return { label: action.name, value: action.id };
                        })}
                        onChange={(selectedOption) => {
                          setFieldValue(
                            "actionId",
                            selectedOption.currentTarget.value
                          );
                        }}
                      />
                    )
                  ) : (
                    <div className="w-full h-full col-span-full text-xsm flex items-center justify-center p-2 bg-gray-100 rounded-lg">
                      <span>
                        {`You have no action for ${
                          modules?.filter(
                            (module) => module.value === values["moduleName"]
                          )[0]?.label
                        }.`}
                        <Button
                          id="add-action"
                          customStyle="px-2 text-vryno-theme-light-blue"
                          onClick={() => router.push(`${appName}/actions`)}
                          userEventName="open-add-action-from-workflow-click"
                        >
                          <p className="text-sl">Add Action</p>
                        </Button>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
