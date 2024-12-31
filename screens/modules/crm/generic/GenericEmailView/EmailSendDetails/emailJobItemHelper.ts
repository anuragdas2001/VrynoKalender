import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { SupportedApps } from "../../../../../../models/shared";

export interface IConnectedGenericEmailProps {
  id?: string;
  modelName: string;
  appName: SupportedApps;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
}

export type IEmailItemTabValue =
  | "statistics"
  | "cancelled"
  | "success"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced"
  | "other";

export interface IEmailJobItem {
  id: string;
  name: string;
  jobId: string;
  status: string;
  isOpened: boolean;
  isClicked: boolean;
  sendTo: null | string;
  templateModuleName: string;
  errorMessage: null | string;
  emailRecipientRecordId: string;
}

export interface IEmailJobTopSection {
  selectedEmailItemTab: IEmailItemTabValue;
  onEmailItemTabSelection: (value: IEmailItemTabValue) => void;
  emailJobItemsLoading: boolean;
  itemsCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  emailJobItems: IEmailJobItem[];
}

export interface EmailSendDetailScreenProps extends IEmailJobTopSection {
  emailJob: Record<string, any>;
  template?: { id: string; name: string } | null;
  fieldsList: ICustomField[];
  appName: string;
  modelName: string;
}

export const emailJobFields = [
  "id",
  "sendFrom",
  "replyTo",
  "recordIds",
  "status",
  "errorMessage",
  "totalRecords",
  "emailType",
  "scheduledDatetime",
  "updatedAt",
  "updatedBy",
  "createdAt",
  "createdBy",
  "templateId",
  "stats",
];

export const emailJobItemFields = [
  "id",
  "jobId",
  "templateModuleName",
  "emailRecipientRecordId",
  "recipientEmails",
  "status",
  "errorMessage",
  "isOpened",
  "isClicked",
];

export const cancelledStatus = ["cancelled"];

export const successStatus = ["completed", "success", "open", "click"];

export const sentStatus = ["sent", "open", "click"];

export const deliveredStatus = ["delivered", "open", "click"];

export const errorStatus = ["error", "Failed"];

export const bouncedStatus = ["bounced"];

export const otherStatus = ["Delayed", "processing", "pending"];

export const emailJobItemVariablesGenerator = (
  emailJobId: string,
  selectedTab: IEmailItemTabValue,
  pageNumber: number
) => {
  return {
    modelName: "emailJobItem",
    fields: emailJobItemFields,
    filters: [
      {
        operator: "eq",
        name: "jobId",
        value: emailJobId,
      },
      {
        operator: "in",
        name: "status",
        value:
          selectedTab === "cancelled"
            ? cancelledStatus
            : selectedTab === "success"
            ? successStatus
            : selectedTab === "sent"
            ? sentStatus
            : selectedTab === "delivered"
            ? deliveredStatus
            : selectedTab === "failed"
            ? errorStatus
            : selectedTab === "bounced"
            ? bouncedStatus
            : otherStatus,
      },
    ],
    pageNumber: pageNumber,
  };
};
