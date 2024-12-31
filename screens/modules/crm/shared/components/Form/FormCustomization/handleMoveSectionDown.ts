import { cloneDeep } from "lodash";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const handleMoveSectionDown = (
  sections: SectionDetailsType[],
  section: SectionDetailsType
) => {
  const updatedSections = cloneDeep(sections);
  const currentSectionIndex = updatedSections?.findIndex(
    (updatedSection) => updatedSection.sectionName === section.sectionName
  );
  updatedSections[currentSectionIndex].sectionOrder =
    sections[currentSectionIndex + 1]?.sectionOrder;
  updatedSections[currentSectionIndex + 1].sectionOrder =
    sections[currentSectionIndex]?.sectionOrder;
  const currentSection = updatedSections[currentSectionIndex];
  updatedSections[currentSectionIndex] =
    updatedSections[currentSectionIndex + 1];
  updatedSections[currentSectionIndex + 1] = currentSection;
  return updatedSections;
};
