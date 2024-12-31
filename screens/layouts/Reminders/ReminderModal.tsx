import _ from "lodash";
import React, { useContext } from "react";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { REMINDER_QUERY } from "../../../graphql/queries/reminderQuery";
import { ReminderItem } from "./ReminderItem";
import { UserStoreContext } from "../../../stores/UserStore";
import { getDate } from "../../../components/TailwindControls/DayCalculator";
import { Formik } from "formik";
import FormCheckBox from "../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { REMINDER_MUTATION } from "../../../graphql/subscriptions/remindersMutation";
import useSound from "use-sound";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import { getNavigationLabel } from "../../modules/crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { ReminderItemPopup } from "./ReminderItemPopup";
import { getReminderDataWithDates } from "./getReminderDataWithDates";
import { getAllUniqueDates } from "./getAllUniqueDates";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";
import { useMassDeleteSessionId } from "../GenericContainer";
import { notificationDeleteSessionIdFilter } from "../../modules/crm/shared/utils/notificationDeleteSessionIdFilter";
import GenericFormModalContainer from "../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { useMassRecycleBinSessionId } from "../../../pages/recycle-bin/[[...slug]]";
import { IN_APP_NOTIFICATION_SUBSCRIPTION } from "../../../graphql/subscriptions/remindersSubscription";
import { ReminderHeader } from "./ReminderHeader";
import { IGenericModel } from "../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IUserPreference } from "../../../models/shared";

export type ReminderModalProps = {
  navbarColor: string;
  navbarTextColor: "white" | "black";
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  allModulesFetched: boolean;
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
};

export interface ReminderDataType {
  id: string;
  recordStatus: string;
  isSample: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  metaData: {
    message: string;
    subject: string | null;
    moduleName: string | null;
    errorRecordIds: string[] | null;
  };
  userId: string;
  isRead: boolean;
  serviceModuleName: string;
  serviceName: string;
  recordId: string;
}

