import { JSONContent } from "@tiptap/react";
import { BaseEntity, BasicLookupType } from "./BaseEntity";
import { ICommon } from "./ICommon";
import { ICustomField } from "./ICustomField";

export type BaseGenericObjectType = { [key: string]: any };

export interface RelatedTo {
  moduleName?: string | undefined;
  recordId?: string | undefined;
}
export interface ISetupServiceResponse {
  permissionKey: string;
  roleKey: string;
  instanceId: string;
}
export interface ICompany extends ICommon {
  jobTitle: string;
  name: string;
  countryIdCode: string;
  taxNumber: string;
  website: string;
  contactPerson: string;
}
export interface IBulkImport extends BaseEntity {
  fileId?: string;
  status: string;
  moduleName: string;
  createdAt: string;
  dataRow: object;
  id: string;
}
export interface ITableHeaders extends BaseEntity {
  key: string;
  label: string;
  render?: (s: any) => void;
}
export interface IOperation extends BaseEntity {
  name: string;
  labelKey: string;
}
export interface IRole extends BaseEntity {
  role: string;
  key: string;
  instanceId: string;
}
export interface IInstanceUser extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  company: string;
  roleId: string;
  imageId: string;
}
export interface IEmailTemplate extends BaseEntity {
  id: string;
  name: string;
  subject: string;
  templateServiceName: string;
  templateModuleName: string;
  fileKey: string;
}

export interface IGeneratedFile extends BaseEntity {
  id: string;
  fileKey: string;
  fileName: string;
  fileFormat: string;
  templateId: string;
  recordId: string;
}

