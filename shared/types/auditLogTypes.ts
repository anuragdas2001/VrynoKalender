// [x: string]: string; -> for custom modules names only.
export interface IAuditModules {
  Contact: string;
  Organization: string;
  Lead: string;
  Deal: string;
  Task: string;
  Meeting: string;
  CallLog: string;
  Quote: string;
  Product: string;
  Note: string;
  Attachment: string;
  ProductTax: string;
  DealPipeline: string;
  DealPipelineStage: string;
  // Dashboard: string;
  // QuotedItem: string;
  [x: string]: string;
}

export interface IAuditRecordCreate {
  type: "recordCreate";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string | null;
  createdBy: string;
  createdAt: string;
  __typename: string;
}

export interface IAuditRecordDelete {
  type: "recordDelete";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string | null;
  createdBy: string;
  createdAt: string;
  __typename: string;
}

export interface IAuditFieldUpdate {
  type: "fieldUpdate";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  fieldUniqueName?: [string];
  fieldUpdateDetails: IFieldUpdateDetails;
  __typename: string;
}

export interface IFieldUpdateDetails {
  [x: string]: {
    oldValue?: string | null;
    newValue?: string | null;
    relatedToMetadata?: Record<string, string[]>;
    fieldUniqueName: string;
    fieldLabel: string;
  };
}

export interface IAuditLeadConvert {
  type: "leadConvert";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  __typename: string;
}

// Activity type -------------- START

export interface IAuditActivityCreate {
  type: "activityCreate";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  activityType: AuditActivityTypeType;
  __typename: "ActivityCreate";
}

export interface IAuditActivityUpdate {
  type: "activityUpdate";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  activityType: AuditActivityTypeType;
  __typename: "ActivityUpdate";
}

export interface IAuditActivityDelete {
  type: "activityDelete";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  activityType: AuditActivityTypeType;
  __typename: "ActivityDelete";
}

export type QuotedItems = {
  type: string;
  quoteRecordId: string;
  quoteItemRecordId: string;
  fieldName: [string];
  fieldUpdateDetails: JSON;
  __typename: string;
};

export type InvoiceItems = {
  type: string;
  invoiceRecordId: string;
  quoteItemRecordId: string;
  fieldName: [string];
  fieldUpdateDetails: JSON;
};

export type SalesOrderItems = {
  type: string;
  salesOrderRecordId: string;
  quoteItemRecordId: string;
  fieldName: [string];
  fieldUpdateDetails: JSON;
};

export type AuditNoteActivityType = {
  activityRecordId: string;
  activityRecordName: string;
  type: string;
  content: string;
  __typename: "NoteActivity";
};

export type AuditAttachmentActivityType = {
  activityRecordId: string;
  activityRecordName: string;
  type: string;
  fieldUpdateDetails: IFieldUpdateDetails;
  __typename: "AttachmentActivity";
};

export type AuditActivityModuleType = {
  activityRecordId: string;
  activityRecordName: string;
  type: string;
  fieldName: string[] | null;
  fieldUpdateDetails: IFieldUpdateDetails | null;
  __typename: "CallLogActivity" | "MeetingActivity" | "TaskActivity";
};

type AuditCallLogActivityType = AuditActivityModuleType;

type AuditMeetingActivityType = AuditActivityModuleType;

type AuditTaskActivityType = AuditActivityModuleType;

export type AuditActivityTypeType =
  | AuditNoteActivityType
  | AuditAttachmentActivityType
  | AuditCallLogActivityType
  | AuditMeetingActivityType
  | AuditTaskActivityType;

export type QuotedItemType = QuotedItems | InvoiceItems | SalesOrderItems;

export interface GenericItemsType {
  type: string;
  id: string;
  recordId: string;
  service: string;
  moduleUniqueName: string;
  moduleName: string;
  triggeredBy: string;
  createdBy: string;
  createdAt: string;
  __typename: string;
}

export interface IQuotedItemCreate extends GenericItemsType {
  quotedItemType: QuotedItemType;
}
export interface IQuotedItemUpdate extends GenericItemsType {
  quotedItemType: QuotedItemType;
}
export interface IQuotedItemDelete extends GenericItemsType {
  quotedItemType: QuotedItemType;
}

// Activity type -------------- END

export interface IAuditWorkflowAction {
  type: "workflowAction";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string;
  createdBy: string;
  createdAt: string;
  workflowType:
    | AuditInAppNotificationWorkflowType
    | AuditEmailWorkflowType
    | WebhookWorkflow;
  __typename: string;
}

type AuditInAppNotificationWorkflowType = {
  type: string;
  actionType: string;
  actionName: string;
  actionId: string;
  ruleId: string;
  ruleName: string;
  __typename: "InAppNotificationWorkflow";
};

type AuditEmailWorkflowType = {
  type: string;
  subject: string;
  actionType: string;
  actionName: string;
  actionId: string;
  ruleId: string;
  ruleName: string;
  __typename: "EmailWorkflow";
};

type WebhookWorkflow = {
  type: string;
  ruleId: string;
  ruleName: string;
  __typename: "WebhookWorkflow";
};

export interface IMaskedView {
  type: "maskedView";
  recordId: string;
  id?: string;
  service?: string;
  moduleUniqueName?: string;
  moduleName?: string;
  triggeredBy?: string | null;
  createdBy: string;
  createdAt: string;
  fieldName: string[];
  fieldUniqueName: string[];
  __typename: "MaskedView";
}

// export interface IModuleCreate {
//   type: string;
//   id?: string;
//   service?: string;
//   moduleUniqueName?: string;
//   moduleName?: string;
//   triggeredBy?: string;
//   createdBy: string;
//   createdAt: string;
// }

// export interface IModuleUpdate {
//   type: string;
//   id?: string;
//   service?: string;
//   moduleUniqueName?: string;
//   moduleName?: string;
//   triggeredBy?: string;
//   createdBy: string;
//   createdAt: string;
//   addedFieldUniqueName?: string;
//   updatedFieldUniqueName?: string;
//   updatedFieldOldValue?: string;
//   updatedFieldNewValue?: string;
//   deletedFieldUniqueName?: string;
// }

// export interface IEmailSent {
//   type: string;
//   id?: string;
//   recordId: string;
//   service?: string;
//   moduleUniqueName?: string;
//   moduleName?: string;
//   triggeredBy?: string;
//   createdBy: string;
//   createdAt: string;
//   emailStatus?: string;
//   emailResponse?: string;
// }

// export interface INotificationSent {
//   type: string;
//   id?: string;
//   recordId: string;
//   service?: string;
//   moduleUniqueName?: string;
//   moduleName?: string;
//   triggeredBy?: string;
//   createdBy: string;
//   createdAt: string;
//   message?: string;
//   subject?: string;
// }
