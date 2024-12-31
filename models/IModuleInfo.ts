import { ICustomField } from "./ICustomField";
import { ReverseLookup } from "./IModuleMetadata";

export interface IModuleInfo {
  customizationAllowed: boolean;
  allowRelatedRelation: boolean;
  dbReverseLookups: [];
  displayFields: string[];
  fieldNameMap: Record<string, string>;
  fields: ICustomField[];
  id: null | string;
  label: { en: string };
  layoutFieldMaps: Record<string, string>;
  layouts: [];
  name: string;
  predefinedReverseLookups: [];
  reverseLookups: ReverseLookup[];
  supportedPermissions: string;
  supportsCustomFields: boolean;
  systemDefined: boolean;
  uniqueName: string;
}
