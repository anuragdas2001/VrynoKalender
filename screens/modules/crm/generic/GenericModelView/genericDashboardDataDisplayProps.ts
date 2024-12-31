import { IInstance } from "../../../../../models/Accounts";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  ICustomView,
  IGenericConversionFormData,
  IKanbanViewData,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IFormModalObject } from "./GenericModelDashboard";
import { IDeleteModalState } from "./exportGenericModelDashboardTypes";

export type GenericDashboardDataDisplayProps = {
  modelData: Array<any>;
  appName: SupportedApps;
  modelName: string;
  currentModuleCustomView: ICustomView | undefined;
  fieldsList: Array<ICustomField>;
  customModuleViewFieldsList: ICustomField[];
  currentDashboardView: SupportedDashboardViews;
  selectedItems: Array<any>;
  currentPageNumber: number;
  itemsCount: number;
  backgroundProcessRunning?: boolean;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  currentModuleLabel: string;
  loadingItemCount: number;
  KVData: IKanbanViewData | null;
  kanbanViewPermission: boolean;
  KVRecordData: any[];
  KViewDataLoading: boolean;
  deleteModalVisible: boolean;
  updatedNewFiltersForCurrentCustomView?: {
    name: string | null;
    operator: string | null;
    value: any[] | null;
    logicalOperator: string | null;
  }[];
  currentCustomView: ICustomView | undefined;
  newDataFoundWithSideNavFilters: boolean | undefined;
  selectedFilterFields: any[];
  foundNewData: boolean;
  customViewFiltersUpdateLoading?: boolean;
  openingRecordId: string | null;
  genericModels: IGenericModel;
  instances: IInstance[];
  setOpeningRecordId: (value: string | null) => void;
  setFoundNewData?: (value: boolean) => void;
  setSortingFieldList?: (
    value: {
      name: string;
      order: "ASC" | "DESC" | "None";
    }[]
  ) => void;
  handleAddFiltersToNewCustomView?: () => void;
  handleAddFiltersToCurrentCustomView?: () => void;
  handleSorting?: (value: {
    name: string;
    order: "ASC" | "DESC" | "None";
  }) => void;
  setKVRecordData: (data: any[]) => void;
  onPageChange: (pageNumber: number) => void;
  onItemSelect: (selectedItem: any) => void;
  onMultiItemSelect: (selectedItem: any[]) => void;
  selectAllItems: () => void;
  setDeleteModal: (modal: IDeleteModalState) => void;
  setActivityFormModal: (modal: IFormModalObject) => void;
  setSelectItemsOnAllPages: (items: any[]) => void;
  handleApplyTemparoryFilter?: (
    selectedFilterFields: {
      name: string | null;
      operator: string | null;
      value: any[] | null;
      logicalOperator: string | null;
    }[],
    sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[]
  ) => void;
  kanbanViewBulkDeleteRecords: string[] | null;
  setKanbanViewBulkDeleteRecords: (value: string[] | null) => void;
  handleChangeRecordPerPage: (value: number) => void;
  pageSize: number;
  updateModelFieldData: (field: string, value: any, id: string) => void;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
};
