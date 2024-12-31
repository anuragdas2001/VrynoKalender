import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const updateSectionColumnLayouts = (
  sections: SectionDetailsType[],
  section: SectionDetailsType,
  columnLayout: string
) => {
  const updatedSections = [...sections];
  const findIndexOfCurrentSection = updatedSections?.findIndex(
    (updatedSection) => updatedSection.sectionName === section.sectionName
  );
  updatedSections[findIndexOfCurrentSection].columnLayout = columnLayout;
  return updatedSections;
};
