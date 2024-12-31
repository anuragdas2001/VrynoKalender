import { FormikValues } from "formik";
import React from "react";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import {
  IUserPreference,
  IWorkflowAction,
} from "../../../../../../models/shared";
import { ActionForm } from "./ActionForm";
import { getSortedModuleByNavigation } from "../../../../crm/shared/utils/getSortedModuleListAccordingToNavigation";
import { ActionType } from "../../shared/actionTypes";
import { INavigation } from "../../../../../../models/INavigation";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { User } from "../../../../../../models/Accounts";

export type ConnectedActionFormModalProps = {
  editMode: boolean;
  appName: string;
  action: IWorkflowAction | null;
  actionTypes: ActionType[];
  webhookUrlMethods: { label: string; value: string; visible: boolean }[];
  saveLoading: boolean;
  activitiesName?: ActionType[];
  navigations: INavigation[];
  user: User | null;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  onCancel: (values: {
    visible: boolean;
    item: IWorkflowAction | null;
    editMode: boolean;
  }) => void;
  handleSave: (T: FormikValues) => void;
};

export const ConnectedActionFormModal = ({
  editMode,
  appName,
  action,
  actionTypes,
  webhookUrlMethods,
  saveLoading,
  activitiesName,
  navigations,
  user,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
  onCancel,
  handleSave,
}: ConnectedActionFormModalProps) => {
  const [modulesFetched, setModulesFetched] = React.useState<{
    loading: boolean;
    data: IModuleMetadata[];
  }>({ loading: true, data: [] });
  const [externalUserEmails, setExternalUserEmails] = React.useState<string[]>(
    []
  );
  const [externalUserEmailsError, setExternalUserEmailsError] =
    React.useState<string>("");

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
      setModulesFetched({ loading: false, data: [...responseData] });
    }
  }, [allModulesFetched]);

  React.useEffect(() => {
    if (!editMode) return;
    setExternalUserEmails(action?.executorConfig?.additionalEmails || []);
  }, [editMode]);

  return (
    <>
      <GenericFormModalContainer
        formHeading={editMode ? "Edit Action" : "Create Action"}
        onCancel={() =>
          onCancel({ visible: false, item: null, editMode: false })
        }
      >
        {modulesFetched.loading || !allModulesFetched || !allLayoutFetched ? (
          <div className="w-full flex items-center justify-center my-10">
            <Loading color="Blue" />
          </div>
        ) : (
          <ActionForm
            action={action}
            actionTypes={actionTypes}
            webhookUrlMethods={webhookUrlMethods}
            modules={getSortedModuleByNavigation(
              navigations,
              modulesFetched.data
            )}
            editMode={editMode}
            appName={appName}
            saveLoading={saveLoading}
            activitiesName={activitiesName}
            user={user}
            genericModels={genericModels}
            allModulesFetched={allModulesFetched}
            allLayoutFetched={allLayoutFetched}
            userPreferences={userPreferences}
            externalUserEmails={externalUserEmails}
            setExternalUserEmails={setExternalUserEmails}
            externalUserEmailsError={externalUserEmailsError}
            setExternalUserEmailsError={setExternalUserEmailsError}
            onCancel={() =>
              onCancel({ visible: false, item: null, editMode: false })
            }
            handleSave={(values) =>
              handleSave({
                ...values,
                externalUserEmails: externalUserEmails,
              })
            }
          />
        )}
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
