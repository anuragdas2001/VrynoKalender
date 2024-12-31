import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const updateSectionHeading = (
  sections: SectionDetailsType[],
  value: string,
  section?: SectionDetailsType
) => {
  if (!section) return sections;
  const updatedSections = [...sections];
  const findIndexOfCurrentSection = updatedSections?.findIndex(
    (updatedSection) => updatedSection.sectionName === section.sectionName
  );
  updatedSections[findIndexOfCurrentSection].sectionLabel = value;
  return updatedSections;
};
