import { ICustomField } from "./ICustomField";

export type BasicLookupType = {
  id: string;
};

export interface BaseEntity extends BasicLookupType {
  [key: string]: any;
  id: string;
  fields?: ICustomField[];
  createdBy?: string;
}
