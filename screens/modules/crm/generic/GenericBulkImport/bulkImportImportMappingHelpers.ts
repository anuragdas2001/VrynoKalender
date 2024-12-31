import { FormikValues } from "formik";
import { ILayout } from "../../../../../models/ILayout";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { IUserPreference } from "../../../../../models/shared";
import { INavigation } from "../../../../../models/INavigation";

export type TypeMappingFilterMode = "all" | "mapped" | "unmapped";

export type ConnectedAddBulkImportScreenProps = {
  appName: string;
  modelName: string;
  fieldsList: ICustomField[];
  currentModule?: IModuleMetadata;
  currentLayout?: ILayout;
  backgroundProcessRunning?: boolean;
  setBackgroundProcessRunning?: (value: boolean) => void;
};

export interface IBulkImportMappingData {
  id: string;
  fileName: string;
  headers: string[];
  fileKey: string;
  name: string;
  mappingMode: string;
  updateOn: null | string;
  skipOn: null | string;
  rowData: (string | null)[] | null;
  updateEmptyValues: boolean;
}

export interface IBulkImportFieldMappingData {
  id: string;
  sourceFieldLabel: string;
  destinationFieldUniqueName: string;
  options: { merge: boolean; defaultValue: null | string };
}

export interface IBulkImportData {
  id: null | string;
  fieldInFile: string;
  fieldInCrm: string;
  replaceValue: string;
  merge: boolean;
  rowDataOne: string | null;
  rowDataTwo: string | null;
}
export interface IFieldMappingData {
  data: IBulkImportData[];
  totalRecords: number;
}

export interface IBulkImportCriteriaValues {
  name: string | null;
  mappingMode: string;
  updateOn: string | null;
  skipOn: string | null;
  triggerAutomation: boolean;
  updateEmptyValues: boolean;
}

export interface IBulkImportContentContainer {
  appName: string;
  modelName: string;
  ui: string;
  id: string;
  fieldsList: ICustomField[];
  sampleListHeaders: ICustomField[];
  moduleData: IModuleMetadata | null;
  bulkImportStepOne: boolean;
  bulkImportStepTwo: boolean;
  bulkImportStepThree: boolean;
  setBulkImportStepOne: (value: boolean) => void;
  setBulkImportStepTwo: (value: boolean) => void;
  setBulkImportStepThree: (value: boolean) => void;
  bulkImportMappingData: IBulkImportMappingData | null;
  bulkImportFieldMappingData: IBulkImportFieldMappingData[] | null;
  setBulkImportMappingData: (value: IBulkImportMappingData | null) => void;
  bulkImportMappingProcessing: boolean;
  setBulkImportMappingProcessing: (value: boolean) => void;
  bulkImportCriteriaValues: IBulkImportCriteriaValues;
  setBulkImportCriteriaValues: (value: IBulkImportCriteriaValues) => void;
  triggerAutomation: boolean;
  onTriggerAutomation: (value: boolean) => void;
  fileName: string;
  importedFiles: File[] | null;
  navigations: INavigation[];
  userPreferences: IUserPreference[];
  setImportedFiles: (value: File[] | null) => void;
}

export type AddBulkImportScreenProps = {
  modelName: string;
  ui: string;
  fieldsList: ICustomField[];
  sampleListHeaders: ICustomField[];
  savingProcess: boolean;
  bulkImportStepOne: boolean;
  bulkImportStepTwo: boolean;
  bulkImportStepThree: boolean;
  bulkImportCriteriaValues: IBulkImportCriteriaValues;
  fieldMappingData: IBulkImportData[] | null;
  setBulkImportStepOne: (value: boolean) => void;
  setBulkImportStepTwo: (value: boolean) => void;
  setBulkImportStepThree: (value: boolean) => void;
  handleBulkImportCreation: (values: FormikValues) => Promise<void>;
  handleBulkImportCriteria: (values: FormikValues) => Promise<void>;
  handleBulkImportFieldMapping: (values: FormikValues) => void;
  useDefaultMapping: boolean;
  handleUseDefaultMapping: (value: boolean) => void;
  gotoStepTwo: () => void;
  bulkImportMappingData: IBulkImportMappingData | null;
  mappingInitialData: {};
  bulkImportMappingProcessing: boolean;
  bulkImportFieldMappingSaving: boolean;
  importedFiles: File[] | null;
  setImportedFiles: (value: File[] | null) => void;
  handleBICriteriaUpdate: (
    fieldName: string,
    value: null | string | boolean
  ) => void;
  triggerAutomation: boolean;
  onTriggerAutomation: (value: boolean) => void;
  mappingCount: {
    mapped: number;
    unmapped: number;
  };
  handleChangeFilter: (type: TypeMappingFilterMode) => void;
  updateFieldsWithImportData: (record: IBulkImportData) => void;
  mappingFilterMode: TypeMappingFilterMode;
  resetValues: () => void;
  fileName: string;
  userPreferences: IUserPreference[];
};

export type BulkImportStepOneProps = {
  ui: string;
  currentModuleLabel: string;
  importedFiles: File[] | null;
  savingProcess: boolean;
  sampleListHeaders: ICustomField[];
  fieldsList?: ICustomField[];
  setImportedFiles: (value: File[] | null) => void;
  handleBulkImportCreation: (values: FormikValues) => Promise<void>;
  useDefaultMapping: boolean;
  handleUseDefaultMapping: (value: boolean) => void;
  gotoStepTwo: () => void;
};

