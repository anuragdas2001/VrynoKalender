import { ICustomField } from "../../../../../../../models/ICustomField";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";
import { IGenericFormDetails } from "../../../../generic/GenericModelDetails/IGenericFormDetails";

export type GetDetailsContainerFieldsProps = {
  type?: "Modal" | "WebPage";
  fieldList: Array<ICustomField>;
  editMode: boolean;
  appName?: string;
  modelName: string;
  id: string;
  quickCreate?: boolean;
  isSample: boolean;
  formResetted?: boolean;
  formDetails?: IGenericFormDetails;
  rejectRequired?: boolean;
  addClear?: boolean;
  disabled?: boolean;
  sections?: SectionDetailsType[];
  currentFormLayer?: boolean;
  fieldCustomization?: boolean;
  sectionFieldList?: ICustomField[];
  columnLayoutValues?: Record<string, string>;
  sectionDetails?: SectionDetailsType;
  sectionsLength?: number;
  lookupDependencyFields: Record<string, Record<string, string>>;
  retainValueFields?: string[];
  countryCodeInUserPreference: string;
  setCurrentFormLayer?: (value: boolean) => void;
  handleDependencyLookupFiltering: (
    parentField: string,
    parentLookup: string,
    childField: string
  ) => void;
  handleUpSectionOrder?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string,
    movingToSectionName?: SectionDetailsType
  ) => void;
  handleDownSectionOrder?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string,
    movingToSectionName?: SectionDetailsType
  ) => void;
  handleRightFieldOrderUpdateInsideSection?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string
  ) => void;
  handleLeftFieldOrderUpdateInsideSection?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string
  ) => void;
  handleUpFieldOrderUpdateInsideSection?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string
  ) => void;
  handleDownFieldOrderUpdateInsideSection?: (
    sectionDetails?: SectionDetailsType,
    field?: ICustomField,
    sectionName?: string
  ) => void;
  setDefaultCurrency?: boolean;
  disableAutoSelectOfSystemDefinedValues?: boolean;
};
