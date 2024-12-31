import { IInstance, IUser, User } from "../../../../../models/Accounts";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import {
  AddEditViewType,
  ICustomView,
  IGenericConversionFormData,
  IKanbanViewData,
  IUserPreference,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { sliderWindowType } from "../../shared/components/SliderWindow";
import { ICustomViewFilter } from "../GenericAddCustomView/customViewHelpers/customFilterHelper";
import { IFormModalObject } from "./GenericModelScreen";

export interface InstanceDashboardProps {
  appName: SupportedApps;
  modelName: string;
  currentModuleLabel: string;
  fieldsList: ICustomField[];
  customModuleViewLoading: boolean;
  customModuleViewFieldsList: ICustomField[];
  customModuleViewList: ICustomView[];
  customModuleViewPermissions: boolean;
  modelDataLoading: boolean;
  modelData: any[];
  currentModule?: IModuleMetadata;
  itemsCount: number;
  currentDashboardView: SupportedDashboardViews;
  currentModuleCustomView: ICustomView | undefined;
  selectedItems: any[];
  loadingItemCount?: number;
  currentPageNumber: number;
  customViewsSideBarVisible: boolean;
  backgroundProcessRunning?: boolean;
  disableSearchButton: boolean;
  deleteModalVisible: boolean;
  defaultCustomViewId: string | undefined;
  userPreferences: IUserPreference[];
  selectedFilterFields: any[];
  customViewFiltersUpdateLoading?: boolean;
  newDataFoundWithSideNavFilters?: boolean;
  sideNavigationDropdownValue?: string;
  user: User | null;
  updatedNewFiltersForCurrentCustomView?: {
    name: string | null;
    operator: string | null;
    value: any[] | null;
    logicalOperator: string | null;
  }[];
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  foundNewData: boolean;
  openingRecordId: string | null;
  genericModels: IGenericModel;
  instances: IInstance[];
  appMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  instanceMessage: {
    id: string;
    created_at: Date;
    message: Record<string, string>;
  }[];
  setOpeningRecordId: (value: string | null) => void;
  setSelectedFilterFields: (value: any[]) => void;
  setFoundNewData?: (value: boolean) => void;
  setSideNavigationDropdownValue?: (value: string) => void;
  handleApplyTemparoryFilter?: (
    selectedFilterFields: {
      name: string | null;
      operator: string | null;
      value: any[] | null;
      logicalOperator: string | null;
    }[],
    sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[],
    calledFrom?: "localStorage" | "web"
  ) => void;
  onSelectFilterField: (value: any) => void;
  setUserPreferences?: (value: IUserPreference[]) => void;
  setCustomViewsSideBarVisible: (value: boolean) => void;
  onPageChange: (pageNumber: number) => void;
  setCurrentDashbaordView: React.Dispatch<
    React.SetStateAction<SupportedDashboardViews>
  >;
  setCurrentModuleCustomView: (item: ICustomView | undefined) => void;
  setSelectedItems: (items: any[]) => void;
  setDeleteModal: (value: IDeleteModalState) => void;
  setDeleteBulkItemsModal: (item: { visible: true }) => void;
  setSendEmailModal?: (value: boolean) => void;
  handleNewAddedRecord?: (data: any) => void;
  setActivityFormModal: (modal: IFormModalObject) => void;
  setBulkImportModal?: ({}: IFormModalObject) => void;
  handleCustomViewFieldChange: (customView: ICustomView) => void;
  KVData: IKanbanViewData | null;
  kanbanViewPermission: boolean;
  KVRecordData: any[];
  setKVRecordData: (data: any[]) => void;
  setKVData: (value: IKanbanViewData) => void;
  KViewDataLoading: boolean;
  handleSearchedSelectedItem?: (items: Record<string, string>[]) => void;
  setLocalSearchModal: (value: sliderWindowType) => void;
  setExportPdfModal: (value: boolean) => void;
  handleAddFiltersToCurrentCustomView?: () => void;
  handleAddFiltersToNewCustomView?: () => void;
  kanbanViewBulkDeleteRecords: string[] | null;
  setKanbanViewBulkDeleteRecords: (value: string[] | null) => void;
  handleSorting?: (value: {
    name: string;
    order: "ASC" | "DESC" | "None";
  }) => void;
  setSortingFieldList?: (
    value: {
      name: string;
      order: "ASC" | "DESC" | "None";
    }[]
  ) => void;
  handleChangeRecordPerPage: (value: number) => void;
  pageSize: number;
  pageSizeLoader: boolean;
  updateModelFieldData: (field: string, value: any, id: string) => void;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
  setCurrentCustomViewId: (
    customViewId: string | undefined,
    moduleName: string
  ) => void;
  setCurrentCustomViewFilter: (
    customViewFilterData: {
      filters: ICustomViewFilter[];
      expression: string | null;
    },
    moduleName: string
  ) => void;
  setCurrentCustomViewById: (customViewId: string, moduleName: string) => void;
  setDefaultCustomViewId: (
    customViewId: string | undefined,
    moduleName: string
  ) => void;
  removeCustomView: (customView: ICustomView, moduleName: string) => void;
  importUserPreferences: (userPreferences: IUserPreference[]) => void;
}

export interface IDeleteModalState {
  id: string;
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
}
