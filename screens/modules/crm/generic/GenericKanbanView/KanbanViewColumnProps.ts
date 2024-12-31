import { IInstance } from "../../../../../models/Accounts";
import { ICustomField } from "../../../../../models/ICustomField";
import { IKanbanViewData, SupportedApps } from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { ICustomViewFilter } from "../GenericAddCustomView/customViewHelpers/customFilterHelper";

export type KanbanViewColumnProps = {
  KVData: IKanbanViewData | null;
  setRecordData: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          data: any[];
          itemsCount: number;
          currentPage: number;
        }
      >
    >
  >;
  selectedLookupField: ICustomField | null;
  recordData: Record<
    string,
    {
      data: any[];
      itemsCount: number;
      currentPage: number;
    }
  >;
  appName: SupportedApps;
  modelName: string;
  fieldsList: ICustomField[];
  KViewDataLoading: boolean;
  loadingItemCount: number;
  KVDataLoading: boolean;
  recordDataLoading: boolean;
  foundNewData: boolean;
  setFoundNewData?: (value: boolean) => void;
  KVColumnHeaderData: {
    id: string;
    label: string;
  }[];
  selectedItems: any[];
  dataProcessed: boolean | undefined;
  dataProcessing: boolean | undefined;
  onItemSelect: (selectedItem: any) => void;
  onMultiItemSelect: (selectedItem: any[]) => void;
  onPageChange: (pageNumber: number, columnId: string) => void;
  pageLoader: string | null;
  deleteModalVisible: boolean;
  genericModels: IGenericModel;
  instances: IInstance[];
  backgroundProcessRunning: boolean | undefined;
  setSelectItemsOnAllPages: (items: any[]) => void;
  fetchDataFunction: (
    filter: {
      name: string;
      operator: string;
      value: null | any[];
    }[],
    backgroundLoading: boolean
  ) => void;
  currentCustomViewFilter: {
    filters: ICustomViewFilter[];
    expression: string | null;
  };
  fieldLevelPermission: {
    permission: boolean;
    message: null | string;
  };
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
  isCategorizeByVisible: boolean;
};
