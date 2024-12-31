import React from "react";
import { Formik, FormikValues } from "formik";
import * as Yup from "yup";
import {
  IUserPreference,
  IWorkflowAction,
} from "../../../../../../models/shared";
import { get } from "lodash";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ActionFormFields } from "./ActionFormFields";
import { camelCase } from "change-case";
import { ActionType } from "../../shared/actionTypes";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

export type ActionFormProps = {
  action: IWorkflowAction | null;
  actionTypes: ActionType[];
  webhookUrlMethods: { label: string; value: string; visible: boolean }[];
  modules: IModuleMetadata[];
  editMode: boolean;
  appName: string;
  saveLoading: boolean;
  externalUserEmails: string[];
  activitiesName?: ActionType[];
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
  handleSave: (T: FormikValues) => void;
};

let initialValues = {
  name: "",
  moduleName: "",
  actions: "",
};

export const ActionForm = ({
  action,
  actionTypes,
  webhookUrlMethods,
  modules,
  editMode,
  appName,
  saveLoading,
  externalUserEmails,
  activitiesName,
  user,
  genericModels,
  allLayoutFetched,
  userPreferences,
  allModulesFetched,
  setExternalUserEmails,
  externalUserEmailsError,
  setExternalUserEmailsError,
  onCancel,
  handleSave,
}: ActionFormProps) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Please enter action name"),
    moduleName: Yup.string().required("Please select a module"),
    actions: Yup.string().required("Please select a action type"),
  });

  const editModeData = editMode
    ? {
        name: action?.name,
        actions: action?.executorTypeKey,
        moduleName: camelCase(get(action, "recordModuleName", "")),
        templateId: action?.executorConfig.fileKey,
        fields: Array.isArray(action?.executorConfig?.emailGroups)
          ? action?.executorConfig?.emailGroups?.map((group) => group.fieldName)
          : [],
        emailRecievingUsers: action?.executorConfig?.userGroups,
        webhookUrlMethod: action?.executorConfig?.method,
        webhookUrl: action?.executorConfig?.url,
        headers: action?.executorConfig?.headers,
        actionType: action?.executorConfig?.actionType,
        recordDraft: action?.executorConfig?.recordDraft,
      }
    : {};

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          ...initialValues,
          ...editModeData,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <ActionFormFields
            editMode={editMode}
            appName={appName}
            actionTypes={actionTypes}
            webhookUrlMethods={webhookUrlMethods}
            modules={modules}
            setExternalUserEmails={setExternalUserEmails}
            externalUserEmails={externalUserEmails}
            externalUserEmailsError={externalUserEmailsError}
            recordDraftData={action?.executorConfig?.recordDraft}
            setExternalUserEmailsError={setExternalUserEmailsError}
            onCancel={onCancel}
            handleSave={handleSubmit}
            saveLoading={saveLoading}
            activitiesName={activitiesName}
            user={user}
            genericModels={genericModels}
            allModulesFetched={allModulesFetched}
            allLayoutFetched={allLayoutFetched}
            userPreferences={userPreferences}
          />
        )}
      </Formik>
    </form>
  );
};
