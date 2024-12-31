import { ICustomField } from "../../../../../../models/ICustomField";
import { IUserPreference } from "../../../../../../models/shared";

export type ConnectedEmailProps = {
  id: string;
  appName: string;
  containerName?: string;
  modelName: string;
  fieldsList: ICustomField[];
  modelData: any;
  handleEmailCount: (value: number) => void;
  imapEmailModal: (record: EmailPreview) => void;
  userPreferences: IUserPreference[];
};

export type EmailPreview = {
  id: string;
  subject: string;
  sendFrom: string;
  references: string[];
  date: string;
  messageId: string;
  [key: string]: string | string[] | number | BodyType | boolean;
};

export interface BodyType {
  subject: { value: string; initial: string }[];
  from: { value: { address: string; name: string }[]; initial: string }[];
  to: { value: { address: string; name: string }[]; initial: string }[];
  date: { value: string; initial: string }[];
  content: any;
}

export type EmailFullView = {
  id: string;
  subject: string;
  sendFrom: string;
  body: BodyType;
  messageId: string;
  inReplyTo: string;
  references: string[];
  date: string;
  [key: string]: string | string[] | number | BodyType | boolean;
};
