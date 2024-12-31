import React, { useContext } from "react";
import NotificationIcon from "remixicon-react/Notification3LineIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { REMINDER_QUERY } from "../../../../graphql/queries/reminderQuery";
import { ReminderDataType } from "../../Reminders/ReminderModal";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import { getReminderDataWithDates } from "../../Reminders/getReminderDataWithDates";
import _ from "lodash";
import { getNavigationLabel } from "../../../modules/crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../stores/RootStore/NavigationStore/NavigationStore";
import { Loading } from "../../../../components/TailwindControls/Loading/Loading";
import { getAllUniqueDates } from "../../Reminders/getAllUniqueDates";
import AlertIcon from "remixicon-react/AlertFillIcon";
import ReloadIcon from "remixicon-react/RestartLineIcon";
import Link from "next/link";
import { appsUrlGenerator } from "../../../modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../models/allowedViews";
import { REMINDER_MUTATION } from "../../../../graphql/subscriptions/remindersMutation";
import { notificationDeleteSessionIdFilter } from "../../../modules/crm/shared/utils/notificationDeleteSessionIdFilter";
import { useMassDeleteSessionId } from "../../GenericContainer";
import { useMassRecycleBinSessionId } from "../../../../pages/recycle-bin/[[...slug]]";
import { IN_APP_NOTIFICATION_SUBSCRIPTION } from "../../../../graphql/subscriptions/remindersSubscription";
import { User } from "../../../../models/Accounts";

export type NotificationScreenType = {
  disabled: boolean;
  navbarColor?: string;
  navbarTextColor: string;
  allNotificationClass: string;
  user: User | null;
  setAllNotificationClass: (value: string) => void;
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
};