export type BulkImportStepTwoProps = {
  ui: string;
  currentModuleLabel: string;
  importedFiles: File[] | null;
  fieldsList: ICustomField[];
  bulkImportCriteriaValues: IBulkImportCriteriaValues;
  handleBulkImportCriteria: (values: FormikValues) => Promise<void>;
  setBulkImportStepOne: (value: boolean) => void;
  setBulkImportStepTwo: (value: boolean) => void;
  setBulkImportStepThree: (value: boolean) => void;
  bulkImportMappingData: IBulkImportMappingData | null;
  bulkImportMappingProcessing: boolean;
  handleBICriteriaUpdate: (
    fieldName: string,
    value: null | string | boolean
  ) => void;
  fileName: string;
};

export type BulkImportStepThreeProps = {
  modelName: string;
  currentModuleLabel: string;
  importedFiles: File[] | null;
  fieldsList: ICustomField[];
  fieldMappingData: IBulkImportData[] | null;
  handleBulkImportFieldMapping: (values: FormikValues) => void;
  setBulkImportStepTwo: (value: boolean) => void;
  setBulkImportStepThree: (value: boolean) => void;
  mappingInitialData: {};
  bulkImportFieldMappingSaving: boolean;
  triggerAutomation: boolean;
  onTriggerAutomation: (value: boolean) => void;
  mappingCount: {
    mapped: number;
    unmapped: number;
  };
  handleChangeFilter: (type: TypeMappingFilterMode) => void;
  updateFieldsWithImportData: (record: IBulkImportData) => void;
  mappingFilterMode: TypeMappingFilterMode;
  resetValues: () => void;
  fileName: string;
  ui: string;
  userPreferences: IUserPreference[];
};

export const fieldToValueExtractor = (data: IBulkImportData[]) => {
  let result = {};
  data.forEach((value, index) => {
    result = {
      ...result,
      [`fieldInFile:${index}`]: value.fieldInFile,
      [`fieldInCrm:${index}`]: value.fieldInCrm,
      [`replaceValue:${index}`]: value.replaceValue,
      [`merge:${index}`]: value.merge,
    };
  });
  return result;
};

export const valueToFieldExtractor = (values: FormikValues) => {
  let resultArray = Array();
  for (const key in values) {
    const [name, index] = key.split(":");
    if (!isNaN(+index)) {
      resultArray[+index] = resultArray[+index]
        ? { ...resultArray[+index], [name]: values[key] }
        : { [name]: values[key] };
    }
  }
  return resultArray;
};

export const bulkImportFieldMappingDataMutation = (
  fieldMappingData: IBulkImportData[] | null,
  values: FormikValues,
  initMappingData: IBulkImportData[] | null
) => {
  const requestArray: {
    id: string | null;
    fieldInFile: string;
    fieldInCrm: string;
    replaceValue: null | string;
    options: { merge: boolean };
  }[] = [];
  const valuesArray = valueToFieldExtractor(values);
  fieldMappingData?.forEach((mappingData, index) => {
    const valuesData = valuesArray[index];
    if (
      initMappingData?.[index].fieldInFile !== valuesData.fieldInFile ||
      initMappingData?.[index].fieldInCrm !== valuesData.fieldInCrm ||
      initMappingData?.[index].replaceValue !== valuesData.replaceValue ||
      initMappingData?.[index].merge !== valuesData.merge
    ) {
      requestArray.push({
        id: mappingData.id,
        fieldInFile: valuesData.fieldInFile,
        fieldInCrm: valuesData.fieldInCrm,
        replaceValue: valuesData?.replaceValue
          ? valuesData?.replaceValue
          : null,
        options: { merge: valuesData.merge },
      });
    }
  });
  return requestArray;
};

export const fieldMappingDataExtractor = (
  bulkImportMappingData: IBulkImportMappingData,
  bulkImportFieldMappingData: IBulkImportFieldMappingData[]
) => {
  let mutatedData: IBulkImportData[] = [];

  mutatedData = bulkImportMappingData.headers?.map((name, headerIndex) => {
    const matchedFieldDependency: IBulkImportFieldMappingData[] =
      bulkImportFieldMappingData.filter(
        (data) => name === data.sourceFieldLabel
      );
    if (matchedFieldDependency.length) {
      return {
        id: matchedFieldDependency[0].id,
        fieldInFile: name,
        fieldInCrm: matchedFieldDependency[0].destinationFieldUniqueName,
        replaceValue: matchedFieldDependency[0].options.defaultValue || "",
        merge: matchedFieldDependency[0].options.merge,
        rowDataOne: bulkImportMappingData?.rowData?.[0]
          ? bulkImportMappingData?.rowData?.[0][headerIndex]
          : null,
        rowDataTwo: bulkImportMappingData?.rowData?.[1]
          ? bulkImportMappingData?.rowData?.[1][headerIndex]
          : null,
      };
    }
    return {
      id: null,
      fieldInFile: name,
      fieldInCrm: "",
      replaceValue: "",
      merge: false,
      rowDataOne: null,
      rowDataTwo: null,
    };
  });
  return mutatedData;
};
