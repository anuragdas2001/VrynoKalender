import { ICustomField } from "./ICustomField";
import { BaseEntity } from "./BaseEntity";

export interface ILayout extends BaseEntity {
  name: string;
  type: string;
  moduleName: string;
  recordStatus: string;
  layout: ICustomField[];
  config: {
    fields: ICustomField[];
  };
}
