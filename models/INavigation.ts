import { BaseEntity } from "./BaseEntity";

export interface INavigation extends BaseEntity {
  name: string;
  label: any;
  visible: boolean;
  navType: string;
  groupKey: string;
  key: string;
  systemDefined: Boolean;
  parentNavigation: string | null;
  navTypeMetadata: any;
  order: number;
  uniqueName: string;
}
