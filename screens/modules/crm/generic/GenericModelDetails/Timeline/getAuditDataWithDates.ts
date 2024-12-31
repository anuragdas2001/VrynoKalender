import { getDate } from "../../../../../../components/TailwindControls/DayCalculator";
import { User } from "../../../../../../models/Accounts";
import { TimelineEventType } from "./auditLogDataExtractor";

export function getAuditDataWithDates(
  auditLogRecords: TimelineEventType[],
  user?: User
) {
  const updatedAuditLogData = [
    ...auditLogRecords?.map((reminder) => {
      return {
        ...reminder,
        createdAtDate: getDate(reminder.createdAt, user),
      };
    }),
  ];
  // Data is already coming in ascending order - no need to sort
  //   .sort((itemOne, itemTwo) =>
  //     new Date(itemOne?.createdAt) > new Date(itemTwo.createdAt) ? -1 : 1
  //   );

  return updatedAuditLogData;
}
