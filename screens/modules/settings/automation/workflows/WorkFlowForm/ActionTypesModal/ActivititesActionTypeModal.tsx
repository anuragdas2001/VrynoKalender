import React from "react";
import _ from "lodash";
import GenericFormModalContainer from "../../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { Backdrop } from "../../../../../../../components/TailwindControls/Backdrop";
import { ICustomField } from "../../../../../../../models/ICustomField";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../../models/shared";
import { GenericModalForm } from "../../../../../../../components/TailwindControls/Modals/FormModal/ActivityFormModals/GenericModalForm";
import { cookieUserStore } from "../../../../../../../shared/CookieUserStore";
import { ActionType } from "../../../actions/ConnectedActionsScreen";
import { useFormikContext } from "formik";
import moment from "moment";
import { User } from "../../../../../../../models/Accounts";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

const getActivityData = (activityData?: {
  [fieldName: string]: {
    input?: any;
    type: string;
    format?: any;
  };
}) => {
  let updatedActivityData: Record<string, any> = {};
  if (activityData) {
    Object.keys(activityData).forEach((key) => {
      if (activityData[key].format) {
        if (_.get(activityData[key].format, "at", null)) {
          updatedActivityData[key] = {
            ...activityData[key]?.format,
            executorField: activityData[key].input,
            at: moment(new Date())
              .toISOString()
              .split("T")[0]
              .concat(
                `T${
                  _.get(activityData[key].format, "at", null)?.split("T")
                    ?.length > 1
                    ? _.get(activityData[key].format, "at", null)?.split("T")[1]
                    : _.get(activityData[key].format, "at", null)
                }`
              ),
          };
        } else {
          updatedActivityData[key] = {
            ...activityData[key]?.format,
            executorField: activityData[key].input,
          };
        }
      } else {
        updatedActivityData[key] = activityData[key].input;
      }
    });
  }
  return updatedActivityData;
};

type ActivityActionTypeModalProps = {
  editMode: boolean;
  data?: ActionType;
  modulesFetched: IModuleMetadata[];
  parentFieldsList?: ICustomField[];
  activityData?: {
    [fieldName: string]: {
      input: any;
      type: string;
      format?: any;
    };
  };
  activityFieldsList?: {
    loading: boolean;
    error: boolean;
    data: ICustomField[];
  };
  fieldsForActivityModel?: ICustomField[];
  user: User | null;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  setActivityData?: (value: {
    [fieldName: string]: {
      input: any;
      type: string;
      format?: any;
    };
  }) => void;
  setShowActivityModalForm?: (value: boolean) => void;
};

export const ActivityActionTypeModal = ({
  editMode,
  data,
  modulesFetched,
  parentFieldsList,
  activityFieldsList,
  activityData,
  fieldsForActivityModel = [],
  user,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setActivityData = () => {},
  setShowActivityModalForm = () => {},
}: ActivityActionTypeModalProps) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <>
      <GenericFormModalContainer
        topIconType="Close"
        formHeading={`${
          modulesFetched?.find((module) => module.name === data?.moduleName)
            ?.label?.en
        }`}
        onCancel={() => {
          if (!editMode && !activityData) {
            setFieldValue("moduleName", null);
            setFieldTouched("moduleName", false);
          }
          setShowActivityModalForm(false);
        }}
        onOutsideClick={() => {}}
        extendedWidth={true}
        allowScrollbar={false}
      >
        <div className="overflow-hidden max-h-[75vh]">
          <GenericModalForm
            data={{
              ownerId: cookieUserStore?.getUserId(),
              ...getActivityData(activityData),
            }}
            currentModule={modulesFetched?.find(
              (module) => module.name === data?.moduleName
            )}
            saveLoading={false}
            fieldList={fieldsForActivityModel?.filter(
              (field) => field.mandatory && field.addInForm
            )}
            user={user}
            userPreferences={userPreferences}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            handleSave={(recordData) => {
              const updatedRecordDraft: Record<string, any> = {};
              Object.keys(recordData).forEach((key) => {
                const findIndex = activityFieldsList?.data.findIndex(
                  (field) => field.name === key
                );
                if (findIndex && findIndex !== -1) {
                  if (
                    activityFieldsList?.data &&
                    activityFieldsList.data?.length > 0
                  ) {
                    updatedRecordDraft[key] = {
                      type:
                        ["datetime", "date"].includes(
                          activityFieldsList.data[findIndex].dataType
                        ) && activityFieldsList.data[findIndex].systemDefined
                          ? "offset"
                          : "litral",
                    };

                    if (
                      ["datetime", "date"].includes(
                        activityFieldsList.data[findIndex].dataType
                      ) &&
                      activityFieldsList.data[findIndex].systemDefined
                    ) {
                      updatedRecordDraft[key]["format"] = {
                        at:
                          _.get(recordData[key], "at", null)?.split("T")
                            ?.length > 1
                            ? _.get(recordData[key], "at", null)?.split("T")[1]
                            : _.get(recordData[key], "at", null),
                        adjust: _.get(recordData[key], "adjust", {}),
                      };
                      updatedRecordDraft[key]["input"] = _.get(
                        recordData[key],
                        "executorField",
                        ""
                      );
                    } else {
                      updatedRecordDraft[key]["input"] = recordData[key];
                    }
                  }
                }
              });
              setFieldValue("recordDraft", { ...updatedRecordDraft });
              setActivityData({ ...updatedRecordDraft });
              setShowActivityModalForm(false);
            }}
            formDetails={{
              type: "Add",
              id: null,
              modelName: data?.moduleName as string,
              appName: SupportedApps.crm,
              quickCreate: true,
            }}
            editData={{}}
            onCancel={() => {
              if (!editMode && !activityData) {
                setFieldValue("moduleName", null);
                setFieldTouched("moduleName", false);
              }
              setShowActivityModalForm(false);
            }}
          />
        </div>
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
