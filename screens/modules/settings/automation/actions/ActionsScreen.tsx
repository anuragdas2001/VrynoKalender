import React, { useEffect, useRef } from "react";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { IUserPreference, IWorkflowAction } from "../../../../../models/shared";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { SettingsSideBar } from "../../SettingsSidebar";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import NoDataFoundContainer from "../../../crm/shared/components/NoDataFoundContainer";
import { ActionsList } from "./ActionsList";
import { ConnectedActionFormModal } from "./actionForm/ConnectedActionFormModal";
import { FormikValues } from "formik";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";
import { useTranslation } from "next-i18next";
import { NoDataControl } from "../../../crm/shared/components/ReadOnly/NoDataControl";
import { camelCase } from "change-case";
import { NoViewPermission } from "../../../crm/shared/components/NoViewPermission";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { PaginationFilterComponent } from "../../../../Shared/PaginationFilterCombined";
import _ from "lodash";
import { ActionType } from "../shared/actionTypes";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { INavigation } from "../../../../../models/INavigation";
import { User } from "../../../../../models/Accounts";

const actionTableHeader = (
  editAction: (item: IWorkflowAction) => void,
  deleteAction: (item: IWorkflowAction) => void,
  handleActionTypes: (item: IWorkflowAction) => React.JSX.Element
) => [
  {
    label: "Action Name",
    columnName: "name",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Module Name",
    columnName: "recordModuleName",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Action Type",
    columnName: "executorTypeKey",
    dataType: SupportedDataTypes.singleline,
    render: (item: IWorkflowAction) => {
      return handleActionTypes(item);
    },
  },
  {
    label: "Actions",
    columnName: "actions",
    dataType: SupportedDataTypes.singleline,
    render: (item: IWorkflowAction, index: number) => {
      return (
        <ActionWrapper
          index={index}
          content={
            <div className="flex flex-row gap-x-2 items-center">
              <Button
                id={`edit-action-${item.name}`}
                onClick={() => editAction(item)}
                customStyle=""
                userEventName="action-edit:action-click"
              >
                <EditBoxIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
              <Button
                id={`delete-action-${item.name}`}
                onClick={() => deleteAction(item)}
                customStyle=""
                userEventName="action-delete:action-click"
              >
                <DeleteBinIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
            </div>
          }
        />
      );
    },
  },
];

export type ActionsScreenProps = {
  actions: IWorkflowAction[];
  actionTypes: ActionType[];
  webhookUrlMethods: { value: string; label: string; visible: boolean }[];
  dataFetchLoading: boolean;
  viewPermission: boolean;
  deleteAction: (item: IWorkflowAction) => void;
  updateAction: (item: IWorkflowAction) => void;
  itemsCount: number;
  currentPageNumber: number;
  filterValue: string;
  activitiesName?: ActionType[];
  navigations: INavigation[];
  user: User | null;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  setFilterValue?: (value: string) => void;
  onPageChange: (pageNumber: number) => void;
};

