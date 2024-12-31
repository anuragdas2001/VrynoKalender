import React from "react";
import { GetDetailsContainerFields } from "../../FieldContainers/GetDetailsContainerFields";
import { handleUpSectionOrder } from "../handleUpSectionOrder";
import { handleDownSectionOrder } from "../handleDownSectionOrder";
import { handleLeftFieldOrderUpdateInsideSection } from "../handleLeftFieldOrderUpdateInsideSection";
import { handleRightFieldOrderUpdateInsideSection } from "../handleRightFieldOrderUpdateInsideSection";
import { handleDownFieldOrderUpdateInsideSection } from "../handleDownFieldOrderUpdateInsideSection";
import { handleUpFieldOrderUpdateInsideSection } from "../handleUpFieldOrderUpdateInsideSection";
import { ICustomField } from "../../../../../../../../models/ICustomField";
import { SectionDetailsType } from "../../../../../generic/GenericForms/Shared/genericFormProps";
import { IGenericFormDetails } from "../../../../../generic/GenericModelDetails/IGenericFormDetails";

export type CustomizableFormSectionProps = {
  id: string;
  appName: string;
  type: "Modal" | "WebPage";
  formFieldsList: ICustomField[];
  setDefaultCurrency: boolean | undefined;
  columnLayoutValues: Record<string, string>;
  section: SectionDetailsType;
  isSample: boolean;
  modelName: string;
  editMode: boolean;
  formResetted?: boolean;
  quickCreate: boolean;
  addClear: boolean;
  disabled?: boolean;
  countryCodeInUserPreference: string;
  rejectRequired: boolean;
  formDetails: IGenericFormDetails | undefined;
  sections: SectionDetailsType[];
  currentFormLayer?: boolean;
  hasRelatedTo: boolean;
  lookupDependencyFields: Record<string, Record<string, string>>;
  retainValueFields?: string[] | undefined;
  formCustomization: boolean;
  setSections: (value: SectionDetailsType[]) => void;
  setCurrentFormLayer: (value: boolean) => void;
  handleDependencyLookupFiltering: (
    parentField: string,
    parentLookup: string,
    childField: string
  ) => void;
  disableAutoSelectOfSystemDefinedValues?: boolean;
};

export const CustomizableFormSection = ({
  id,
  appName,
  type,
  formFieldsList,
  setDefaultCurrency,
  columnLayoutValues,
  section,
  isSample,
  modelName,
  editMode,
  formResetted,
  quickCreate,
  addClear,
  disabled,
  countryCodeInUserPreference,
  rejectRequired,
  formDetails,
  sections,
  currentFormLayer,
  hasRelatedTo,
  lookupDependencyFields,
  formCustomization,
  retainValueFields,
  setSections,
  setCurrentFormLayer,
  handleDependencyLookupFiltering,
  disableAutoSelectOfSystemDefinedValues,
}: CustomizableFormSectionProps) => {
  return (
    <GetDetailsContainerFields
      id={id}
      type={type}
      setDefaultCurrency={setDefaultCurrency}
      fieldList={formFieldsList}
      columnLayoutValues={columnLayoutValues}
      sectionFieldList={section.sectionFields?.filter(
        (sectionField) => sectionField.dataType !== "relatedTo"
      )}
      isSample={isSample}
      appName={appName}
      modelName={modelName}
      editMode={editMode}
      formResetted={formResetted}
      quickCreate={quickCreate}
      formDetails={formDetails}
      rejectRequired={rejectRequired}
      addClear={addClear}
      disabled={disabled}
      countryCodeInUserPreference={countryCodeInUserPreference}
      currentFormLayer={currentFormLayer}
      retainValueFields={retainValueFields}
      lookupDependencyFields={lookupDependencyFields}
      fieldCustomization={formCustomization}
      setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      handleDependencyLookupFiltering={handleDependencyLookupFiltering}
      sections={sections}
      sectionDetails={section}
      sectionsLength={
        sections
          ?.filter((section) => {
            if (hasRelatedTo) return section;
            else if (section.sectionName === "relatedTo") return null;
            else return section;
          })
          ?.map((section) => section)?.length
      }
      handleUpSectionOrder={(
        sectionDetails,
        field,
        sectionName,
        upSectionName
      ) =>
        setSections(
          handleUpSectionOrder(
            sections,
            sectionDetails,
            field,
            sectionName,
            upSectionName
          )
        )
      }
      handleDownSectionOrder={(
        sectionDetails,
        field,
        sectionName,
        downSectionName
      ) =>
        setSections(
          handleDownSectionOrder(
            sections,
            sectionDetails,
            field,
            sectionName,
            downSectionName
          )
        )
      }
      handleLeftFieldOrderUpdateInsideSection={(section, field) =>
        setSections(
          handleLeftFieldOrderUpdateInsideSection(sections, section, field)
        )
      }
      handleRightFieldOrderUpdateInsideSection={(section, field) =>
        setSections(
          handleRightFieldOrderUpdateInsideSection(sections, section, field)
        )
      }
      handleDownFieldOrderUpdateInsideSection={(section, field) =>
        setSections(
          handleDownFieldOrderUpdateInsideSection(sections, section, field)
        )
      }
      handleUpFieldOrderUpdateInsideSection={(section, field) =>
        setSections(
          handleUpFieldOrderUpdateInsideSection(sections, section, field)
        )
      }
      disableAutoSelectOfSystemDefinedValues={
        disableAutoSelectOfSystemDefinedValues
      }
    />
  );
};
