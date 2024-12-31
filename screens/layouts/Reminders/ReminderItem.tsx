import { Formik } from "formik";
import React, { useContext } from "react";
import FormCheckBox from "../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { ReminderDataType } from "./ReminderModal";
import _ from "lodash";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import { getNavigationLabel } from "../../modules/crm/shared/utils/getNavigationLabel";
import CloseLineIcon from "remixicon-react/CloseLineIcon";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import Link from "next/link";
import { appsUrlGenerator } from "../../modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../models/allowedViews";
import { useRouter } from "next/router";

export type ReminderItemProps = {
  reminder: ReminderDataType;
  recordSelected: boolean;
  disabled?: boolean;
  handleMarkReminderRead: (reminder: ReminderDataType) => void;
  handleSelectedRecords: (reminder: ReminderDataType) => void;
};

export const ReminderItem = ({
  reminder,
  recordSelected,
  disabled = false,
  handleMarkReminderRead,
  handleSelectedRecords,
}: ReminderItemProps) => {
  const router = useRouter();
  const { navigations } = useContext(NavigationStoreContext);
  const [closeIconVisible, setCloseIconVisible] =
    React.useState<boolean>(false);

  const disableClick = [
    "bulk-delete-notification",
    "bulk-permanent-delete-notification",
    "bulk-update-notification",
    "bulk-restore-notification",
  ].includes(reminder?.metaData?.subject || "");

  const navigationLabel = `${getNavigationLabel({
    navigations: navigations,
    currentModuleName: reminder?.serviceModuleName,
    currentModuleLabel: reminder?.serviceModuleName,
    defaultLabel: reminder?.serviceModuleName,
  })}`;

  const notificationMessage = `${_.get(
    reminder?.metaData,
    "message",
    ""
  ).replace("Notification for", "")}`;

  return (
    <div
      className="w-full grid grid-cols-12 hover:bg-slate-100 mr-2"
      onPointerEnter={() => setCloseIconVisible(true)}
      onPointerLeave={() => setCloseIconVisible(false)}
      aria-disabled={disabled}
      onClick={() => {
        if (disableClick) return;
        handleMarkReminderRead(reminder);
        router.push(
          `${appsUrlGenerator(
            reminder.serviceName,
            reminder.serviceModuleName,
            AllowedViews.detail,
            reminder.recordId as string
          )}`
        );
      }}
    >
      <div
        className={`col-span-11 items-center ${
          !disableClick ? "cursor-pointer" : ""
        }`}
      >
        <div className="w-full px-6 py-4 flex items-center gap-x-2 col-span-11">
          <form onClick={(e) => e.stopPropagation()}>
            <Formik
              initialValues={{ [reminder.id]: recordSelected }}
              onSubmit={() => {}}
              enableReinitialize
            >
              {({ values, setValues, handleChange }) => (
                <FormCheckBox
                  name={reminder.id}
                  datatestid={`checkbox-reminder-${_.get(
                    reminder?.metaData,
                    "message",
                    ""
                  ).replace("Notification for", "")}`}
                  marginY="my-0"
                  value={recordSelected}
                  disabled={disabled}
                  onChange={(e) => {
                    handleChange(e);
                    handleSelectedRecords(reminder);
                  }}
                />
              )}
            </Formik>
          </form>
          <div className={`items-center text-xsm gap-x-2`}>
            <span data-testid={navigationLabel} className={`text-gray-600`}>
              {`${navigationLabel} - `}
            </span>
            <span className={notificationMessage}>{notificationMessage}</span>
          </div>
        </div>
      </div>
      <Button
        id={`close-reminder-${_.get(reminder?.metaData, "message", "").replace(
          "Notification for",
          ""
        )}`}
        userEventName="reminder-close-clicked"
        customStyle={`${closeIconVisible ? "" : "hidden"}`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          handleMarkReminderRead(reminder);
        }}
      >
        <CloseLineIcon size={18} className={`text-red-400`} />
      </Button>
    </div>
  );
};
