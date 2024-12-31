import { Dispatch, SetStateAction } from "react";
import { updateBackgroundProcessingInSession } from "../../../shared";
import { ReminderDataType } from "../../../../layouts/Reminders/ReminderModal";
import { getModelName } from "../../../recyclebin/RecycleBinScreen";

export const notificationDeleteSessionIdFilter = (
  remindersData: ReminderDataType[],
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void,
  massDeleteSessionId: Record<string, string[]>,
  setMassDeleteSessionId: Dispatch<SetStateAction<Record<string, string[]>>>,
  massRecycleBinSessionId: Record<string, string[]>,
  setMassRecycleBinSessionId: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >
) => {
  updateBackgroundProcessingInSession("ModelData", true);
  const deleteSessionData = JSON.parse(
    sessionStorage.getItem("bulkDeleteData") || "{}"
  );
  const recycleBinSessionData = JSON.parse(
    sessionStorage.getItem("bulkProcessRecycleBinData") || "{}"
  );
  let updatedDeleteSessionData: Record<string, Record<string, string[]>> = {
    ...deleteSessionData,
  };
  let updatedRecycleBinSessionData: Record<string, Record<string, string[]>> = {
    ...recycleBinSessionData,
  };
  let updatedMassDeleteSessionIds: Record<string, string[]> = {
    ...massDeleteSessionId,
  };
  let updatedMassRecycleBinSessionIds: Record<string, string[]> = {
    ...massRecycleBinSessionId,
  };
  // .metaData?.subject
  remindersData?.forEach((d: any) => {
    if (
      [
        "bulk-restore-notification",
        "bulk-permanent-delete-notification",
      ].includes(d.metaData?.subject)
    ) {
      const moduleName = `rb${d?.metaData?.moduleName?.[0].toUpperCase()}${d?.metaData?.moduleName?.slice(
        1
      )}`;

      const deleteSessionDataModule = recycleBinSessionData?.[moduleName || ""];
      const deletedIdsToRemove: string[] = [],
        errorIdsToKeep: string[] = [];
      deleteSessionDataModule?.[d.recordId]?.forEach((id: string) =>
        d.metaData.errorRecordIds?.includes(id)
          ? errorIdsToKeep.push(id)
          : deletedIdsToRemove.push(id)
      );
      updatedRecycleBinSessionData = {
        ...updatedRecycleBinSessionData,
        [moduleName || ""]: Object.keys(
          updatedRecycleBinSessionData?.[moduleName || ""] || {}
        )?.length
          ? {
              ...updatedRecycleBinSessionData?.[moduleName || ""],
              [d.recordId]: [], //errorIdsToKeep
            }
          : { [d.recordId]: [] }, //errorIdsToKeep
      };
      updatedMassRecycleBinSessionIds = {
        ...updatedMassRecycleBinSessionIds,
        [moduleName || ""]: updatedMassRecycleBinSessionIds?.[moduleName || ""]
          ?.length
          ? [
              ...updatedMassRecycleBinSessionIds?.[moduleName || ""],
              ...deletedIdsToRemove,
            ]
          : deletedIdsToRemove,
      };
    } else {
      const deleteSessionDataModule =
        deleteSessionData?.[d?.metaData?.moduleName || ""];
      const deletedIdsToRemove: string[] = [],
        errorIdsToKeep: string[] = [];
      deleteSessionDataModule?.[d.recordId]?.forEach((id: string) =>
        d.metaData.errorRecordIds?.includes(id)
          ? errorIdsToKeep.push(id)
          : deletedIdsToRemove.push(id)
      );
      deletedIdsToRemove.forEach((id) =>
        removeModuleDataById(id, d?.metaData?.moduleName || "")
      );
      updatedDeleteSessionData = {
        ...updatedDeleteSessionData,
        [d?.metaData?.moduleName || ""]: Object.keys(
          updatedDeleteSessionData?.[d?.metaData?.moduleName || ""] || {}
        )?.length
          ? {
              ...updatedDeleteSessionData?.[d?.metaData?.moduleName || ""],
              [d.recordId]: [], //errorIdsToKeep
            }
          : { [d.recordId]: [] }, //errorIdsToKeep
      };
      updatedMassDeleteSessionIds = {
        ...updatedMassDeleteSessionIds,
        [d?.metaData?.moduleName || ""]: updatedMassDeleteSessionIds?.[
          d?.metaData?.moduleName || ""
        ]?.length
          ? [
              ...updatedMassDeleteSessionIds?.[d?.metaData?.moduleName || ""],
              ...deletedIdsToRemove,
            ]
          : deletedIdsToRemove,
      };
    }
  });
  for (const key in updatedRecycleBinSessionData) {
    const updatedData: Record<string, string[]> = {};
    for (const id in updatedRecycleBinSessionData[key]) {
      if (updatedRecycleBinSessionData[key][id]?.length) {
        updatedData[id] = updatedRecycleBinSessionData[key][id];
      }
    }
    updatedRecycleBinSessionData[key] = updatedData;
  }
  setMassRecycleBinSessionId({ ...updatedMassRecycleBinSessionIds });
  sessionStorage.setItem(
    "bulkProcessRecycleBinData",
    JSON.stringify(updatedRecycleBinSessionData)
  );
  for (const key in updatedDeleteSessionData) {
    const updatedData: Record<string, string[]> = {};
    for (const id in updatedDeleteSessionData[key]) {
      if (updatedDeleteSessionData[key][id]?.length) {
        updatedData[id] = updatedDeleteSessionData[key][id];
      }
    }
    updatedDeleteSessionData[key] = updatedData;
  }
  setMassDeleteSessionId(updatedMassDeleteSessionIds);
  sessionStorage.setItem(
    "bulkDeleteData",
    JSON.stringify(updatedDeleteSessionData)
  );
  updateBackgroundProcessingInSession("ModelData", false);
};