export const NotificationScreen = ({
  disabled,
  navbarColor,
  navbarTextColor,
  allNotificationClass,
  user,
  removeModuleDataById,
  setAllNotificationClass,
}: NotificationScreenType) => {
  const { massDeleteSessionId, setMassDeleteSessionId } =
    useMassDeleteSessionId();
  const { massRecycleBinSessionId, setMassRecycleBinSessionId } =
    useMassRecycleBinSessionId();
  const { navigations } = useContext(NavigationStoreContext);
  const [remindersCount, setRemindersCount] = React.useState<number>(0);
  const [remindersData, setRemindersData] = React.useState<{
    loading: boolean;
    failed: boolean;
    data: ReminderDataType[];
  }>({ loading: true, failed: false, data: [] });
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [reminderLoading, setReminderLoading] = React.useState<{
    reminder: ReminderDataType | null;
    loading: boolean;
  }>({ reminder: null, loading: false });

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

        let responseData: ReminderDataType[] = [
          newFetchedData,
          ...remindersData.data,
        ];
        setRemindersData({
          loading: false,
          failed: false,
          data: responseData,
        });
        return;
      }
    },
  });

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

  React.useEffect(() => {
    getReminders({
      variables: {},
    }).then((responseOnCompletion) => {
      if (
        responseOnCompletion &&
        responseOnCompletion?.data?.fetchInAppNotification &&
        responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
          "-success"
        )
      ) {
        const responseData =
          responseOnCompletion?.data?.fetchInAppNotification?.data ?? [];
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
        setRemindersCount(
          responseOnCompletion?.data?.fetchInAppNotification?.count
        );
        return;
      } else {
        setRemindersData({ loading: false, failed: true, data: [] });
        return;
      }
    });
  }, []);

  const handleLoadMoreClicked = async () => {
    setRemindersData({
      loading: true,
      failed: false,
      data: [...remindersData?.data],
    });
    await getReminders({
      variables: {
        pageNumber: currentPageNumber + 1,
      },
    }).then((responseOnCompletion) => {
      if (
        responseOnCompletion &&
        responseOnCompletion?.data?.fetchInAppNotification &&
        responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
          "-success"
        )
      ) {
        const responseData = [
          ...remindersData?.data,
          ...responseOnCompletion?.data?.fetchInAppNotification?.data,
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
        setRemindersCount(
          responseOnCompletion?.data?.fetchInAppNotification?.count
        );
        return;
      } else {
        setRemindersData({ loading: false, failed: true, data: [] });
        return;
      }
    });
    setCurrentPageNumber(currentPageNumber + 1);
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
          data: [
            ...remindersData?.data?.map((reminderData) => {
              if (reminderData.id !== reminder.id) {
                return { ...reminderData, isRead: true };
              } else return reminderData;
            }),
          ],
        });
        setReminderLoading({ reminder: null, loading: false });
      });
    } catch (error) {
      setReminderLoading({ reminder: null, loading: false });
    }
  };

  return (
    <>
      <Button
        id="sm-all-notification-button"
        kind="invisible"
        buttonType="invisible"
        onClick={() => setAllNotificationClass("translate-x-[67%]")}
        disabled={disabled}
        userEventName="sm-all-notification-modal-click"
        customStyle={`sm:hidden ${disabled ? "opacity-50" : ""}`}
      >
        <NotificationIcon size={22} color={navbarTextColor} />
      </Button>
      <Button
        id="all-notification-button"
        kind="invisible"
        buttonType="invisible"
        onClick={() => setAllNotificationClass("translate-x-[75%]")}
        disabled={disabled}
        userEventName="all-notification-modal-click"
        customStyle={`hidden sm:block ${disabled ? "opacity-50" : ""}`}
      >
        <NotificationIcon size={22} color={navbarTextColor} />
      </Button>
      <div
        className={`w-full h-screen overflow-hidden absolute inset-y-0 left-0 transform ${
          allNotificationClass === "translate-x-full"
            ? "hidden"
            : allNotificationClass
        } transition duration-200 ease-in-out z-[10001]`}
      >
        <div
          className={`shadow-lg border w-1/3 sm:w-1/4 h-screen text-black px-2`}
          style={{
            background:
              "linear-gradient(112.6deg, #f2f7fa 0%, #edf5f8 66.67%,#bed8e6 100%)",
          }}
        >
          <div className="w-full flex items-center justify-between text-sm py-2">
            <div className="flex items-center gap-x-2">
              <Button
                id="close-notification-side-menu"
                onClick={() => {
                  setAllNotificationClass("translate-x-full");
                }}
                customStyle={""}
                userEventName="close-notification-side-menu-button:clicked"
              >
                <CloseLineIcon />
              </Button>
              <NotificationIcon size={18} color={"black"} />
              Notifications
              {!remindersData?.loading && !remindersData?.failed && (
                <div
                  className={`px-3 font-bold flex items-center justify-center text-xs rounded-2xl bg-black text-white`}
                >
                  {remindersCount}
                </div>
              )}
            </div>
            <div className="flex items-center gap-x-1">
              {remindersData?.failed && (
                <div className="flex items-center gap-x-1 text-xsm">
                  <AlertIcon color="orange" size="16" />
                  Failed
                </div>
              )}
              <Button
                id="reload-reminders"
                userEventName="reminder-reload-click"
                customStyle={""}
                onClick={(e) => {
                  e.stopPropagation();
                  setRemindersData({
                    loading: true,
                    failed: false,
                    data: remindersData?.data,
                  });
                  getReminders().then((responseOnCompletion) => {
                    if (
                      responseOnCompletion &&
                      responseOnCompletion?.data?.fetchInAppNotification &&
                      responseOnCompletion?.data?.fetchInAppNotification?.messageKey?.includes(
                        "-success"
                      )
                    ) {
                      const responseData =
                        responseOnCompletion?.data?.fetchInAppNotification
                          ?.data ?? [];
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
                <ReloadIcon size={18} color={"black"} />
              </Button>
            </div>
          </div>
          <hr />
          <div className="">
            {remindersData?.loading ? (
              _.range(0, 10).map((number, index) => (
                <div
                  key={index}
                  className="h-7 animate-pulse bg-gray-200 rounded w-full block my-3"
                />
              ))
            ) : (!remindersData?.loading && !remindersData?.failed) ||
              (remindersData?.data && remindersData?.data?.length > 0) ? (
              remindersData?.data && remindersData?.data?.length > 0 ? (
                <div className="w-full max-h-[90vh] hideScrollBarWithFunctionality overflow-y-auto">
                  {getAllUniqueDates(
                    remindersData?.data,
                    user ?? undefined
                  ).map((uniqueDate, index) => (
                    <div key={index} className={`py-2`}>
                      <hr
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
                        ?.map((reminder, index) => {
                          const disableClick = [
                            "bulk-delete-notification",
                            "bulk-permanent-delete-notification",
                            "bulk-update-notification",
                            "bulk-restore-notification",
                          ].includes(reminder?.metaData?.subject || "");

                          return (
                            <Link
                              key={index}
                              href={
                                disableClick
                                  ? ``
                                  : `${appsUrlGenerator(
                                      reminder.serviceName,
                                      reminder.serviceModuleName,
                                      AllowedViews.detail,
                                      reminder.recordId as string
                                    )}`
                              }
                              passHref
                              legacyBehavior
                              data-testid={`navigate-inside-notification-popup-${_.get(
                                reminder?.metaData,
                                "message",
                                ""
                              ).replace("Notification for", "")}`}
                            >
                              <a
                                onClick={(e) => {
                                  if (disableClick) {
                                    e.preventDefault();
                                    return;
                                  }
                                  handleMarkReminderRead(reminder);
                                }}
                                className={`items-center text-xsm gap-x-2 my-3 ${
                                  disableClick
                                    ? "cursor-default"
                                    : "cursor-pointer"
                                }  hover:bg-vryno-theme-blue-disable px-2 block`}
                              >
                                <span className={`text-gray-600 inline-block`}>
                                  {`${getNavigationLabel({
                                    navigations: navigations,
                                    currentModuleName:
                                      reminder?.serviceModuleName,
                                    currentModuleLabel:
                                      reminder?.serviceModuleName,
                                    defaultLabel: reminder?.serviceModuleName,
                                  })} - `}
                                </span>
                                <span
                                  className={`${
                                    reminder?.isRead ? "text-gray-500" : ""
                                  } inline-block`}
                                  key={index}
                                >
                                  {_.get(
                                    reminder?.metaData,
                                    "message",
                                    ""
                                  ).replace("Notification for", "")}
                                </span>
                              </a>
                            </Link>
                          );
                        })}
                    </div>
                  ))}
                  {remindersCount > remindersData?.data?.length && (
                    <div className="separator">
                      <p
                        className={`text-sm text-gray-400 flex items-center gap-x-2 cursor-pointer hover:text-vryno-theme-light-blue`}
                        onClick={() => {
                          handleLoadMoreClicked();
                        }}
                      >
                        {remindersData?.loading ? (
                          <Loading color="Blue" />
                        ) : (
                          "Load More"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`text-xs w-full flex items-center justify-center py-4`}
                >
                  No Reminders
                </div>
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
