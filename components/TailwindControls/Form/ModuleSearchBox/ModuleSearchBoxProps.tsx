import React, { LegacyRef } from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { AddEditViewType } from "../../../../models/shared";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../models/ICustomField";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { INavigation } from "../../../../models/INavigation";
import { FormikValues } from "formik";

export type ModuleSearchBoxProps<T extends BasicLookupType> = {
  name: string;
  appName: string;
  modelName: string;
  searchBy: Array<string>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  allowMargin?: boolean;
  autoFocus?: boolean;
  labelLocation?: SupportedLabelLocations;
  modulesOption: { value: string; label: string; visible?: boolean }[];
  editMode?: boolean;
  hiddenDropdownLookup: string;
  hiddenSearchLookup: string;
  lookupRef: React.RefObject<HTMLDivElement>;
  searchRef: LegacyRef<HTMLInputElement> | undefined;
  inputWidth: number;
  inputHeight: number;
  searchProcessing: boolean;
  isPanelBelowVisible: boolean;
  showModelNameInSearch?: boolean;
  searchResults: any[];
  demoSearchResults: any[];
  disableModuleSelector?: boolean;
  disableSearchSelector?: boolean;
  formResetted?: boolean;
  showViewAllScreen?: boolean;
  formClosed: boolean;
  addUserModel?: boolean;
  searchedValue?: string;
  useModuleExpression?: boolean;
  setFormClosed: (value: boolean) => void;
  setFormResetted?: (value: boolean) => void;
  setSearchProcessing: (value: boolean) => void;
  setPanelBelowVisible: (value: boolean) => void;
  onBlur?: () => void;
  onDropdownChange?: (e: React.ChangeEvent<any>, searchedValue: string) => void;
  onSearchChange?: (e: React.ChangeEvent<any>) => void;
  handleSearchChange: (searchedValue: string, moduleSelected: string) => void;
  setSearchResults: (value: any[]) => void;
  setDemoSearchResults: (value: any[]) => void;
  handleSelectedItem: (item: ISearchQuestData) => void;
  setSelectedModule: (value: string) => void;
  setSearchedValue: (value: string) => void;
  closeSearchModal: (value: boolean) => void;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  filterSearchResults: any[] | null;
  setAppliedFilterModelName: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  appliedFilterModelName: string | null;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  setSearchFilterProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  searchFilterProcessing: boolean;
  allowFilters: boolean;
  generateLink?: boolean;
  organizationName: string | null;
};

export interface IModuleSearchDataResultContainerPerFetchContent {
  appName?: string;
  fieldsListFetchLoading: boolean;
  modulesFetchLoading: boolean;
  smallResolution: boolean | undefined;
  searchResultCount: number | undefined;
  searchResults: ISearchQuestData[];
  currentPageNumber: number | undefined;
  onPageChange: (pageNumber: number) => void;
  showMoreData: boolean;
  searchedValue: string;
  currentSelectedSearch: ISearchQuestData | undefined;
  handleSelectedItem: (value: ISearchQuestData) => void;
  setPanelBelowVisible: (value: boolean) => void;
  highlightedResultInFlexCol: boolean;
  useModuleExpression: boolean;
  updatedSearchBy:
    | {
        [modelName: string]: string[];
      }
    | undefined;
  searchBy: string[];
  fieldsListPerModule:
    | {
        [modelName: string]: ICustomField[];
      }
    | undefined;
  setFieldsList: (modelName: string, fields: ICustomField[]) => void;
  viewAllFields: boolean;
  showSearchFilter: boolean;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  setAppliedFilterModelName: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  setSearchFilterProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  searchFilterProcessing: boolean;
  allowFilters: boolean;
  closeSearchModal?: (value: boolean) => void;
  formikValues?: FormikValues;
  generateLink?: boolean;
}

export type ModuleSearchDataResultContainerPerFetchProps = {
  appName: string;
  showModelNameInSearch: boolean;
  modelName?: string;
  modelNameList: { modelName: string; order: number }[];
  updatedNavigations: INavigation[];
  searchResults: ISearchQuestData[];
  searchBy: Array<string>;
  searchByUniqueName?: boolean;
  searchedValue: string;
  highlightedResultInFlexCol?: boolean;
  smallResolution?: boolean;
  showMoreData?: boolean;
  currentSelectedSearch?: ISearchQuestData;
  useModuleExpression?: boolean;
  searchResultCount?: number;
  currentPageNumber?: number;
  onPageChange?: (pageNumber: number) => void;
  handleItemsFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  handleSelectedItem: (value: ISearchQuestData) => void;
  setPanelBelowVisible: (value: boolean) => void;
  setFieldsList?: (modelName: string, fields: ICustomField[]) => void;
  viewAllFields: boolean;
  showSearchFilter: boolean;
  setFilterSearchResults: React.Dispatch<React.SetStateAction<any[] | null>>;
  setAppliedFilterModelName: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  setSearchFilterProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  searchFilterProcessing: boolean;
  allowFilters: boolean;
  closeSearchModal?: (value: boolean) => void;
  formikValues: FormikValues;
  generateLink?: boolean;
};

export type BasicLookupType = {
  id: string;
};
export type SearchByOption = {
  label: string;
  value: string;
  icon: React.ReactElement;
};
export interface IGenericFormDetails {
  type: AddEditViewType | null;
  id: string | null;
  modelName: string;
  appName: string;
  quickCreate: boolean;
  aliasName?: string;
}
export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

const customFieldDefaults = {
  recordLookupAttributes: [],
  systemDefined: true,
  recordLookupAdditionalFilter: { type: "" },
  instanceId: "",
  moduleName: "",
  uniqueName: "",
  label: { en: "", fr: "" },
  name: "",
  dataType: SupportedDataTypes.singleline,
  mandatory: true,
  visible: true,
  validations: {},
  lookupValues: {},
  recordLookupModules: [],
  system: "",
  recordStatus: "",
  order: 0,
  readOnly: false,
  addInForm: true,
  expression: "",
};

export const userFieldsList = [
  {
    ...customFieldDefaults,
    id: "1",
    order: 1,
    name: "first_name",
    label: { en: "First Name", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "2",
    order: 2,
    name: "middle_name",
    label: { en: "Middle Name", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "3",
    order: 3,
    name: "last_name",
    label: { en: "Last Name", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "6",
    order: 6,
    name: "email",
    label: { en: "Email", fr: "" },
    dataType: SupportedDataTypes.singleline,
    systemDefined: true,
    visible: true,
  },
  {
    ...customFieldDefaults,
    id: "6",
    label: { en: "Phone Number", fr: "" },
    mandatory: false,
    name: "phone_number",
    order: 6,
    systemDefined: true,
    visible: true,
    dataType: SupportedDataTypes.phoneNumber,
  },
  {
    ...customFieldDefaults,
    id: "6",
    order: 6,
    name: "created_at",
    mandatory: false,
    label: { en: "Created At", fr: "" },
    dataType: SupportedDataTypes.datetime,
    systemDefined: true,
    visible: true,
  },
];
