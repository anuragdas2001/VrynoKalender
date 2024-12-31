import React, { useContext } from "react";
import { ReminderDataType } from "./ReminderModal";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import {
  getCustomFieldData,
  getDataObject,
} from "../../modules/crm/shared/utils/getDataObject";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";
import { getSortedFieldList } from "../../modules/crm/shared/utils/getOrderedFieldsList";
import {
  getVisibleFieldsArray,
  getVisibleFieldsList,
} from "../../modules/crm/shared/utils/getFieldsArray";
import { Toast } from "../../../components/TailwindControls/Toast";
import { Loading } from "../../../components/TailwindControls/Loading/Loading";
import { ICustomField } from "../../../models/ICustomField";
import { DetailFieldPerDataType } from "../../modules/crm/shared/components/ReadOnly/DetailFieldPerDataType";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import Link from "next/link";
import { appsUrlGenerator } from "../../modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../models/allowedViews";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import CheckIcon from "remixicon-react/CheckLineIcon";
import GotoIcon from "remixicon-react/NavigationFillIcon";
import { Formik } from "formik";
import getInitialValuesFromList from "../../modules/crm/shared/utils/getInitialValuesFromList";
import FormFieldList from "../../modules/crm/shared/components/Form/FormFieldList";
import { getCountryCodeFromPreference } from "../../modules/crm/shared/components/Form/FormFields/FormFieldPhoneNumber";
import { observer } from "mobx-react-lite";
import { IGenericModel } from "../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IUserPreference } from "../../../models/shared";

export type ReminderItemPopupProps = {
  reminderData: ReminderDataType;
  modelLabel: string;
  additinalButton?: React.ReactElement;
  showEditButton?: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  userPreferences: IUserPreference[];
  handleCancel: () => void;
  handleMarkReminderRead: (reminder: ReminderDataType) => void;
};

