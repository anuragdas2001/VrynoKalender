import { ReadonlyURLSearchParams } from "next/navigation";
import { ICustomField } from "../../../../../../models/ICustomField";
import { ILayout } from "../../../../../../models/ILayout";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { INavigation } from "../../../../../../models/INavigation";
import {
  ISubFormDataDict,
  ISubFormItemDataType,
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { FormikErrors, FormikState, FormikValues } from "formik";
import {
  ApolloCache,
  FetchResult,
  LazyQueryHookExecOptions,
  MutationFunctionOptions,
  OperationVariables,
  QueryResult,
} from "@apollo/client";
import { NextRouter } from "next/router";
import { User } from "../../../../../../models/Accounts";
import { TFunction } from "i18next";

export type SubformDataType = {
  [moduleName: string]: {
    layout?: ILayout;
    moduleMetadata?: IModuleMetadata;
    fieldsList?: ICustomField[];
    summarySection?: {
      aggregation_method: string;
      expression: string;
      fieldsUsed: [string];
      displayAs: { en: string };
      module_name: string;
      name: string;
      value: string | number | null | undefined;
      format: {
        type: string;
        precision: number;
        ratio: string;
      };
    }[];
  };
};

export type GenericAddEditProps = {
  id?: string;
  appName: SupportedApps;
  modelName: string;
  currentModule?: IModuleMetadata;
  currentUser: User | null;
  quoteSubForm: string;
  quoteDependingModule: string;
  navigations: INavigation[];
  currentLayout: ILayout | undefined;
  subFormClear: boolean;
  subFormDict: Record<string, ISubFormItemDataType>;
  subFormDataDict: ISubFormDataDict[];
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  fieldsList: ICustomField[];
  userPreferences: IUserPreference[];
  searchParams: ReadonlyURLSearchParams;
  setSubFormDataDict: (value: ISubFormDataDict[]) => void;
  importUserPreferences: (userPreferences: IUserPreference[]) => void;
  addModuleData: (moduleData: any, moduleName: string) => void;
  setSubFormClear: (value: boolean) => void;
  setBackgroundProcessRunning?: (value: boolean) => void;
};

export type SubFormDetailSaveType = {
  modelName: string;
  fieldsList: ICustomField[];
  totalSubForms: number;
  summarySections?: {
    aggregation_method: string;
    expression: string;
    fieldsUsed: [string];
    displayAs: { en: string };
    name: string;
    module_name: string;
    value: string | number | null | undefined;
  }[];
  values: FormikValues;
};

export type GenericFormSaveResponseProps = {
  t: TFunction<["common"], undefined, ["common"]>;
  type: "add" | "edit";
  appName: string;
  modelName: string;
  responseOnCompletion: FetchResult<any>;
  subFormDetails?: SubFormDetailSaveType;
  navigations: INavigation[];
  router: NextRouter;
  triggerSaveNext: boolean;
  subFormDataForId?: any[];
  setIdData: React.Dispatch<any>;
  setSubFormDataForId: React.Dispatch<React.SetStateAction<any[]>>;
  addModuleData: (moduleData: any, moduleName: string) => void;
  saveSubForm: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          {
            headers: {
              vrynopath: SupportedApps;
            };
          },
          ApolloCache<any>
        >
      | undefined
  ) => Promise<any>;
  setSubFormClear: (value: boolean) => void;
  setSavingProcess: (value: boolean) => void;
  setSaveNext: (value: boolean) => void;
};

export type handleFetchQuoteSubformFieldsProps = {
  id: string;
  appName: string;
  quoteSubForm: string;
  allLayoutFetched: boolean;
  savingProcess: boolean;
  genericModels: IGenericModel;
  getSubFormDataForId: (
    options?:
      | Partial<LazyQueryHookExecOptions<any, OperationVariables>>
      | undefined
  ) => Promise<QueryResult<any, OperationVariables>>;
  subFormField: string;
  setSubFormDataIdLoading: (value: React.SetStateAction<boolean>) => void;
  setBackgroundProcessRunning: (value: boolean) => void;
};

export type GenericFormProps = {
  appName?: string;
  modelName?: string;
  quoteSubForm: string;
  quoteDependingModule: string;
  subFormDataForId?: any[];
  data: Record<string, any>;
  currentUser: User | null;
  handleSave: (
    T: FormikValues,
    triggerSaveNext: boolean,
    subFormDetails?: {
      modelName: string;
      fieldsList: ICustomField[];
      summarySections?: {
        aggregation_method: string;
        expression: string;
        fieldsUsed: [string];
        displayAs: { en: string };
        name: string;
        module_name: string;
        value: string | number | null | undefined;
      }[];
      totalSubForms: number;
      values: FormikValues;
    }
  ) => void;
  saveNext?: boolean;
  onSelectSaveNext: () => void;
  onHandleSaveNext: () => void;
  saveLoading: boolean;
  editMode?: boolean;
  fieldList: Array<ICustomField>;
  formDetails: { type: string; modelName: string; appName: string };
  onCancel: () => void;
  currentModule?: IModuleMetadata;
  retainValueFields?: string[];
  cloneId?: string;
  setSubFormDataForId?: (value: any[]) => void;
  setIdData?: (value: any) => void;
  currentLayout: ILayout | undefined;
  subFormDict: Record<string, ISubFormItemDataType>;
  subFormDataDict: ISubFormDataDict[];
  setSubFormDataDict: (value: ISubFormDataDict[]) => void;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
  setSavingProcess: (value: boolean) => void;
  id: string | undefined;
  subFormClear: boolean;
  setSubFormClear: (value: boolean) => void;
  setCloneId?: (value: string) => void;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  userPreferences: IUserPreference[];
  importUserPreferences: (userPreferences: IUserPreference[]) => void;
};

