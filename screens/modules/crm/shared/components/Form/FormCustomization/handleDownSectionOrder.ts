import { ICustomField } from "../../../../../../../models/ICustomField";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const handleDownSectionOrder = (
  sections: SectionDetailsType[],
  sectionDetails?: SectionDetailsType,
  field?: ICustomField,
  sectionName?: string,
  downSection?: SectionDetailsType
) => {
  const updatedSections = [...sections];
  if (!downSection || !field || !sectionName) return sections;
  const currentSectionIndex = sections.findIndex(
    (section) => section.sectionName === sectionDetails?.sectionName
  );
  const downSectionIndex = sections.findIndex(
    (section) => section.sectionName === downSection.sectionName
  );

  updatedSections[downSectionIndex].sectionFields = [
    ...updatedSections[downSectionIndex].sectionFields,
    field,
  ];

  let highestIndexInDetailsPage: number = -1;
  updatedSections[downSectionIndex].sectionFieldsWithOrder.forEach((field) => {
    if (field.order > highestIndexInDetailsPage)
      highestIndexInDetailsPage = field.order;
  });

  updatedSections[downSectionIndex].sectionFieldsWithOrder =
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
          ...updatedSections[downSectionIndex].sectionFieldsWithOrder,
        ]
      : [
          ...updatedSections[downSectionIndex].sectionFieldsWithOrder,
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
