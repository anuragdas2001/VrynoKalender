import { ICustomField } from "../../../../../../models/ICustomField";
import { IUserPreference } from "../../../../../../models/shared";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SectionDetailsType } from "../../../generic/GenericForms/Shared/genericFormProps";
import { IGenericFormDetails } from "../../../generic/GenericModelDetails/IGenericFormDetails";

export type FormFieldPerDataTypeProps = {
  field: ICustomField;
  fieldList?: ICustomField[];
  isSample: boolean;
  additionalFieldName?: string;
  replaceFromExpression?: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  appName?: string;
  modelName: string;
  editMode: boolean;
  id?: string;
  index?: number;
  values: Record<string, string>;
  fieldName?: string;
  showLabel?: boolean;
  allowMargin?: boolean;
  formResetted?: boolean;
  disabled?: boolean;
  labelValue?: string;
  required?: boolean;
  formDetails?: IGenericFormDetails;
  rejectRequired?: boolean;
  addClear?: boolean;
  convertToBoolean?: boolean;
  currentFormLayer?: boolean;
  fieldCustomization?: boolean;
  overflow?: boolean;
  countryCodeInUserPreference: string;
  autoOpenSearchScreenContainer?: boolean;
  setValuesForFields?: { fetchField: string; setValueForField: string }[];
  formulaExpressionToShow?: string;
  paddingInPixelForInputBox?: number;
  setCurrentFormLayer?: (value: boolean) => void;
  lookupDependencyFields?: Record<string, Record<string, string>>;
  handleDependencyLookupFiltering?: (
    parentField: string,
    parentLookup: string,
    childField: string
  ) => void;
  stopRecordLookupAutoReset?: boolean;
  additionalValueToRemove?: number;
  retainDefaultValue?: boolean;
  handleSetValuesForFields?: (
    items: {
      fetchField: string;
      setValueForField: string;
      value: any;
    }[]
  ) => void;
  enableRichTextReinitialize?: boolean;
  useExpression?: boolean;
  setDefaultCurrency?: boolean;
  switchWidth?: "full" | "auto";
  disableGlobalSearchIcon?: boolean;
  dataTestId?: string;
  hideValidationMessages?: boolean;
  disableAutoSelectOfSystemDefinedValues?: boolean;
  fieldLabel?: string;
};

export type FormFieldListProps = {
  fieldList: Array<ICustomField>;
  editMode: boolean;
  appName: string;
  customFieldsData?: Record<string, Record<string, string>>;
  type?: "Modal" | "WebPage";
  quickCreate?: boolean;
  isSample?: boolean;
  formResetted?: boolean;
  moduleName?: string;
  allowToggle?: boolean;
  cardMarginTop?: string;
  applyBorder?: boolean;
  formDetails?: IGenericFormDetails;
  includeCardContainer?: boolean;
  rejectRequired?: boolean;
  addClear?: boolean;
  disabled?: boolean;
  updatePipeline?: boolean;
  currentFormLayer?: boolean;
  formCustomization?: boolean;
  editData: Record<string, string | Record<string, Record<string, string>>>;
  addNewSection?: boolean;
  saveFormCustomization?: boolean;
  saveCustomizationFormError?: boolean;
  loadingCustomizationForm?: boolean;
  retainValueFields?: string[];
  countryCodeInUserPreference: string;
  userPreferences?: IUserPreference[];
  setLoadingCustomizationForm?: (value: boolean) => void;
  setSaveCustomizationFormError?: (value: boolean) => void;
  setAddNewSection?: (value: boolean) => void;
  handleSaveFormCustomization?: (sections: SectionDetailsType[]) => void;
  setCurrentFormLayer?: (value: boolean) => void;
  detailHeading?: string;
  setSaveFormCustomization?: (value: boolean) => void;
  setDefaultCurrency?: boolean;
  setDefaultStageAndPipeline?: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  disableAutoSelectOfSystemDefinedValues?: boolean;
};

export const columnLayoutValues: Record<string, string> = {
  1: "grid",
  2: "grid sm:grid-cols-2",
  3: "grid sm:grid-cols-2 lg:grid-cols-3",
  4: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};
