import {
  getDate,
  getDateAndTime,
} from "../../../components/TailwindControls/DayCalculator";
import { User } from "../../../models/Accounts";
import { ReminderDataType } from "./ReminderModal";

export const getAllUniqueDates = (
  remindersData: ReminderDataType[],
  user?: User
) => {
  let allUniqueDates: string[] = [];
  let updatedRemindersData = [
    ...remindersData?.map((reminder) => {
      return {
        ...reminder,
        createdAt: getDateAndTime(reminder.createdAt, user),
        createdAtDate: getDate(reminder.createdAt, user),
      };
    }),
  ];

  updatedRemindersData?.forEach((reminder) => {
    const findIndexofDate = allUniqueDates.findIndex(
      (uniqueDate) => uniqueDate === reminder.createdAtDate
    );
    if (findIndexofDate === -1)
      allUniqueDates = [...allUniqueDates, reminder.createdAtDate];
  });
  allUniqueDates.sort((dateOne, dateTwo) =>
    new Date(dateOne) > new Date(dateTwo) ? -1 : 1
  );
  return allUniqueDates;
};
