import { BaseEntity } from "./BaseEntity";

export type SupportedLangCodes = "en" | "fr";
export type FieldLabelType = {
  [key in SupportedLangCodes]: string;
};

export interface ICustomFieldValidation {
  minVal?: string;
  maxVal?: string;
  regExp?: RegExp;
}

export type FieldSupportedDataType = keyof typeof SupportedDataTypes;

export interface ICustomField extends BaseEntity {
  recordLookupAttributes: string[];
  systemDefined: boolean;
  recordLookupAdditionalFilter: { type: string; [key: string]: string };
  instanceId: string;
  moduleName: string;
  uniqueName: string;
  label: FieldLabelType;
  name: string;
  dataType: FieldSupportedDataType;
  mandatory: boolean;
  visible: boolean;
  validations: ICustomFieldValidation;
  lookupValues: Record<string, string>;
  recordLookupModules: string[];
  system: string;
  recordStatus: string;
  order: number;
  readOnly: boolean;
  expression: string;
  checkDuplicate?: boolean;
  showInQuickCreate?: boolean;
  isMasked?: boolean;
  maskedPattern?: string;
  addInForm: boolean;
  parentFieldsList?: ICustomField[];
  [key: string]: any;
}

export enum SupportedDataTypes {
  uuid = "uuid",
  uuidArray = "uuidArray",
  stringArray = "stringArray",
  numberArray = "numberArray",
  url = "url",
  time = "time",
  image = "image",
  recordImage = "recordImage",
  number = "number",
  autoNumber = "autoNumber",
  date = "date",
  boolean = "boolean",
  richText = "richText",
  lookup = "lookup",
  relatedTo = "relatedTo",
  email = "email",
  phoneNumber = "phoneNumber",
  multiline = "multiline",
  recordLookup = "recordLookup",
  json = "json",
  jsonArray = "jsonArray",
  singleline = "singleline",
  datetime = "datetime",
  stringLookup = "stringLookup",
  multiSelectLookup = "multiSelectLookup",
  multiSelectRecordLookup = "multiSelectRecordLookup",
  expression = "expression",
  jsonDateTime = "jsonDateTime",
}
