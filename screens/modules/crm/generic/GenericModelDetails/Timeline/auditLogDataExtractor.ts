import {
  IAuditFieldUpdate,
  IAuditRecordCreate,
  IAuditRecordDelete,
  IAuditActivityCreate,
  IAuditActivityUpdate,
  IAuditActivityDelete,
  IAuditWorkflowAction,
  IMaskedView,
} from "../../../../../../shared/types/auditLogTypes";

export type TimelineEventType =
  | IAuditRecordCreate
  | IAuditRecordDelete
  | IAuditFieldUpdate
  | IAuditActivityCreate
  | IAuditActivityUpdate
  | IAuditActivityDelete
  | IAuditWorkflowAction
  | IMaskedView;

export const auditLogDataExtractor = (fetchedData: any[]) => {
  const extractedData: TimelineEventType[] = [];
  fetchedData.forEach((data) => {
    if (data["auditDetails"] && data["auditDetails"][0].type)
      extractedData.push(data["auditDetails"][0]);
    else console.error("Audit details not found in data: ", data["__typename"]);
  });
  return extractedData;
};
