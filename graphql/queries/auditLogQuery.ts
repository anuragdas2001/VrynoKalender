import { gql } from "@apollo/client";
import { IAuditModules } from "../../shared/types/auditLogTypes";

const NoteActivityAuditLog = `... on NoteActivity {
  activityRecordId
  activityRecordName
  type
  content
  }`;
const AttachmentActivityAuditLog = `... on AttachmentActivity {
  activityRecordId
  activityRecordName
  type
  fieldUpdateDetails
  }`;
const CallLogActivityAuditLog = `... on CallLogActivity {
  activityRecordId
  activityRecordName
  type
  fieldName
  fieldUpdateDetails
  }`;
const MeetingActivityAdutitLog = `... on MeetingActivity {
  activityRecordId
  activityRecordName
  type
  fieldName
  fieldUpdateDetails
  }`;
const TaskActivityAuditLog = ` ... on TaskActivity {
  activityRecordId
  activityRecordName
  type
  fieldName
  fieldUpdateDetails
  }`;

const GenericType = `
  type
  id
  recordId
  service
  moduleUniqueName
  moduleName
  triggeredBy
  createdBy
  createdAt
`;

const QuotedItemType = `
    ${GenericType}
    quotedItemType {
      type
      fieldName
      quoteRecordId
      quoteItemRecordId
      fieldUpdateDetails
    }
`;

const OrderedItemType = `
    ${GenericType}
    orderedItemType {
      type
      fieldName
      salesOrderRecordId
      orderedItemRecordId
      fieldUpdateDetails
    }
`;

const InvoicedItemType = `
  ${GenericType}
  invoicedItemType {
    type
    fieldName
    invoiceRecordId
    invoicedItemRecordId
    fieldUpdateDetails
  }
`;

const PurchaseItemType = `
  ${GenericType}
  purchaseItemType {
    type
    fieldName
    purchaseRecordId
    purchaseItemRecordId
    fieldUpdateDetails
  }
`;

const RecordFields = GenericType;

export const auditLogQueryGenerator = (moduleName: string) => {
  return `
    AuditLogs($recordId: String!, $pageNumber: Int, $event_types: [String], $activity_type: String,) {
      getAuditLogs(recordId: $recordId, pageNumber: $pageNumber, event_types: $event_types, activity_type: $activity_type) {
        __typename
        ... on ${moduleName} {
            auditDetails {
                __typename
                ... on RecordCreate {
                    ${RecordFields}
                }
                ... on RecordDelete {
                  ${RecordFields}
                }
                ... on FieldUpdate {
                  ${RecordFields}
                    fieldUniqueName
                    fieldUpdateDetails
                }
                ... on LeadConvert {
                  ${RecordFields}
                }
                ... on QuoteConvert {
                  ${RecordFields}
                }
                ... on SalesOrderConvert {
                  ${RecordFields}
                }
                ... on QuotedItemCreate {
                  ${QuotedItemType}
                }
                ... on QuotedItemUpdate {
                  ${QuotedItemType}
                }
                ... on QuotedItemDelete {
                  ${QuotedItemType}
                }
                ... on OrderedItemCreate {
                  ${OrderedItemType}
                }
                ... on OrderedItemUpdate {
                  ${OrderedItemType}
                }
                ... on OrderedItemDelete {
                  ${OrderedItemType}
                }
                ... on InvoicedItemCreate {
                  ${InvoicedItemType}
                }
                ... on InvoicedItemUpdate {
                  ${InvoicedItemType}
                }
                ... on InvoicedItemDelete {
                  ${InvoicedItemType}
                }
                ... on PurchaseItemCreate {
                  ${PurchaseItemType}
                }
                ... on PurchaseItemUpdate {
                  ${PurchaseItemType}
                }
                ... on PurchaseItemDelete {
                  ${PurchaseItemType}
                }
                ... on ActivityCreate {
                  ${RecordFields}
                    activityType {
                        __typename
                        ${NoteActivityAuditLog}
                        ${AttachmentActivityAuditLog}
                        ${CallLogActivityAuditLog}
                        ${MeetingActivityAdutitLog}
                        ${TaskActivityAuditLog}
                    }
                }
                ... on ActivityUpdate {
                  ${RecordFields}
                    activityType {
                        __typename
                        ${NoteActivityAuditLog}
                        ${AttachmentActivityAuditLog}
                        ${CallLogActivityAuditLog}
                        ${MeetingActivityAdutitLog}
                        ${TaskActivityAuditLog}
                    }
                }
                ... on ActivityDelete {
                  ${RecordFields}
                    activityType {
                        __typename
                        ${NoteActivityAuditLog}
                        ${AttachmentActivityAuditLog}
                        ${CallLogActivityAuditLog}
                        ${MeetingActivityAdutitLog}
                        ${TaskActivityAuditLog}
                    }
                }
                ... on WorkflowAction {
                  ${RecordFields}
                    workflowType {
                        __typename 
                        ... on InAppNotificationWorkflow {
                            type
                            actionType
                            actionName
                            actionId
                            ruleId
                            ruleName
                        }
                        ... on EmailWorkflow {
                            type
                            subject
                            actionType
                            actionName
                            actionId
                            ruleId
                            ruleName
                        }
                        ... on WebhookWorkflow {
                            type
                            ruleId
                            ruleName
                      }
                    }
                }
                ... on MaskedView {
                  ${RecordFields}
                  fieldName
                  fieldUniqueName
                }
                }
            }
        }
    }`;
};