export interface IWorkflowRule extends BaseEntity {
  name: string;
  recordModuleName: string;
  recordServiceName: string;
  typeConfig: Record<any, any>;
  typeKey: string;
  description: string;
  recordStatus: string;
  executeDateNumber: number;
  executeDate: string;
  executetime: string;
  executorField: string;
  reoccur: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IWorkflowCondition extends BaseEntity {
  recordModuleName: string;
  recordServiceName: string;
  typeConfig: Record<string, string>[];
  typeKey: string;
  ruleId: string;
  recordStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IWorkflowAction extends BaseEntity {
  name: string;
  recordModuleName: string;
  recordServiceName: string;
  typeConfig: Record<string, string>[];
  typeKey: string;
  ruleId: string;
  conditionId: string;
  executorConfig: Record<string, any>;
  executorTypeKey: string;
  recordStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
export interface IWorkflowRuleAction extends BaseEntity {
  ruleId: string;
  conditionId: string;
  actionIds: string;
  executorTypeKey: string;
  typeKey: string;
}
export interface IEmailSetting extends BaseEntity {
  id: string;
  provider: string;
  apiKey: string;
  sendFrom: string;
  replyTo: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface IProductTax extends BaseEntity {
  name: string;
  label: Record<string, string>;
  order: number;
}

export interface ICustomViewFilter {
  by: string;
  value: string;
}
export interface IDealPipelineStage extends BaseEntity {
  name: string;
  stages: string[];
}
export interface IUserPreference extends BaseEntity {
  serviceName: string;
  defaultPreferences: any;
}
export interface ICurrentLocation {
  latitude: number;
  longitude: number;
}

export type GenericQueryResponse<T> = {
  status: boolean;
  code: number;
  message: string;
  messageKey: string;
  data: T[];
  count: number;
};
export type GenericMutationResponse<T> = {
  status: boolean;
  code: number;
  message: string;
  messageKey: string;
  data: T;
};
export interface IRecycleBin {
  card: object;
  item: object;
}
export interface IEntity {
  value: string;
  label: string;
}

export interface ICustomView extends BaseEntity {
  name: string;
  filters: any;
  moduleFields: string[];
  moduleName: string;
  isDefault: boolean;
  orderBy?: any;
  recordStatus: string;
  sharedUsers?: string[];
  createdBy?: string;
}
export interface ICustomModuleData extends BaseEntity {
  name: string;
  fields: any;
}
export interface ILookup extends BaseEntity {
  defaultLabel: string;
  key: string;
  recordStatus: string;
}
export interface IBasicLookup {
  label: string;
  value: string;
}
export interface IBaseModuleRecord extends BaseEntity {
  name: string;
  ownerId: string;
}
interface IGeneral {
  [key: string]: any;
}

export type IGeneralSave = IGeneral & {
  fields?: any;
} & BaseEntity;
export interface ILookupMapperInput extends BasicLookupType {
  name?: string;
  defaultLabel?: string;
  labelKey?: string;
  id: string;
}
export enum SupportedDashboardViews {
  List = "List",
  Card = "Card",
  Kanban = "Kanban",
}
export type SupportedDashboardViewsType = keyof typeof SupportedDashboardViews;
export enum AddEditView {
  Add = "Add",
  Edit = "Edit",
  Conversion = "Conversion",
}
export type AddEditViewType = keyof typeof AddEditView;
export enum DetailViewView {
  Detail = "Detail",
  View = "View",
  EmailView = "EmailView",
  EmailDetail = "EmailDetail",
  CustomView = "CustomView",
  Dashboard = "Dashboard",
  CustomViewEdit = "CustomViewEdit",
  AddDashboard = "add-dashboard",
  EditDashboard = "edit-dashboard",
  ViewDashboard = "view-dashboards",
  ViewWidgets = "view-widgets",
  BulkImport = "bulkimport",
  MassUpdate = "massupdate",
  CONVERTED = "converted",
  EmailTemplate = "email-template",
  ModuleTemplate = "module-template",
}
export type DetailsViewTypes = keyof typeof DetailViewView;
export const SupportedView = { ...DetailViewView, ...AddEditView };
export type SupportedViewType = Lowercase<keyof typeof SupportedView>;
export enum SupportedApps {
  crm = "crm",
  accounts = "accounts",
  workflow = "workflow",
  notify = "notify",
}
export interface IEmailTemplate {
  name: string;
  modelName: string;
  subject: string;
  body: JSONContent[];
}
export interface ICriteriaActionRow {
  schedule: boolean;
  kind: string;
  id: string;
  scheduleConfig: {
    scheduleTime: number;
    period: string;
    [key: string]: string | number;
  };
  config: {};
  [key: string]: any;
}
export interface IWorkflowRule extends BaseEntity {
  executeConfig: ICriteriaRow[];
  moduleName: string;
}
export interface ICriteriaFilterRow {
  [key: string]: any[] | any;
}
export interface ICriteriaRow {
  name: string;
  criteria: {
    id: string;
    filters: ICriteriaFilterRow[];
    matching: string;
    criteriaPattern: string;
  };
  id: string;
  actions: ICriteriaActionRow[];
}
export interface IRichText {
  content: {
    marks: { type: string }[];
    text: string;
  }[];
  type: string;
  attrs: {
    src: string;
  };
}
export type Modify<T, R> = Omit<T, keyof R> & R;

export interface ILeadDropdownListType {
  value: string;
  label: string;
  dataType: string;
  uniqueName: string;
  dataTypeMetadata: any;
}

export type ISearchedResult = {
  modelName: string;
  moduleUniqueName: string;
  rowId?: string;
  values?: Record<string, string | boolean | number | object | undefined>;
};

export interface IKanbanViewData {
  id: string;
  name: string;
  categorizeBy: string;
  aggregateBy: string;
  availableFields: string[];
  relatedModule: string;
  currencyType: null | string;
}

export interface ICustomViewData {
  config: any | null;
  filters: any[];
  id: string;
  isShared: boolean;
  moduleFields: string[];
  moduleName: string;
  name: string;
  orderBy: any[];
  recordsPerPage: number;
  expression: string;
}

export interface ISubFormItemDataType {
  modelName: string;
  label: string;
  systemDefined: boolean;
  fieldName: string;
  displayExpression: string[];
}
export interface ISubFormDataDict {
  fieldsList: ICustomField[];
  visibleFieldsList: ICustomField[];
  fieldsMetaData: ISubFormItemDataType;
  data: any[];
  fieldNameToSearchWith: string;
}

export interface ISharingRuleData {
  sharedUsers: string[];
  sharedType: "onlyMe" | "everyone" | "selectedUsers";
}

export interface IGenericConversionFormData {
  data: null | {
    convertToModuleLabel: string;
    id: string;
    modelName: string;
  };
  visible: boolean;
}
