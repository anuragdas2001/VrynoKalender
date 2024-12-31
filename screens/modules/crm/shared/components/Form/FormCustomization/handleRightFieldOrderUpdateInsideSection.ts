import { get } from "lodash";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { sortFieldList } from "./sortFieldList";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const handleRightFieldOrderUpdateInsideSection = (
  sections: SectionDetailsType[],
  section?: SectionDetailsType,
  field?: ICustomField
) => {
  const updatedSections = [...sections];
  const findIndexOfClickedField = get(
    section,
    "sectionFieldsWithOrder",
    []
  )?.findIndex((sectionField) => sectionField.fieldName === field?.name);
  if (findIndexOfClickedField <= -1) return sections;

  const findIndexOfClickedSection = updatedSections.findIndex(
    (updatedSection) => updatedSection?.sectionName === section?.sectionName
  );

  if (findIndexOfClickedSection <= -1) return sections;

  let updatedSectionFieldsOrder = [
    ...updatedSections[findIndexOfClickedSection].sectionFieldsWithOrder,
  ];

  const clickedFieldOrder = {
    fieldName: updatedSectionFieldsOrder[findIndexOfClickedField].fieldName,
    order:
      updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.dataType ===
      "relatedTo"
        ? updatedSectionFieldsOrder[findIndexOfClickedField + 2]?.order
        : updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.order,
    dataType: updatedSectionFieldsOrder[findIndexOfClickedField]?.dataType,
    visible: updatedSectionFieldsOrder[findIndexOfClickedField].visible,
    addInForm: updatedSectionFieldsOrder[findIndexOfClickedField].addInForm,
    readOnly: updatedSectionFieldsOrder[findIndexOfClickedField].readOnly,
  };
  const rightFieldOrder =
    updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.dataType ===
    "relatedTo"
      ? {
          fieldName:
            updatedSectionFieldsOrder[findIndexOfClickedField + 2]?.fieldName,
          order: updatedSectionFieldsOrder[findIndexOfClickedField]?.order,
          dataType:
            updatedSectionFieldsOrder[findIndexOfClickedField + 2]?.dataType,
          visible:
            updatedSectionFieldsOrder[findIndexOfClickedField + 2].visible,
          addInForm:
            updatedSectionFieldsOrder[findIndexOfClickedField + 2].addInForm,
          readOnly:
            updatedSectionFieldsOrder[findIndexOfClickedField + 2].readOnly,
        }
      : {
          fieldName:
            updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.fieldName,
          order: updatedSectionFieldsOrder[findIndexOfClickedField]?.order,
          dataType:
            updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.dataType,
          visible:
            updatedSectionFieldsOrder[findIndexOfClickedField + 1].visible,
          addInForm:
            updatedSectionFieldsOrder[findIndexOfClickedField + 1].addInForm,
          readOnly:
            updatedSectionFieldsOrder[findIndexOfClickedField + 1].readOnly,
        };

  updatedSectionFieldsOrder.splice(
    findIndexOfClickedField,
    1,
    clickedFieldOrder
  );
  updatedSectionFieldsOrder.splice(
    updatedSectionFieldsOrder[findIndexOfClickedField + 1]?.dataType ===
      "relatedTo"
      ? findIndexOfClickedField + 2
      : findIndexOfClickedField + 1,
    1,
    rightFieldOrder
  );
  updatedSections[findIndexOfClickedSection].sectionFieldsWithOrder = [
    ...sortFieldList(updatedSectionFieldsOrder),
  ];
  return updatedSections;
};
