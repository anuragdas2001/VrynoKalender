import { Content } from "@tiptap/react";
import { BaseEntity } from "./BaseEntity";

export interface ITask extends BaseEntity {
  name: string;
  description: string;
  dueDate: Date | string | null;
  observerId: string;
  followUpTaskId: string;
  priorityId: string;
  taskTypeId: string;
  statusId: string;
  recordId: string;
  text?: Content;
  reminder: Date | string | null;
  moduleName: string;
  assigneeId: string;
  createdAt: string;
  recordStatus: string;
}

export interface IMeeting extends ITask {
  attendeesId: string;
  meetingTypeId: string;
}
