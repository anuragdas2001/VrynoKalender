import { BaseEntity } from "./BaseEntity";

export interface IFile extends BaseEntity {
  name: string;
  fileUrl: string;
  fileType: string;
  moduleName: string;
  recordId: string;
  assigneeId: string;
  recipient: string;
  createdAt: string;
  statusId: string;
  recordStatus: string;
}
