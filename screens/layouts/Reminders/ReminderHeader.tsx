import React from "react";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../components/TailwindControls/Loading/Loading";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import CloseIcon from "remixicon-react/SubtractLineIcon";
import OpenIcon from "remixicon-react/ArrowUpSFillIcon";
import ReloadIcon from "remixicon-react/RestartLineIcon";
import AlertIcon from "remixicon-react/AlertFillIcon";
import { User } from "../../../models/Accounts";
import { ReminderDataType } from "./ReminderModal";

type ReminderHeaderProps = {
  navbarColor: string;
  navbarTextColor: "white" | "black";
  user: User | null;
  showReminders?: boolean;
  remindersData: {
    loading: boolean;
    failed: boolean;
    data: ReminderDataType[];
  };
  reminderLoading: {
    reminder: ReminderDataType | null;
    loading: boolean;
  };
  setShowReminders: (value: boolean) => void;
  setRemindersData: (value: {
    loading: boolean;
    failed: boolean;
    data: ReminderDataType[];
  }) => void;
  handleReloadButtonClicked: () => void;
};

export const ReminderHeader = ({
  navbarColor,
  navbarTextColor,
  user,
  reminderLoading,
  showReminders,
  remindersData,
  setRemindersData,
  setShowReminders,
  handleReloadButtonClicked,
}: ReminderHeaderProps) => {
  return (
    <div
      style={{
        backgroundColor: navbarColor ?? "white",
        color: !navbarColor ? "black" : navbarTextColor ?? "black",
      }}
      className={`flex items-center justify-between px-4 py-3 gap-x-4 cursor-pointer border border-black rounded-tl-xl shadow-md`}
      onClick={() => {
        setShowReminders(!showReminders);
        localStorage.setItem(
          "showReminder",
          JSON.stringify({ [user?.id ?? ""]: !showReminders })
        );
      }}
    >
      <div className="flex items-center gap-x-2 text-sm">
        <TimeFillIcon
          size={18}
          color={!navbarColor ? "black" : navbarTextColor ?? "black"}
        />
        Reminders
        {!remindersData?.loading && !remindersData?.failed && (
          <div
            className={`px-3 font-bold flex items-center justify-center text-xs rounded-2xl bg-${
              !navbarColor ? "black" : navbarTextColor ?? "black"
            } text-${
              !navbarColor
                ? "white"
                : navbarTextColor === "black"
                ? "white"
                : "black"
            }`}
          >
            {remindersData?.data?.length}
          </div>
        )}
      </div>
      <div className={`flex items-center gap-x-4`}>
        {remindersData?.failed && (
          <div className="flex items-center gap-x-1 text-xsm">
            <AlertIcon color="orange" size="16" />
            Failed
          </div>
        )}
        {showReminders ? (
          <Button
            id="close-reminders"
            userEventName="reminder-modal-close-icon-click"
            customStyle={""}
          >
            <CloseIcon
              size={18}
              color={!navbarColor ? "black" : navbarTextColor ?? "black"}
            />
          </Button>
        ) : (
          <Button
            id="open-reminders"
            userEventName="reminder-modal-open-icon-click"
            customStyle={""}
          >
            <OpenIcon
              size={18}
              color={!navbarColor ? "black" : navbarTextColor ?? "black"}
            />
          </Button>
        )}
        {remindersData?.loading || reminderLoading?.loading ? (
          <Loading color={navbarTextColor === "black" ? "Black" : "White"} />
        ) : (
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
              handleReloadButtonClicked();
            }}
          >
            <ReloadIcon
              size={18}
              color={!navbarColor ? "black" : navbarTextColor ?? "black"}
            />
          </Button>
        )}
      </div>
    </div>
  );
};
