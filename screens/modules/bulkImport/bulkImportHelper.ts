import { camelCase } from "lodash";
import { ICustomField } from "../../../models/ICustomField";
import { IModuleMetadata } from "../../../models/IModuleMetadata";
import { INavigation } from "../../../models/INavigation";
import { IBulkImport, SupportedApps } from "../../../models/shared";
import { getDataObject } from "../crm/shared/utils/getDataObject";

export const getModelName = (modelName: string) => {
  return camelCase(modelName.replace("bi", ""));
};

export type bulkImportJobItemFetchVariableType = {
  variables: {
    modelName: string;
    fields: string[];
    filters: (
      | {
          operator: string;
          name: string;
          value: string;
        }
      | {
          operator: string;
          name: string;
          value: string[];
        }
    )[];
    pageNumber: number;
  };
};

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

export const jobFields = [
  "id",
  "fileName",
  "fileKey",
  "moduleUniqueName",
  "status",
  "errorMessage",
  "totalRecords",
  "dumpedRecords",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
];

export const jobItemsFields = [
  "jobId",
  "moduleUniqueName",
  "dataRow",
  "status",
  "errorMessage",
];

export interface IBulkImportMappingData {
  id: string;
  name: string;
  fileName: string;
  moduleUniqueName: string;
}

export type bulkImportTabType = "success" | "failed" | "other";

export const biSuccessStatus = ["completed", "success"];

export const biErrorStatus = ["error", "Failed"];

export const biOtherStatus = [
  "Delayed",
  "processing",
  "skipped",
  "pending",
  "hold",
  "cancelled",
];

export const bulkImportItemVariablesGenerator = (
  biJobId: string,
  selectedTab: bulkImportTabType,
  pageNumber: number
) => {
  return {
    modelName: "BulkImportJobItem",
    fields: jobItemsFields,
    filters: [
      {
        operator: "in",
        name: "jobId",
        value: biJobId,
      },
      {
        operator: "in",
        name: "status",
        value:
          selectedTab === "success"
            ? biSuccessStatus
            : selectedTab === "failed"
            ? biErrorStatus
            : biOtherStatus,
      },
    ],
    pageNumber: pageNumber,
  };
};

export const getUpdatedJobData = (
  bulkImportJobItems: any[],
  responseData: any[]
) => {
  const updatedJobData = [];
  for (let i = 0; i < bulkImportJobItems.length; i++) {
    const jobItem = bulkImportJobItems[i];
    let found = false;
    for (let j = 0; j < responseData.length; j++) {
      const response = responseData[j];
      if (jobItem?.id === response.id) {
        const data = {
          ...getDataObject(response),
          status: jobItem.status,
          errorMessage: jobItem.errorMessage,
        };
        updatedJobData.push(data);
        found = true;
        break;
      }
    }
    if (!found) {
      updatedJobData.push(jobItem);
    }
  }
  return updatedJobData;
};

export interface IBulkImportScreen {
  sideMenuLoading: boolean;
  jobPageLoading: boolean;
  jobItemsPageLoading: boolean;
  appName: SupportedApps;
  modelName: string;
  ui: string;
  id: string;
  sideMenuItems: Array<any>;
  jobsCount: number;
  jobItemsCount: number;
  bulkImportJobs: IBulkImport[];
  bulkImportJobItems: Array<any>;
  currentJobPageNumber: number;
  currentJobItemsPageNumber: number;
  fieldsList: ICustomField[];
  onJobPageChange: (pageNumber: number) => void;
  onJobItemPageChange: (pageNumber: number) => void;
  onMenuItemChange: (item: any) => void;
  selectedTab: "jobs" | "mapping";
  onTabSelection: (value: "jobs" | "mapping") => void;
  bulkImportMappingData: IBulkImportMappingData[];
  setDeleteBIMappingModal: (value: {
    visible: boolean;
    item: null | IBulkImportMappingData;
  }) => void;
  bIDeleteProcessing: boolean;
  bulkImportMappingDataLoading: boolean;
  bulkImportMappingCount: number;
  bulkImportMappingPageNumber: number;
  onBIMappingPageChange: (pageNumber: number) => void;
  setBulkImportJobs: (value: IBulkImport[]) => void;
  selectedJobItemTab: "success" | "failed" | "other";
  onJobItemTabSelection: (value: "success" | "failed" | "other") => void;
  updateBulkImportJobs: (value: IBulkImport[]) => void;
  deleteBIMappingModal: {
    visible: boolean;
    item: null | IBulkImportMappingData;
  };
  handleBIMappingDelete: (item: IBulkImportMappingData) => void;
  navigations: INavigation[];
  currentLabel: string;
  jobItemTableHeaderLoader: boolean;
  setJobItemTableHeaderLoader: (value: boolean) => void;
}

export interface IBulkImportContainer {
  appName: SupportedApps;
  modelName: string;
  ui: string;
  id: string;
  moduleData: IModuleMetadata | null;
  setBulkImportJobItems: (value: any) => void;
  setBulkImportJobItemsLoading: (value: boolean) => void;
  setBulkImportJobItemsDataLoading: (value: boolean) => void;
  setSelectJobItemTab: (value: bulkImportTabType) => void;
  getBulkImportJobItems: (value: bulkImportJobItemFetchVariableType) => void;
  bulkImportJobsLoading: boolean;
  bulkImportJobItemsDataLoading: boolean;
  currentJobPageNumber: number;
  setCurrentJobPageNumber: (value: number) => void;
  setBulkImportJobs: (value: IBulkImport[]) => void;
  setBulkImportJobsLoading: (value: boolean) => void;
  bulkImportJobs: IBulkImport[];
  fieldsList: ICustomField[];
  bulkImportJobItemsData: any[];
  onJobPageChange: (pageNumber: number) => void;
  selectedJobItemTab: bulkImportTabType;
  jobsCount: number;
  jobItemsCount: number;
  jobItemTableHeaderLoader: boolean;
  setJobItemTableHeaderLoader: (value: boolean) => void;
}

export interface IBulkImportTopSection {
  id: string;
  modelName: string;
  jobPageLoading: boolean;
  jobItemsCount: number;
  currentJobItemsPageNumber: number;
  bulkImportJobItems: any[];
  onJobItemPageChange: (pageNumber: number) => void;
  jobsCount: number;
  currentJobPageNumber: number;
  bulkImportJobs: IBulkImport[];
  onJobPageChange: (pageNumber: number) => void;
  jobItemsPageLoading: boolean;
  onTabSelection: (value: "jobs" | "mapping") => void;
  selectedTab: "jobs" | "mapping";
  bulkImportMappingDataLoading: boolean;
  bulkImportMappingData: IBulkImportMappingData[];
  bulkImportMappingCount: number;
  bulkImportMappingPageNumber: number;
  onBIMappingPageChange: (pageNumber: number) => void;
  selectedJobItemTab: "success" | "failed" | "other";
  onJobItemTabSelection: (value: "success" | "failed" | "other") => void;
  currentLabel: string;
  navigations: INavigation[];
}
