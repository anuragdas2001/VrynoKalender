import { BaseEntity } from "./BaseEntity";
import { Content } from "@tiptap/react";
import { RelatedTo } from "./shared";

export interface INote extends BaseEntity {
  note: Content;
  attachment: string;
  relatedTo: RelatedTo[];
  // assigneeId: string;
  createdAt: string;
  createdBy: string;
  statusId: string;
  recordStatus: string;
}
