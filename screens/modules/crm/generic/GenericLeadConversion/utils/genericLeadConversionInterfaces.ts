import { LazyQueryExecFunction } from "@apollo/client";
import { ICustomField } from "../../../../../../models/ICustomField";
import {
  BaseGenericObjectType,
  IUserPreference,
} from "../../../../../../models/shared";
import {
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export interface IPipelineOptions {
  label: string;
  value: string;
  stages: string[];
  isDefault: boolean;
}

export interface IStageOptions {
  label: string;
  value: string;
}

// export interface IConvertLeadData {
//   [key: string]: string | null;
// }

export interface IConvertLeadData {
  id: string | null;
  contactName: string | null;
  fullName: string;
  email: string | null;
  company: string | null;
  phoneNumber: string | null;
  [key: string]: any;
}
export interface IMappedFieldList {
  contact: string[];
  organization: string[];
  deal: string[];
}

export interface ILeadContactOrganization {
  id: null | string[];
  selectedId: null | string;
  available: boolean;
  createNew: boolean;
  checked: boolean;
  data: BaseGenericObjectType[];
  showTable: boolean;
  processed: boolean;
  itemsCount: number;
  currentPageNumber: number;
  selectedItem: BaseGenericObjectType[];
}

export const leadContactOrganizationInitialData: ILeadContactOrganization = {
  id: null,
  selectedId: null,
  available: false,
  createNew: false,
  checked: false,
  data: [],
  showTable: false,
  processed: false,
  itemsCount: 0,
  currentPageNumber: 0,
  selectedItem: [],
};

export interface ILeadDeal {
  checked: boolean;
}

export interface ILeadConversionMappingData {
  id: string;
  destinationContactFieldUniqueName: string | null;
  destinationOrganizationFieldUniqueName: string | null;
  destinationDealFieldUniqueName: string | null;
  sourceLeadFieldUniqueName: string;
}

export interface IConnectedLeadConversion {
  convertLeadData: IConvertLeadData;
  navContactName: string;
  navOrganizationName: string;
  navDealName: string;
  navLeadName: string;
  companyAvailable: boolean | null;
  mappedFieldsList: IMappedFieldList;
  setConversionProcessing: (value: boolean) => void;
  appName: string;
  modelName: string;
  id: string;
  masterMappedFieldsList: Record<string, string>;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  userPreferences: IUserPreference[];
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
}

export interface IRelatedLeadModuleVariables {
  variables: {
    modelName: string;
    fields: string[];
    filters: {
      name: string;
      operator: string;
      value: string[];
    }[];
    expression?: string;
  };
}

export interface IExtractedValues {
  [key: string]: any;
  fields?: {
    [key: string]: any;
  };
}

export interface IMutationGeneratorResultData {
  id?: string;
  ownerId: string;
  layoutId: string | null;
  [key: string]: any; // for properties added by moduleValueExtractor
}

export interface IMutationGeneratorResult {
  contact?: IMutationGeneratorResultData;
  organization?: IMutationGeneratorResultData;
  deal?: IMutationGeneratorResultData;
}

export interface ILeadConversionContentContainer {
  navContactName: string;
  navOrganizationName: string;
  navDealName: string;
  navLeadName: string;
  setConversionProcessing: (value: boolean) => void;
  appName: string;
  modelName: string;
  id: string;
  companyAvailable: boolean | null;
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  convertLeadData: IConvertLeadData;
  setLeadContactOrganizationState: (value: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  }) => void;
  contactVariable: IRelatedLeadModuleVariables | null;
  organizationVariable: IRelatedLeadModuleVariables | null;
  resetValues: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  dealFieldList: ICustomField[];
  contactFieldList: ICustomField[];
  organizationFieldList: ICustomField[];
  stagesLookupOptions: Record<string, string>[];
  setDealFieldList: (value: ICustomField[]) => void;
  tableFieldsList: {
    contact: ICustomField[];
    organization: ICustomField[];
  };
  layoutIds: {
    contact: string | null;
    organization: string | null;
    deal: string | null;
  };
  userPreferences: IUserPreference[];
  fetchContactData: LazyQueryExecFunction<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >;
  fetchOrganizationData: LazyQueryExecFunction<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >;
  setResponseData: (value: { name: string; data: {} }) => void;
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
}

export interface IConnectedLeadConversionContent {
  fetchLayoutLoading: boolean;
  convertLeadData: IConvertLeadData;
  tableFieldsList: {
    contact: ICustomField[];
    organization: ICustomField[];
  };
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  setLeadContactOrganizationState: (value: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  }) => void;
  leadFieldsList: ICustomField[];
  contactFieldList: ICustomField[];
  organizationFieldList: ICustomField[];
  dealFieldList: ICustomField[];
  mappedFieldsList: IMappedFieldList;
  masterMappedFieldsList: Record<string, string>;
  setContactFieldList: (value: ICustomField[]) => void;
  setOrganizationFieldList: (value: ICustomField[]) => void;
  setDealFieldList: (value: ICustomField[]) => void;
  companyAvailable: boolean | null;
  navContactName: string;
  navOrganizationName: string;
  navDealName: string;
  navLeadName: string;
  userPreferences: IUserPreference[];
  setConversionProcessing: (value: boolean) => void;
  appName: string;
  modelName: string;
  id: string;
  stagesLookupOptions: Record<string, string>[];
  layoutIds: {
    contact: string | null;
    organization: string | null;
    deal: string | null;
  };
  setResponseData: (value: { name: string; data: {} }) => void;
  resetValues: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  removeModuleDataById: (moduleDataById: any, moduleName: string) => void;
}
