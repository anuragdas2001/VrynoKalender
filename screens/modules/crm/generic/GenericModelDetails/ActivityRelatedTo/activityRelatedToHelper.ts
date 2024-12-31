import { ICustomField } from "../../../../../../models/ICustomField";
import {
  AddEditViewType,
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { FetchResult } from "@apollo/client";

export const emptyModalValues = {
  visible: false,
  formDetails: {
    type: null,
    parentId: "",
    parentModelName: "",
    aliasName: "",
    id: "",
    modelName: "",
    appName: "",
  },
};

export interface IDeleteModalState {
  item: { modelName: string; id: string };
  visible: boolean;
}

export interface IDeleteActivityItem {
  item: { modelName: string; id: string; alias: string };
  visible: boolean;
}

export interface IGenericFormDetails {
  type: AddEditViewType | null;
  parentId: string;
  parentModelName: string;
  aliasName: string;
  id: string | null;
  modelName: string;
  appName: string;
  activityType?: "open" | "closed";
}

export interface IFormActivityModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

export type SingleActivityContainerProps = {
  appName: SupportedApps;
  recordId: string;
  activity: { name: string; alias: string; icon: React.ReactElement };
  modelName: string;
  relatedName: string;
  activityCount: number;
  setActivityCount: (value: number, activityName: string) => void;
  statusArray: any[];
  activityType: string;
  fieldsList: ICustomField[];
  sideNavigationRefreshed: boolean;
  status: string;
  handleActivityStatusChange: (
    activityData: any,
    currentActivityStatus: string,
    moduleName: string
  ) => void;
  changedStatusRecord: IChangedStatusRecord | null;
  resetActivityStatusChangeData: () => void;
  handleUpdateUserPreferences: () => void;
  userPreferences?: IUserPreference[];
  relatedToField: ICustomField;
  setExecuteActivitySave: React.Dispatch<any>;
  executeActivitySave: any;
};

export interface ISingleActivityContainerItemProps {
  appName: SupportedApps;
  modelName: string;
  recordId: string;
  relatedName: string;
  fieldsList: ICustomField[];
  activity: { name: string; alias: string; icon: React.ReactElement };
  activityType: string;
  activityData: Record<string, any>[];
  activityFetchLoading: boolean;
  handleAddActivityData: (data: any[]) => void;
  handleUpdatedData: (data: any) => void;
  handleServerDeleteData: (variables: {
    id: string;
    modelName: string;
    saveInput: {
      recordStatus: string;
    };
  }) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  addActivityModal: IFormActivityModalObject;
  visibleFields: ICustomField[];
  handleAddActivityModal: (data: IFormActivityModalObject) => void;
  editActivityModal: IFormActivityModalObject;
  handleEditActivityModal: (data: IFormActivityModalObject) => void;
  deleteModal: IDeleteActivityItem;
  handleDeleteModal: (data: IDeleteActivityItem) => void;
  changeDisplayFields: (item: {
    visible: boolean;
    formDetails: {
      appName: string;
      parentModelName: string;
      aliasName: string;
      modelName: string;
      fieldsList: ICustomField[];
    };
  }) => void;
  deleteProcessing: boolean;
  relatedToField: ICustomField;
  userPreferences?: IUserPreference[];
  activityCount: number;
  handleActivityLoadMoreClicked: () => void;
}

export type SingleActivityItemProps = {
  appName: SupportedApps;
  relatedName: string;
  data: any;
  fieldsList: Array<any>;
  onDelete: (id: string) => void;
  onActivityEdit: (id: string) => void;
  activityType: string;
  activityName: string;
  visibleFields: ICustomField[];
};

export interface IActivitiesTable {
  relatedName: string;
  name: "task" | "meeting" | "callLog";
  displayedAs: string;
  icon: JSX.Element;
}

export interface IChangedStatusRecord {
  data: any;
  status: string;
  moduleName: string;
}

export type ActivityContainerProps = {
  id: string;
  appName: SupportedApps;
  modelName: string;
  recordId: string;
  status: string;
  extended?: boolean;
  parentModelName?: string;
  setActivityCount?: (count: number, type: string) => void;
  activitiesTable: IActivitiesTable[];
  fieldsListDict: FieldsListDictType;
  activityStatus: RelatedActivityStatusType[];
  handleActivityStatusChange: (
    activityData: any,
    currentActivityStatus: string,
    moduleName: string
  ) => void;
  changedStatusRecord: IChangedStatusRecord | null;
  userPreferences: IUserPreference[];
  sideNavigationRefreshed: boolean;
  resetActivityStatusChangeData: () => void;
  handleUpdateUserPreferences: () => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  setExecuteActivitySave: React.Dispatch<any>;
  executeActivitySave: any;
};

export type FieldsListDictType = {
  task: ICustomField[];
  meeting: ICustomField[];
  callLog: ICustomField[];
  note: ICustomField[];
  attachment: ICustomField[];
};

export type RelatedActivityStatusType = {
  key: string;
  id: string;
  defaultLabel: string;
};
