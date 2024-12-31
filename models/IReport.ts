import { BaseEntity } from "./BaseEntity";

export interface IReport extends BaseEntity {
  name: string;
  fileKey: string;
}
