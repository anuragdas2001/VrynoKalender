import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";
import { sortFieldList } from "./sortFieldList";

export const handleDeleteSection = (
  sections: SectionDetailsType[],
  section: SectionDetailsType | null
) => {
  if (!section) return sections;

  const updatedSections = [...sections];
  const deletedSectionFields = section.sectionFieldsWithOrder;
  const deletedSectionFieldsWithDatatypeRecordImage = deletedSectionFields
    ?.filter((deletedSectionField) => {
      const findIndexOfField = section.sectionFields.findIndex(
        (sectionField) =>
          sectionField.name === deletedSectionField.fieldName &&
          sectionField.dataType === "recordImage"
      );
      if (findIndexOfField !== -1) return deletedSectionField;
    })
    ?.filter((field) => field);

  const deletedSectionFieldsNotWithDatatypeRecordImage = sortFieldList(
    deletedSectionFields
      ?.filter((deletedSectionField) => {
        const findIndexOfField = section.sectionFields.findIndex(
          (sectionField) =>
            sectionField.name === deletedSectionField.fieldName &&
            sectionField.dataType !== "recordImage"
        );
        if (findIndexOfField !== -1) return deletedSectionField;
      })
      ?.filter((field) => field)
  );
  const findDetailsSectionIndex = updatedSections.findIndex(
    (section) => section.sectionName === "details"
  );
  let highestIndexInDetailsPage: number = -1;
  updatedSections[findDetailsSectionIndex].sectionFieldsWithOrder.forEach(
    (field) => {
      if (field.order > highestIndexInDetailsPage)
        highestIndexInDetailsPage = field.order;
    }
  );

  updatedSections[findDetailsSectionIndex].sectionFieldsWithOrder =
    sortFieldList([
      ...deletedSectionFieldsWithDatatypeRecordImage,
      ...updatedSections[findDetailsSectionIndex].sectionFieldsWithOrder,
      ...deletedSectionFieldsNotWithDatatypeRecordImage.map((field) => {
        return { ...field, order: ++highestIndexInDetailsPage };
      }),
    ]);

  updatedSections[findDetailsSectionIndex].sectionFields = [
    ...updatedSections[findDetailsSectionIndex].sectionFields,
    ...section.sectionFields,
  ];

  return updatedSections?.filter(
    (updatedSection) => updatedSection.sectionName !== section.sectionName
  );
};
