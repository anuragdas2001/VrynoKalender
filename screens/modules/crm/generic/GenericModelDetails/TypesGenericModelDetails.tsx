import {
  ApolloCache,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import {
  IGenericConversionFormData,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import {
  GeneralVisibilityProps,
  IFormModalObject,
} from "./IGenericFormDetails";
import { IAttachmentModal } from "./Attachments/attachmentHelper";
import { IFormActivityModalObject } from "./ActivityRelatedTo/activityRelatedToHelper";
import {
  cardContainerOrderType,
  SendEmailModalRecordsType,
} from "./GenericModelDetailsScreen";
import { User } from "../../../../../models/Accounts";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";

export type GenericModelDetailsScreenPresentationalProps = {
  modelData: any;
  modelDetailData: any;
  modelName: string;
  id: string;
  user: User | null;
  appName: SupportedApps;
  launchMenuVisible: GeneralVisibilityProps;
  EditDropdownList: {
    onClick: () => void;
    icon: JSX.Element;
    label: string;
    labelClasses: string;
  }[];
  sideModalClass: string;
  previousRecordId: string | undefined | null;
  nextRecordId: string | undefined | null;
  navActivityModuleLabels: IGenericActivityLabel;
  currentModuleLabel: string;
  deleteModal: GeneralVisibilityProps;
  activeRelatedId: string;
  relatedFilter: string | undefined;
  relatedFilterId: string | undefined;
  fieldsList: ICustomField[];
  currentModule: IModuleMetadata | undefined;
  sendEmailModal: boolean;
  itemsCount?: number;
  moduleData?: any[];
  fetchNewRecordsLoading?: boolean;
  userPreferences: IUserPreference[];
  hasRelatedTo?: boolean;
  sideNavigationRefreshed: boolean;
  exportPdfModal: boolean;
  quickCreateReverseLookupModal: {
    reverseLookupName: string;
    visible: boolean;
  };
  cardContainerOrder: cardContainerOrderType[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  moduleViewPermission: boolean;
  sendMassEmailRecords?: SendEmailModalRecordsType;
  setSendMassEmailRecords?: (
    value: SendEmailModalRecordsType | undefined
  ) => void;
  setCardContainerOrder: (value: cardContainerOrderType[]) => void;
  setQuickCreateReverseLookupModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  chooseFieldModal: { reverseLookupName: string; visible: boolean };
  setChooseFieldModal: (value: {
    reverseLookupName: string;
    visible: boolean;
  }) => void;
  handleIdChange: (id: string) => void;
  setSendEmailModal: (value: boolean) => void;
  setExportPdfModal: (value: boolean) => void;
  setLaunchMenuVisible: (
    value:
      | ((prevState: GeneralVisibilityProps) => GeneralVisibilityProps)
      | GeneralVisibilityProps
  ) => void;
  setSideModalClass: (value: ((prevState: string) => string) | string) => void;
  setModelDetailData: React.Dispatch<any>;
  setDeleteModal: (
    value:
      | ((prevState: GeneralVisibilityProps) => GeneralVisibilityProps)
      | GeneralVisibilityProps
  ) => void;
  serverDeleteData: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      { headers: { vrynopath: SupportedApps } },
      ApolloCache<any>
    >
  ) => Promise<FetchResult<any>>;
  formModal: IFormModalObject;
  sections: SectionDetailsType[];
  setFormModal: (
    value:
      | ((prevState: IFormModalObject) => IFormModalObject)
      | IFormModalObject
  ) => void;
  updateModelData: (value: any) => void;
  handleNewRecordsFetch: (string: "next" | "previous") => void;
  handleUpdateUserPreferences: (value?: boolean) => void;
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  quickCreateNoteModal: boolean;
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddAttachmentUrlModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  setAddAttachmentModalForm: React.Dispatch<
    React.SetStateAction<IAttachmentModal>
  >;
  addAttachmentUrlModalForm: IAttachmentModal;
  addAttachmentModalForm: IAttachmentModal;
  setExecuteActivitySave: React.Dispatch<React.SetStateAction<any>>;
  executeActivitySave: any;
  setAddActivityModal: React.Dispatch<
    React.SetStateAction<IFormActivityModalObject>
  >;
  addActivityModal: IFormActivityModalObject;
  setModelData: React.Dispatch<any>;
  displayConversionModal: IGenericConversionFormData;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
  setRefetchRecordData: (value: boolean) => void;
};

export interface IGenericActivityLabel {
  task: string | null;
  meeting: string | null;
  callLog: string | null;
}