export const getAuditLogs = (moduleName: string) => {
  if (!moduleName) throw new Error("getAuditLogs: Module name is required");
  const fetchQuery = `
    query ${auditLogQueryGenerator(moduleName)}
  `;
  return gql(fetchQuery);
};

export const auditLogFilterQueryGenerator = (
  moduleName: string,
  type: string
) => {
  return `
      AuditLogs($recordId: String!, $pageNumber: Int, $event_types: [String], $activity_type: String,) {
        getAuditLogs(recordId: $recordId, pageNumber: $pageNumber, event_types: $event_types, activity_type: $activity_type) {
          __typename
          ... on ${moduleName} {
              auditDetails {
                  __typename
                  ... on ActivityCreate {
                    ${RecordFields}
                      activityType {
                          __typename
                          ${
                            type === "note"
                              ? NoteActivityAuditLog
                              : type === "attachment"
                              ? AttachmentActivityAuditLog
                              : type === "calllog"
                              ? CallLogActivityAuditLog
                              : type === "meeting"
                              ? MeetingActivityAdutitLog
                              : type === "task"
                              ? TaskActivityAuditLog
                              : ""
                          }
                      }
                  }
                  ... on ActivityUpdate {
                    ${RecordFields}
                      activityType {
                        __typename
                        ${
                          type === "note"
                            ? NoteActivityAuditLog
                            : type === "attachment"
                            ? AttachmentActivityAuditLog
                            : type === "calllog"
                            ? CallLogActivityAuditLog
                            : type === "meeting"
                            ? MeetingActivityAdutitLog
                            : type === "task"
                            ? TaskActivityAuditLog
                            : ""
                        }
                    }
                  }
                  ... on ActivityDelete {
                    ${RecordFields}
                      activityType {
                        __typename
                        ${
                          type === "note"
                            ? NoteActivityAuditLog
                            : type === "attachment"
                            ? AttachmentActivityAuditLog
                            : type === "calllog"
                            ? CallLogActivityAuditLog
                            : type === "meeting"
                            ? MeetingActivityAdutitLog
                            : type === "task"
                            ? TaskActivityAuditLog
                            : ""
                        }
                    }
                  }
                  }
              }
          }
      }`;
};

export const getAuditLogsActivityFilter = (
  moduleName: string,
  type: string
) => {
  if (!["note", "attachment", "task", "meeting", "calllog"].includes(type))
    return getAuditLogs(moduleName);
  if (!moduleName) throw new Error("getAuditLogs: Module name is required");
  const fetchQuery = `
      query ${auditLogFilterQueryGenerator(moduleName, type)}
    `;
  return gql(fetchQuery);
};
