import { ICustomField } from "../../../../../../../models/ICustomField";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const handleUpSectionOrder = (
  sections: SectionDetailsType[],
  sectionDetails?: SectionDetailsType,
  field?: ICustomField,
  sectionName?: string,
  upSection?: SectionDetailsType
) => {
  const updatedSections = [...sections];
  if (!upSection || !field || !sectionName) return sections;
  const currentSectionIndex = sections.findIndex(
    (section) => section.sectionName === sectionDetails?.sectionName
  );
  const upSectionIndex = sections.findIndex(
    (section) => section.sectionName === upSection.sectionName
  );

  updatedSections[upSectionIndex].sectionFields = [
    ...updatedSections[upSectionIndex].sectionFields,
    field,
  ];

  let highestIndexInDetailsPage: number = -1;
  updatedSections[upSectionIndex].sectionFieldsWithOrder.forEach((field) => {
    if (field.order > highestIndexInDetailsPage)
      highestIndexInDetailsPage = field.order;
  });

  updatedSections[upSectionIndex].sectionFieldsWithOrder =
    field.dataType === "recordImage"
      ? [
          {
            fieldName: field.name,
            order: field.order,
            dataType: field.dataType,
            visible: field.visible,
            addInForm: field.addInForm,
            readOnly: field.readOnly,
          },
          ...updatedSections[upSectionIndex].sectionFieldsWithOrder,
        ]
      : [
          ...updatedSections[upSectionIndex].sectionFieldsWithOrder,
          {
            fieldName: field.name,
            order: ++highestIndexInDetailsPage,
            dataType: field.dataType,
            visible: field.visible,
            addInForm: field.addInForm,
            readOnly: field.readOnly,
          },
        ];

  updatedSections[currentSectionIndex].sectionFields = [
    ...updatedSections[currentSectionIndex].sectionFields.filter(
      (sectionField) => sectionField.name !== field.name
    ),
  ];

  updatedSections[currentSectionIndex].sectionFieldsWithOrder = [
    ...updatedSections[currentSectionIndex].sectionFieldsWithOrder.filter(
      (sectionField) => sectionField.fieldName !== field.name
    ),
  ];

  return updatedSections;
};
