import React from "react";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useFormikContext } from "formik";
import { EmailNotificationForm } from "./EmailNotificationForm";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import { WebhookForm } from "./WebhookForm";
import _ from "lodash";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { InstantActionForm } from "./InstantActionForm";
import { AssignOwnerForm } from "./AssignOwnerForm";
import { ActionType } from "../../shared/actionTypes";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";
import { IUserPreference } from "../../../../../../models/shared";

export type ActionFormFieldsProps = {
  editMode: boolean;
  actionTypes: ActionType[];
  webhookUrlMethods: { label: string; value: string; visible: boolean }[];
  appName: string;
  saveLoading: boolean;
  modules: IModuleMetadata[];
  externalUserEmails: string[];
  activitiesName?: ActionType[];
  recordDraftData?: any;
  user: User | null;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  setExternalUserEmails: (
    value: ((prevState: string[]) => string[]) | string[]
  ) => void;
  externalUserEmailsError: string;
  setExternalUserEmailsError: (
    value: ((prevState: string) => string) | string
  ) => void;
  onCancel: () => void;
  handleSave: () => void;
};

export type EmailNotificationFormProps = {
  editMode: boolean;
  appName: string;
  modules: IModuleMetadata[];
  handleExternalEmailsAdd: (values: string[]) => void;
  externalUserEmailsError: string;
  externalUserEmails: string[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
};

export const ActionFormFields = ({
  editMode,
  actionTypes,
  webhookUrlMethods,
  appName,
  modules,
  saveLoading,
  externalUserEmails,
  setExternalUserEmails,
  externalUserEmailsError,
  activitiesName = [],
  recordDraftData,
  user,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
  onCancel,
  handleSave,
}: ActionFormFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const { t } = useTranslation();

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

  const ActionsComponentMap: {
    email: React.JSX.Element;
    webhook: React.JSX.Element;
    "assign-owner": React.JSX.Element;
  } = {
    email: (
      <EmailNotificationForm
        editMode={editMode}
        appName={appName}
        modules={modules?.filter(
          (module) => ["crm.note"].indexOf(module.uniqueName) === -1
        )}
        handleExternalEmailsAdd={(values) => setExternalUserEmails(values)}
        externalUserEmails={externalUserEmails}
        externalUserEmailsError={externalUserEmailsError}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
      />
    ),
    webhook: (
      <WebhookForm
        editMode={editMode}
        appName={appName}
        modules={modules?.map((module) => {
          return { value: module.name, label: module.label?.en };
        })}
        webhookUrlMethods={webhookUrlMethods}
      />
    ),
    "assign-owner": (
      <AssignOwnerForm
        editMode={editMode}
        appName={appName}
        recordDraftData={recordDraftData}
        modules={modules
          ?.filter((module) => ["crm.note"].indexOf(module.uniqueName) === -1)
          ?.map((module) => {
            return { value: module.name, label: module.label?.en };
          })}
      />
    ),
  };

  return (
    <div className="w-full">
      <div className="w-full sm:grid sm:grid-cols-2 sm:gap-x-4 max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-4">
        <FormInputBox required={true} name={`name`} label={`Action Name`} />
        <FormDropdown
          required={true}
          name="actions"
          label={"Action Type"}
          options={nonGroupedActionTypes}
          optionGroups={groupedActionTypes}
          onChange={(selectedOption) => {
            setFieldValue("actions", selectedOption.currentTarget.value);
          }}
          disabled={editMode}
        />
        {Object.keys(ActionsComponentMap).includes(values["actions"]) &&
          ActionsComponentMap[
            values["actions"] as keyof typeof ActionsComponentMap
          ]}
        {activitiesName
          ?.map((action) => action.value)
          .includes(values["actions"]) && (
          <InstantActionForm
            editMode={editMode}
            modules={modules?.filter(
              (module) => ["crm.note"].indexOf(module.uniqueName) === -1
            )}
            recordDraftData={recordDraftData}
            data={actionTypes.find(
              (actionType) => actionType.value === values["actions"]
            )}
            user={user}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            userPreferences={userPreferences}
          />
        )}
      </div>
      <div className="col-span-2 grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          onClick={() => onCancel()}
          kind="back"
          disabled={saveLoading}
          userEventName="action-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          onClick={() => handleSave()}
          kind="primary"
          loading={saveLoading}
          disabled={
            saveLoading ||
            !values["moduleName"] ||
            (values["actions"] === "email" && !values["templateId"]) ||
            (values["actions"] === "email" &&
              values["templateId"] &&
              (values["fields"] ? values["fields"]?.length <= 0 : true) &&
              values["emailRecievingUsers"]?.length <= 0 &&
              externalUserEmails?.length <= 0) ||
            (values["actions"] === "webhook" &&
              (!values["webhookUrlMethod"] || !values["webhookUrl"]))
          }
          userEventName="action-save:submit-click"
        >
          {t("common:Save")}
        </Button>
      </div>
    </div>
  );
};