export const ReminderItemPopup = observer(
  ({
    reminderData,
    modelLabel,
    additinalButton,
    showEditButton = false,
    genericModels,
    allLayoutFetched,
    allModulesFetched,
    userPreferences,
    handleCancel = () => {},
    handleMarkReminderRead = () => {},
  }: ReminderItemPopupProps) => {
    const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
      React.useState<string>(
        userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
      );
    const [currentFormLayer, setCurrentFormLayer] =
      React.useState<boolean>(true);
    React.useEffect(() => {
      setCountryCodeInUserPreference(
        getCountryCodeFromPreference(userPreferences)
      );
    }, [userPreferences]);
    const [dataFetchLoading, setDataFetchLoading] =
      React.useState<boolean>(true);
    const [reminderItemFetchedData, setReminderItemFetchedData] =
      React.useState<any>();
    const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
    const [editNotificaitionFormModal, setEditNotificationFormModal] =
      React.useState<boolean>(false);

    const [getDataById] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: reminderData?.serviceName,
        },
      },
    });

    const uniqueNotification =
      reminderData?.metaData?.subject === "bulk-update-notification"
        ? "bulk-update-notification"
        : reminderData?.metaData?.subject === "bulk-restore-notification"
        ? "bulk-restore-notification"
        : false;

    React.useEffect(() => {
      if (uniqueNotification) {
        setDataFetchLoading(false);
        return;
      }
      if (
        allLayoutFetched &&
        allModulesFetched &&
        genericModels[
          reminderData?.metaData?.moduleName || reminderData?.serviceModuleName
        ]?.fieldsList?.length > 0
      ) {
        const fieldsListForReminderModule =
          genericModels[
            reminderData?.metaData?.moduleName ||
              reminderData?.serviceModuleName
          ]?.fieldsList;
        const filteredVisibleFields = getVisibleFieldsList(
          fieldsListForReminderModule
        );
        const sortedFieldList = getSortedFieldList(filteredVisibleFields);
        setFieldsList(sortedFieldList);
        getDataById({
          variables: {
            modelName: reminderData?.serviceModuleName,
            fields: getVisibleFieldsArray(sortedFieldList),
            filters: [
              {
                name: "id",
                operator: "eq",
                value: reminderData?.recordId?.toString() || "",
              },
            ],
          },
        }).then((response) => {
          if (response?.data?.fetch.data) {
            setReminderItemFetchedData(
              getDataObject(response.data.fetch.data[0])
            );
          } else {
            handleCancel();
            Toast.error("Failed to show notification");
          }
          setDataFetchLoading(false);
        });
      } else if (
        allLayoutFetched &&
        allModulesFetched &&
        genericModels[
          reminderData?.metaData?.moduleName || reminderData?.serviceModuleName
        ]?.fieldsList?.length <= 0
      ) {
        setDataFetchLoading(false);
        handleCancel();
        Toast.error("Failed to show notification");
      }
    }, [reminderData, allLayoutFetched, allModulesFetched]);

    return (
      <>
        {dataFetchLoading ? (
          <div className={"w-full flex items-center justify-center p-4"}>
            <Loading color="Blue" />
          </div>
        ) : uniqueNotification ? (
          <div className="text-sm">
            <p>
              {reminderData?.metaData?.message
                ? `${reminderData?.metaData?.message}. Please reload to fetch updated records`
                : "Mass update notification"}
            </p>
            <div className={`flex items-center justify-center gap-x-2 mt-4`}>
              <Button
                id={"mark-read-notification-popup"}
                onClick={() => handleMarkReminderRead(reminderData)}
                loading={false}
                buttonType="thin"
                disabled={false}
                kind={"primary"}
                userEventName={`mark-read-notification-popup-${reminderData?.serviceModuleName}-click`}
              >
                <span
                  className={`w-full text-sm flex items-center justify-center gap-x-1`}
                >
                  <CheckIcon size={16} /> Read
                </span>
              </Button>
              <Button
                id={"cancel-edit-notification-popup"}
                onClick={() => handleCancel()}
                loading={false}
                buttonType="thin"
                disabled={false}
                kind={"next"}
                userEventName={`cancel-edit-notification-popup-${reminderData?.serviceModuleName}-click`}
              >
                {`Cancel`}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 px-4 w-full max-h-[50vh] card-scroll overflow-y-auto">
              {!editNotificaitionFormModal ? (
                fieldsList
                  ?.filter(
                    (field) => field.mandatory || field.showInQuickCreate
                  )
                  ?.map((field, index) => (
                    <DetailFieldPerDataType
                      data={reminderItemFetchedData}
                      field={{
                        label: field.label.en,
                        value: field.name,
                        dataType: field.dataType,
                        field: field,
                      }}
                      headerVisible={true}
                      fontSize={{
                        header: "text-sm",
                        value: "text-sm",
                      }}
                      key={index}
                      isSample={reminderItemFetchedData?.isSample}
                      modelName={reminderData?.serviceModuleName}
                      includeBaseUrl={true}
                      handleRowClick={handleCancel}
                    />
                  ))
              ) : (
                <form className="w-full col-span-2">
                  <Formik
                    initialValues={{
                      ...getInitialValuesFromList(
                        fieldsList?.filter(
                          (field) => field.mandatory || field.showInQuickCreate
                        )
                      ),
                      ...reminderItemFetchedData,
                    }}
                    enableReinitialize
                    onSubmit={(values) => {
                      console.log(values);
                    }}
                  >
                    {({}) => (
                      <FormFieldList
                        fieldList={fieldsList?.filter(
                          (field) => field.mandatory || field.showInQuickCreate
                        )}
                        editMode={true}
                        appName={reminderData?.serviceName}
                        customFieldsData={getCustomFieldData(
                          reminderItemFetchedData
                        )}
                        quickCreate={true}
                        type="Modal"
                        moduleName={reminderData?.serviceModuleName || ""}
                        allowToggle={false}
                        cardMarginTop={"mt-4"}
                        applyBorder={true}
                        currentFormLayer={currentFormLayer}
                        setCurrentFormLayer={(value) =>
                          setCurrentFormLayer(value)
                        }
                        editData={reminderItemFetchedData}
                        countryCodeInUserPreference={
                          countryCodeInUserPreference
                        }
                        genericModels={genericModels}
                        allLayoutFetched={allLayoutFetched}
                        allModulesFetched={allModulesFetched}
                        userPreferences={userPreferences}
                      />
                    )}
                  </Formik>
                </form>
              )}
            </div>
            <div
              className={`grid grid-cols-${
                showEditButton ? "3" : "2"
              }  gap-x-4 px-4 mt-2 ${
                editNotificaitionFormModal ? "hidden" : ""
              }`}
            >
              {showEditButton && (
                <Button
                  id={"edit-notification-popup"}
                  onClick={() => setEditNotificationFormModal(true)}
                  loading={false}
                  buttonType="thin"
                  disabled={false}
                  kind={"secondary"}
                  userEventName={`edit-notification-popup-click`}
                >
                  <span
                    className={`w-full text-sm flex items-center justify-center gap-x-1`}
                  >
                    <EditBoxIcon size={16} /> Edit
                  </span>
                </Button>
              )}
              <Button
                id={"mark-read-notification-popup"}
                onClick={() => handleMarkReminderRead(reminderData)}
                loading={false}
                buttonType="thin"
                disabled={false}
                kind={"next"}
                userEventName={`mark-read-notification-popup-${reminderData?.serviceModuleName}-click`}
              >
                <span
                  className={`w-full text-sm flex items-center justify-center gap-x-1`}
                >
                  <CheckIcon size={16} /> Read
                </span>
              </Button>
              <Link
                href={`${appsUrlGenerator(
                  reminderData.serviceName,
                  reminderData.serviceModuleName,
                  AllowedViews.detail,
                  reminderData.recordId as string
                )}`}
                passHref
                legacyBehavior
                data-testid={`navigate-inside-notification-popup-${reminderData?.serviceModuleName}`}
              >
                <a
                  id={"navigate-inside-notification-popup"}
                  onClick={(e) => {
                    handleMarkReminderRead(reminderData);
                  }}
                  className={`w-full text-sm flex items-center justify-center py-2 px-6 gap-x-2 rounded-md bg-vryno-theme-blue text-white`}
                >
                  <GotoIcon size={16} /> {`${modelLabel}`}
                </a>
              </Link>
            </div>
            <div
              className={`grid grid-cols-2 gap-x-4 px-4 mt-2 ${
                !editNotificaitionFormModal ? "hidden" : ""
              }`}
            >
              <Button
                id={"cancel-edit-notification-popup"}
                onClick={() => setEditNotificationFormModal(false)}
                loading={false}
                buttonType="thin"
                disabled={false}
                kind={"next"}
                userEventName={`cancel-edit-notification-popup-${reminderData?.serviceModuleName}-click`}
              >
                {`Cancel`}
              </Button>
              <Button
                id={"save-read-notification-popup"}
                onClick={() => {}}
                loading={false}
                buttonType="thin"
                disabled={false}
                kind={"primary"}
                userEventName={`save-read-notification-popup-${reminderData?.serviceModuleName}-click`}
              >
                {`Save`}
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
);
