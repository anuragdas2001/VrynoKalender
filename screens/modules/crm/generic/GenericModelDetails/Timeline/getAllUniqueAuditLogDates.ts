import { User } from "../../../../../../models/Accounts";
import { TimelineEventType } from "./auditLogDataExtractor";
import { getDate } from "../../../../../../components/TailwindControls/DayCalculator";

export function getAllUniqueAuditLogDates(
  auditLogRecords: TimelineEventType[],
  user?: User
) {
  const allUniqueDates: string[] = [];
  const updatedRemindersData = [
    ...auditLogRecords?.map((auditData) => {
      return {
        ...auditData,
        createdAtDate: getDate(auditData.createdAt, user),
      };
    }),
  ];
  updatedRemindersData?.forEach((auditData) => {
    const findIndexofDate = allUniqueDates.findIndex(
      (uniqueDate) => uniqueDate === auditData.createdAtDate
    );
    if (findIndexofDate === -1) allUniqueDates.push(auditData.createdAtDate);
  });
  allUniqueDates.sort((dateOne, dateTwo) =>
    new Date(dateOne) > new Date(dateTwo) ? -1 : 1
  );
  return allUniqueDates;
}
