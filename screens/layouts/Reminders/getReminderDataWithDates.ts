import {
  getDate,
  getDateAndTime,
} from "../../../components/TailwindControls/DayCalculator";
import { User } from "../../../models/Accounts";
import { ReminderDataType } from "./ReminderModal";

export const getReminderDataWithDates = (
  remindersData: ReminderDataType[],
  user?: User
) => {
  let updatedRemindersData = [
    ...remindersData?.map((reminder) => {
      return {
        ...reminder,
        createdAt: getDateAndTime(reminder.createdAt, user),
        createdAtDate: getDate(reminder.createdAt, user),
      };
    }),
  ].sort((itemOne, itemTwo) =>
    new Date(itemOne?.createdAt) > new Date(itemTwo.createdAt) ? -1 : 1
  );

  return updatedRemindersData;
};