export type handleFormSubmitHandlerProps = {
  user: User | null;
  appName?: string;
  modelName?: string;
  cloneId?: string;
  currentLayout?: ILayout;
  quoteSubForm: string;
  values: FormikValues;
  fieldList: ICustomField[];
  subFormData?: SubformDataType;
  updatePipeline: boolean;
  handleSave: (
    T: FormikValues,
    triggerSaveNext: boolean,
    subFormDetails?: {
      modelName: string;
      fieldsList: ICustomField[];
      summarySections?: {
        aggregation_method: string;
        expression: string;
        fieldsUsed: [string];
        displayAs: {
          en: string;
        };
        name: string;
        module_name: string;
        value: string | number | null | undefined;
      }[];
      totalSubForms: number;
      values: FormikValues;
    }
  ) => void;
  setFormResetted: (value: boolean) => void;
  setCloneId: (value: string) => void;
  onSelectSaveNext: () => void;
  setTotalSubForms: (value: number) => void;
  setSubFormDataForId: ((value: any[]) => void) | undefined;
  setSubFormClear: (value: boolean) => void;
  setUpdatePipeline: (value: boolean) => void;
  setIdData: ((value: any) => void) | undefined;
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
  saveData: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          {
            headers: {
              vrynopath: string | undefined;
            };
          },
          ApolloCache<any>
        >
      | undefined
  ) => Promise<any>;
  triggerSaveNext: boolean;
  totalSubForms: number;
  subFormDict: Record<string, ISubFormItemDataType>;
  setSavingProcess: (value: boolean) => void;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
};

export type GenericFormFieldsProps = {
  appName?: string;
  modelName?: string;
  saveLoading: boolean;
  saveNext?: boolean;
  editMode: boolean;
  data: any;
  fieldList: Array<ICustomField>;
  formDetails: { type: string; modelName: string; appName: string };
  customFieldsData?: Record<string, Record<string, string>>;
  isSample: boolean;
  currentModule?: IModuleMetadata;
  formResetted?: boolean;
  updatePipeline: boolean;
  userPreferences: IUserPreference[];
  editData: Record<string, string | Record<string, Record<string, string>>>;
  formCustomization?: boolean;
  currentUser: User | null;
  subFormData?: SubformDataType;
  subFormDataForId?: any[];
  totalSubForms?: number;
  dependingModuleFields?: ICustomField[];
  retainValueFields?: string[];
  countryCodeInUserPreference: string;
  setTotalSubForms?: (value: number) => void;
  setFormCustomization?: (value: boolean) => void;
  handleSave: () => void;
  handleSaveNext: () => void;
  onCancel: () => void;
  subFormDataDict: ISubFormDataDict[];
  subFormRefs: any;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
  setSubFormDataDict: (value: ISubFormDataDict[]) => void;
  id: string | undefined;
  subFormClear: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  importUserPreferences: (userPreferences: IUserPreference[]) => void;
  setSubFormValidationErrors: (value: Record<string, boolean>) => void;
  subFormValidationErrors: Record<string, boolean>;
};

export type SubFormOperationHandlerProps = {
  num: number;
  subFormData?: SubformDataType;
  values: FormikValues;
  setTotalSubForms: (value: number) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<FormikValues>>;
  totalSubForms?: number;
};

export type GenericFormFieldsHeaderChildrenProps = {
  modelName?: string;
  currentUser: User | null;
  formCustomization?: boolean;
  saveLoading: boolean;
  saveNext?: boolean;
  editMode: boolean;
  saveFormCustomization: boolean;
  loadingCustomizationForm: boolean;
  saveCustomizationFormError: boolean;
  subFormValidationErrors: Record<string, boolean>;
  formDetails: {
    type: string;
    modelName: string;
    appName: string;
  };
  onCancel: () => void;
  handleSave: () => void;
  handleSaveNext: () => void;
  setAddNewSection: (value: boolean) => void;
  setFormCustomization: (value: boolean) => void;
  handleCustomFieldsSave: () => void;
  setSaveFormCustomization: (value: boolean) => void;
};

export type SpecialSubFormWrapperProps = {
  genericModels: IGenericModel;
  modelName?: string;
  editMode: boolean;
  data: any;
  currentModule?: IModuleMetadata;
  isSample: boolean;
  currentFormLayer: boolean;
  countryCodeInUserPreference: string;
  subFormData: SubformDataType | undefined;
  totalSubForms?: number;
  formCustomization?: boolean;
  formResetted?: boolean;
  subFormDataForId: any[] | undefined;
  values: FormikValues;
  dependingModuleFields: ICustomField[] | undefined;
  formDetails: {
    type: string;
    modelName: string;
    appName: string;
  };
  resetComponentLoadIndex: boolean;
  setResetComponentLoadIndex: (value: boolean) => void;
  setCurrentFormLayer: (value: boolean) => void;
  setTotalSubForms: (value: number) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<FormikValues>>;
};

export type SectionDetailsType = {
  sectionOrder: number;
  sectionName: string;
  sectionLabel: string;
  sectionFields: ICustomField[];
  sectionFieldsWithOrder: {
    fieldName: string;
    order: number;
    dataType: string;
    visible: boolean;
    addInForm: boolean;
    readOnly: boolean;
  }[];
  columnLayout: string;
  systemDefined: boolean;
};
