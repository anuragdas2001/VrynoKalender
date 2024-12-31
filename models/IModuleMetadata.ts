import { BaseEntity } from "./BaseEntity";
import { ICustomField } from "./ICustomField";
import { ILayout } from "./ILayout";

export interface ReverseLookup extends BaseEntity {
  name: string;
  moduleName: string;
  moduleUniqueName: string;
  fieldName: string;
  displayedAs: Record<string, string>;
}

export interface IModuleMetadata extends BaseEntity {
  id: string;
  name: string;
  labelKey: string;
  descriptionKey: string;
  isBlanketModule: boolean;
  systemDefined: boolean;
  parentModule: string;
  customizationAllowed: boolean;
  reverseLookups: ReverseLookup[];
  allowRelatedRelation: boolean;
  dbReverseLookups: any[];
  displayFields: string[];
  fieldNameMap: any;
  fields: ICustomField[];
  label: { en: string };
  layoutFieldMaps: {};
  layouts: ILayout[];
  moduleOverride: {} | null;
  operationPermissionKeys: {} | null;
  predefinedReverseLookups: any[];
  supportedPermissions: string[];
  supportsCustomFields: boolean;
  uniqueFieldNameMap: any;
  uniqueName: string;
}