export const ReminderModal = ({
  navbarColor,
  navbarTextColor,
  genericModels,
  allLayoutFetched,
  userPreferences,
  allModulesFetched,
  removeModuleDataById,
}: ReminderModalProps) => {
  const { massDeleteSessionId, setMassDeleteSessionId } =
    useMassDeleteSessionId();
  const { massRecycleBinSessionId, setMassRecycleBinSessionId } =
    useMassRecycleBinSessionId();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { navigations } = useContext(NavigationStoreContext);
  const [showReminders, setShowReminders] = React.useState<boolean | undefined>(
    undefined
  );
  const [remindersData, setRemindersData] = React.useState<{
    loading: boolean;
    failed: boolean;
    data: ReminderDataType[];
  }>({ loading: true, failed: false, data: [] });
  const [selectedRecords, setSelectedRecords] = React.useState<
    ReminderDataType[]
  >([]);
  const [reminderLoading, setReminderLoading] = React.useState<{
    reminder: ReminderDataType | null;
    loading: boolean;
  }>({ reminder: null, loading: false });
  const [notificationSoundPlay] = useSound(
    "/notification/notification_sound.mp3"
  );
  const [newNotificationReceived, setNewNotificationReceived] = React.useState<{
    visible: boolean;
    data: ReminderDataType | null;
  }>({ visible: false, data: null });

  const [updateReminder] = useMutation(REMINDER_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
  });

  const [getReminders] = useLazyQuery(REMINDER_QUERY, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-only",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    onError: (error) => {
      setRemindersData({ loading: false, failed: true, data: [] });
      return;
    },
  });

  useSubscription(IN_APP_NOTIFICATION_SUBSCRIPTION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    variables: {
      userId: user?.id,
    },
    onSubscriptionData: (subscriptionDataResponse) => {
      setSelectedRecords([]);
      const { error, loading, data } =
        subscriptionDataResponse?.subscriptionData;
      if (
        data &&
        data?.subscribeToInAppNotification &&
        data?.subscribeToInAppNotification?.notification
      ) {
        const newFetchedData = {
          ...data?.subscribeToInAppNotification?.notification,
          createdAt: new Date().toISOString(),
        };
        if (
          !newFetchedData.isRead &&
          ![
            "bulk-delete-notification",
            "bulk-permanent-delete-notification",
          ].includes(newFetchedData.metaData?.subject || "")
        ) {
          notificationSoundPlay();
          setTimeout(() => {}, 1000);
          if (!newNotificationReceived?.visible) {
            setNewNotificationReceived({
              visible: true,
              data: newFetchedData,
            });
          }
        }

        let responseData: ReminderDataType[] = [
          newFetchedData,
          ...remindersData.data,
        ];
        notificationDeleteSessionIdFilter(
          responseData,
          removeModuleDataById,
          massDeleteSessionId,
          setMassDeleteSessionId,
          massRecycleBinSessionId,
          setMassRecycleBinSessionId
        );
        setRemindersData({
          loading: false,
          failed: false,
          data: responseData,
        });
        return;
      }
    },
  });

  React.useEffect(() => {
    getReminders({
      variables: {
        filters: [{ operator: "eq", name: "isRead", value: false }],
        orderBy: [{ name: "updatedAt", order: ["DESC"] }],
      },
    }).then((responseOnCompletion) => {
      setSelectedRecords([]);
      if (
        responseOnCompletion &&
        responseOnCompletion?.data?.fetchInAppNotification &&
        responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
          "-success"
        )
      ) {
        const responseData: ReminderDataType[] =
          responseOnCompletion?.data?.fetchInAppNotification?.data?.filter(
            (reminder: ReminderDataType) => !reminder.isRead
          ) ?? [];
        notificationDeleteSessionIdFilter(
          responseData,
          removeModuleDataById,
          massDeleteSessionId,
          setMassDeleteSessionId,
          massRecycleBinSessionId,
          setMassRecycleBinSessionId
        );
        setRemindersData({
          loading: false,
          failed: false,
          data: responseData,
        });
        return;
      } else {
        setRemindersData({ loading: false, failed: true, data: [] });
        return;
      }
    });
  }, []);

  const handleSelectedRecords = (reminder: ReminderDataType) => {
    let updatedSelectedRecords = [...selectedRecords];
    const findSelectedRecord = updatedSelectedRecords?.findIndex(
      (record) => record.id === reminder.id
    );
    if (findSelectedRecord === -1) {
      updatedSelectedRecords = [...updatedSelectedRecords, reminder];
      setSelectedRecords([...updatedSelectedRecords]);
      return;
    }
    updatedSelectedRecords.splice(findSelectedRecord, 1);
    setSelectedRecords([...updatedSelectedRecords]);
  };

  const handleMarkReminderRead = async (reminder: ReminderDataType) => {
    setReminderLoading({ reminder: reminder, loading: true });
    try {
      await updateReminder({
        variables: {
          id: reminder.id,
          input: {
            isRead: true,
          },
        },
      }).then((response) => {
        setRemindersData({
          loading: false,
          failed: false,
          data: remindersData?.data?.filter(
            (reminderData) => reminderData.id !== reminder.id
          ),
        });
        setReminderLoading({ reminder: null, loading: false });
        setNewNotificationReceived({ visible: false, data: null });
      });
    } catch (error) {
      setReminderLoading({ reminder: null, loading: false });
    }
  };

  const handleReloadButtonClicked = () => {
    getReminders({
      variables: {
        filters: [{ operator: "eq", name: "isRead", value: false }],
        orderBy: [{ name: "updatedAt", order: ["DESC"] }],
      },
    }).then((responseOnCompletion) => {
      setSelectedRecords([]);
      if (
        responseOnCompletion &&
        responseOnCompletion?.data?.fetchInAppNotification &&
        responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
          "-success"
        )
      ) {
        let remindersDataWithDates = getReminderDataWithDates(
          remindersData?.data,
          user ?? undefined
        ).filter(
          (reminderData) =>
            reminderData.createdAtDate ===
            getDate(new Date().toISOString(), user ?? undefined)
        );
        const refetchedData = getReminderDataWithDates(
          responseOnCompletion?.data?.fetchInAppNotification?.data?.filter(
            (reminder: ReminderDataType) =>
              !reminder.isRead &&
              ![
                "bulk-delete-notification",
                "bulk-permanent-delete-notification",
                // "bulk-update-notification",
              ].includes(reminder.metaData?.subject || "")
          ) ?? [],
          user ?? undefined
        ).filter(
          (reminderData) =>
            reminderData.createdAtDate ===
            getDate(new Date().toISOString(), user ?? undefined)
        );
        try {
          refetchedData?.forEach(async (refetchedItem) => {
            const findIndex = remindersDataWithDates?.findIndex(
              (reminderItem) => refetchedItem?.id === reminderItem?.id
            );
            if (findIndex === -1) {
              notificationSoundPlay();
              setTimeout(() => {}, 1000);
              if (!newNotificationReceived?.visible) {
                setNewNotificationReceived({
                  visible: true,
                  data: refetchedItem,
                });
              }
            }
          });
        } catch (error) {}
        const responseData: ReminderDataType[] =
          responseOnCompletion?.data?.fetchInAppNotification?.data?.filter(
            (reminder: ReminderDataType) => !reminder.isRead
          ) ?? [];
        notificationDeleteSessionIdFilter(
          responseData,
          removeModuleDataById,
          massDeleteSessionId,
          setMassDeleteSessionId,
          massRecycleBinSessionId,
          setMassRecycleBinSessionId
        );
        setRemindersData({
          loading: false,
          failed: false,
          data: responseData,
        });
        return;
      } else {
        setRemindersData({
          loading: false,
          failed: true,
          data: [],
        });
        return;
      }
    });
  };

  return (
    <div
      className={`fixed right-0 bottom-0 w-full sm:w-1/3 sm:max-w-[350px] z-[502] max-h-[50vh] bg-white rounded-tl-xl shadow-lg border`}
    >
      <ReminderHeader
        navbarColor={navbarColor}
        navbarTextColor={navbarTextColor}
        reminderLoading={reminderLoading}
        remindersData={remindersData}
        showReminders={showReminders}
        user={user}
        setRemindersData={setRemindersData}
        setShowReminders={setShowReminders}
        handleReloadButtonClicked={handleReloadButtonClicked}
      />
      <div
        className={`${
          selectedRecords?.length > 0
            ? "grid grid-cols-2 px-8 pt-2 items-end"
            : "hidden"
        }`}
      >
        <form>
          <Formik
            initialValues={{
              selectAllRecords:
                selectedRecords?.length === remindersData?.data?.length
                  ? true
                  : false,
            }}
            onSubmit={() => {}}
            enableReinitialize
          >
            {({ values, setValues, handleChange }) => (
              <FormCheckBox
                name={"selectAllRecords"}
                datatestid="check-all-reminders"
                label="Select All"
                marginY="my-0"
                disabled={reminderLoading?.loading}
                value={values["selectAllRecords"]}
                onChange={(e) => {
                  handleChange(e);
                  selectedRecords?.length === remindersData?.data?.length
                    ? setSelectedRecords([])
                    : setSelectedRecords([...remindersData?.data]);
                }}
              />
            )}
          </Formik>
        </form>
        <Button
          id="mark-all-reminder-read"
          userEventName="reminder-clear-all-click"
          buttonType="thin"
          disabled={reminderLoading?.loading}
          onClick={() => {
            selectedRecords?.forEach(
              async (selectedRecord) =>
                await handleMarkReminderRead(selectedRecord)
            );
            setRemindersData({
              loading: true,
              failed: false,
              data: remindersData?.data,
            });
            getReminders({
              variables: {
                filters: [{ operator: "eq", name: "isRead", value: false }],
                orderBy: [{ name: "updatedAt", order: ["DESC"] }],
              },
            }).then((responseOnCompletion) => {
              setSelectedRecords([]);
              if (
                responseOnCompletion &&
                responseOnCompletion?.data?.fetchInAppNotification &&
                responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
                  "-success"
                )
              ) {
                const responseData =
                  responseOnCompletion?.data?.fetchInAppNotification?.data?.filter(
                    (reminder: ReminderDataType) => !reminder.isRead
                  ) ?? [];
                notificationDeleteSessionIdFilter(
                  responseData,
                  removeModuleDataById,
                  massDeleteSessionId,
                  setMassDeleteSessionId,
                  massRecycleBinSessionId,
                  setMassRecycleBinSessionId
                );
                setRemindersData({
                  loading: false,
                  failed: false,
                  data: responseData,
                });

                return;
              } else {
                setRemindersData({
                  loading: false,
                  failed: true,
                  data: [],
                });
                return;
              }
            });
          }}
        >
          Mark All Read
        </Button>
      </div>
      <div
        className={`${
          JSON.parse(localStorage.getItem("showReminder") as string) &&
          JSON.parse(localStorage.getItem("showReminder") as string)[
            user?.id ?? ""
          ]
            ? ""
            : "hidden"
        } w-full h-full pr-[10px] py-2`}
      >
        {(!remindersData?.loading && !remindersData?.failed) ||
        (remindersData?.data && remindersData?.data?.length > 0) ? (
          remindersData?.data && remindersData?.data?.length > 0 ? (
            <div className="w-full max-h-[40vh] card-scroll overflow-y-auto p-2">
              {getAllUniqueDates(remindersData?.data, user ?? undefined).map(
                (uniqueDate, index) => (
                  <div key={index} className={`py-2`}>
                    <hr
                      data-testid={uniqueDate}
                      className="hr-text px-4"
                      data-content={`${uniqueDate}`}
                    />
                    {getReminderDataWithDates(
                      remindersData?.data,
                      user ?? undefined
                    )
                      .filter(
                        (reminderData) =>
                          reminderData.createdAtDate === uniqueDate
                      )
                      ?.map((reminder, index) => (
                        <ReminderItem
                          key={index}
                          disabled={
                            reminderLoading?.loading || remindersData?.loading
                          }
                          recordSelected={
                            selectedRecords?.findIndex(
                              (record) => record.id === reminder.id
                            ) === -1
                              ? false
                              : true
                          }
                          reminder={reminder}
                          handleMarkReminderRead={handleMarkReminderRead}
                          handleSelectedRecords={handleSelectedRecords}
                        />
                      ))}
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              className={`text-xs w-full p-4 flex items-center justify-center`}
            >
              No Reminders
            </div>
          )
        ) : (
          <></>
        )}
      </div>
      {newNotificationReceived?.visible && newNotificationReceived?.data && (
        <>
          <GenericFormModalContainer
            topIconType="Close"
            limitWidth={true}
            formHeading={
              newNotificationReceived?.data?.metaData?.subject ===
              "bulk-update-notification"
                ? "Mass Update Reminder"
                : newNotificationReceived?.data?.metaData?.subject ===
                  "bulk-restore-notification"
                ? "Mass Restore Reminder"
                : "New Reminder"
            }
            onCancel={() =>
              setNewNotificationReceived({ visible: false, data: null })
            }
            onOutsideClick={() =>
              setNewNotificationReceived({ visible: false, data: null })
            }
          >
            <ReminderItemPopup
              reminderData={newNotificationReceived?.data}
              modelLabel={`${`${getNavigationLabel({
                navigations: navigations,
                currentModuleName:
                  newNotificationReceived?.data?.serviceModuleName,
                currentModuleLabel:
                  newNotificationReceived?.data?.serviceModuleName ?? "",
                defaultLabel:
                  newNotificationReceived?.data?.serviceModuleName ?? "",
              })}`}`}
              handleCancel={() => {
                setNewNotificationReceived({ visible: false, data: null });
              }}
              handleMarkReminderRead={handleMarkReminderRead}
              showEditButton={false}
              genericModels={genericModels}
              allLayoutFetched={allLayoutFetched}
              userPreferences={userPreferences}
              allModulesFetched={allModulesFetched}
            />
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setNewNotificationReceived({ visible: false, data: null })
            }
          />
        </>
      )}
    </div>
  );
};
