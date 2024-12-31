import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";

export const removeSectionsWithDuplicateName = (
  sections: SectionDetailsType[]
) => {
  let updatedSections: SectionDetailsType[] = [];
  sections?.forEach((section) => {
    const findIndex = updatedSections?.findIndex(
      (updatedSection) => updatedSection.sectionName === section.sectionName
    );
    if (findIndex === -1) {
      updatedSections = [...updatedSections, section];
    }
  });
  return updatedSections;
};