export const ActionsScreen = ({
  actions,
  actionTypes,
  webhookUrlMethods,
  dataFetchLoading,
  viewPermission,
  deleteAction,
  updateAction,
  itemsCount,
  currentPageNumber,
  filterValue,
  activitiesName,
  navigations,
  user,
  genericModels,
  allModulesFetched,
  allLayoutFetched,
  userPreferences,
  setFilterValue = () => {},
  onPageChange = () => {},
}: ActionsScreenProps) => {
  const { t } = useTranslation();
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const { appName } = getSettingsPathParts();
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const [actionModal, setActionModal] = React.useState<{
    visible: boolean;
    item: IWorkflowAction | null;
    editMode: boolean;
  }>({ visible: false, item: null, editMode: false });

  const [saveAction] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "workflow",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes(`-success`)
      ) {
        Toast.success(
          actionModal.editMode
            ? `Action updated successfully`
            : `Action created successfully`
        );
        setSaveProcessing(false);
        updateAction(responseOnCompletion.save.data);
        setActionModal({ visible: false, item: null, editMode: false });
        return;
      }
      setSaveProcessing(false);
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    },
  });

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [actions]);

  const handleSave = async (values: FormikValues) => {
    setSaveProcessing(true);
    const emailExecutorConfig =
      values.actions === "email"
        ? {
            emailType: "general-email",
            fileKey: values.templateId,
            templateId: values.templateId,
            emailGroups:
              values?.fields &&
              values?.fields?.map((field: string) => {
                return {
                  serviceName: appName,
                  moduleName: camelCase(values.moduleName),
                  fieldName: field,
                };
              }),
            actionType: values.actions,
            userGroups: values.emailRecievingUsers,
            additionalEmails: values.externalUserEmails,
          }
        : {};

    const webhookExecutorConfig =
      values.actions === "webhook"
        ? {
            actionType: values.actions,
            url: values.webhookUrl,
            method: values.webhookUrlMethod,
            headers: values.headers,
          }
        : {};

    const assignOwnerConfig =
      values.actions === "assign-owner"
        ? {
            actionType: values.actions,
            recordDraft: {
              ownerId: {
                type: "owner",
                input: values["assignOwnerUsers"],
              },
            },
          }
        : {};

    const instantActionExectorConfig = actionTypes
      .map((action) => action.value)
      .includes(values["actions"])
      ? {
          actionType: values.actions,
          recordDraft: _.get(values, "recordDraft", null),
        }
      : {};

    const MapExecutorConfig = {
      email: emailExecutorConfig,
      webhook: webhookExecutorConfig,
      "assign-owner": assignOwnerConfig,
    };

    const saveInput = {
      name: values.name,
      recordModuleName: camelCase(values.moduleName),
      recordServiceName: appName,
      executorTypeKey: values.actions,
      executorConfig: activitiesName
        ?.map((action) => action.value)
        .includes(values["actions"])
        ? instantActionExectorConfig
        : MapExecutorConfig[values.actions as keyof typeof MapExecutorConfig],
    };

    try {
      await saveAction({
        variables: {
          id: actionModal.editMode ? actionModal.item?.id : null,
          modelName: "action",
          saveInput: saveInput,
        },
      });
    } catch (error) {}
  };

  const handleActionTypes = (item: IWorkflowAction) => {
    const findActionTypeIndex = actionTypes.findIndex(
      (actionType) => actionType.value === item.executorTypeKey
    );
    if (findActionTypeIndex !== -1)
      return <>{actionTypes[findActionTypeIndex].label}</>;
    else
      return (
        <NoDataControl
          fontSize={{
            header: "text-sm",
            value: "text-xsm",
          }}
        />
      );
  };

  return (
    <>
      <GenericBackHeader heading="Actions">
        <div>
          <Button
            id="add-action"
            buttonType="thin"
            kind="primary"
            onClick={
              dataFetchLoading
                ? () => {}
                : () => {
                    setActionModal({
                      visible: true,
                      item: null,
                      editMode: false,
                    });
                  }
            }
            disabled={dataFetchLoading}
            userEventName="open-add-action-modal-click"
          >
            <div className="flex gap-x-1">
              <AddIcon size={18} />
              <span>Action</span>
            </div>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="flex justify-between mt-4">
        <div className="sm:hidden w-40">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
          >
            <SettingsSideBar />
          </SideDrawer>
        </div>
        {actions.length > 0 && (
          <div className="pr-6 pl-6 w-full flex justify-end">
            <PaginationFilterComponent
              filterName={"actions"}
              currentPageItemCount={actions.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`hidden sm:flex sm:justify-between w-full`}
            />
            <PaginationFilterComponent
              filterName={"actions"}
              currentPageItemCount={actions.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`sm:hidden flex flex-col`}
            />
          </div>
        )}
      </div>
      <div className="px-6 mt-2">
        {dataFetchLoading ? (
          ItemsLoader({ currentView: "List", loadingItemCount: 4 })
        ) : !viewPermission ? (
          <NoViewPermission
            modelName="Actions"
            addPadding={false}
            marginTop={"mt-8"}
          />
        ) : actions.length > 0 ? (
          <div className="bg-white pt-4 pb-1 px-4 rounded-xl">
            <div ref={heightRef}>
              <ActionsList
                data={actions}
                tableHeaders={actionTableHeader(
                  (item: IWorkflowAction) =>
                    setActionModal({
                      visible: true,
                      item: item,
                      editMode: true,
                    }),
                  (item: IWorkflowAction) => deleteAction(item),
                  (item: IWorkflowAction) => handleActionTypes(item)
                )}
                modelName="emailTemplate"
                filterValue={filterValue}
              />
            </div>
          </div>
        ) : (
          <NoDataFoundContainer
            modelName="action"
            onClick={() =>
              setActionModal({ visible: true, item: null, editMode: false })
            }
          />
        )}
      </div>
      {actionModal.visible && (
        <ConnectedActionFormModal
          editMode={actionModal.editMode}
          action={actionModal.item}
          onCancel={(values) => setActionModal(values)}
          handleSave={(values) => handleSave(values)}
          saveLoading={saveProcessing}
          appName={appName}
          actionTypes={actionTypes}
          activitiesName={activitiesName}
          webhookUrlMethods={webhookUrlMethods}
          navigations={navigations}
          user={user}
          genericModels={genericModels}
          allModulesFetched={allModulesFetched}
          allLayoutFetched={allLayoutFetched}
          userPreferences={userPreferences}
        />
      )}
    </>
  );
};
