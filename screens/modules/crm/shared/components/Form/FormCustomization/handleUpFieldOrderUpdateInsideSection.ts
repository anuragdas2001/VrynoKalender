import { get } from "lodash";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { sortFieldList } from "./sortFieldList";
import { SectionDetailsType } from "../../../../generic/GenericForms/Shared/genericFormProps";

export const handleUpFieldOrderUpdateInsideSection = (
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
    fieldName: updatedSectionFieldsOrder[findIndexOfClickedField]?.fieldName,
    order:
      updatedSectionFieldsOrder[
        findIndexOfClickedField - Number(section?.columnLayout)
      ]?.dataType === "relatedTo"
        ? updatedSectionFieldsOrder[
            findIndexOfClickedField - Number(section?.columnLayout) - 1
          ]?.order
        : updatedSectionFieldsOrder[
            findIndexOfClickedField - Number(section?.columnLayout)
          ]?.order,
    dataType: updatedSectionFieldsOrder[findIndexOfClickedField]?.dataType,
    visible: updatedSectionFieldsOrder[findIndexOfClickedField].visible,
    addInForm: updatedSectionFieldsOrder[findIndexOfClickedField].addInForm,
    readOnly: updatedSectionFieldsOrder[findIndexOfClickedField].readOnly,
  };
  const UpFieldOrder =
    updatedSectionFieldsOrder[
      findIndexOfClickedField - Number(section?.columnLayout)
    ]?.dataType === "relatedTo"
      ? {
          fieldName:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout) - 1
            ]?.fieldName,
          order: updatedSectionFieldsOrder[findIndexOfClickedField]?.order,
          dataType:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout) - 1
            ]?.dataType,
          visible:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout) - 1
            ].visible,
          addInForm:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout) - 1
            ].addInForm,
          readOnly:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout) - 1
            ].readOnly,
        }
      : {
          fieldName:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout)
            ]?.fieldName,
          order: updatedSectionFieldsOrder[findIndexOfClickedField].order,
          dataType:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout)
            ]?.dataType,
          visible:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout)
            ].visible,
          addInForm:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout)
            ].addInForm,
          readOnly:
            updatedSectionFieldsOrder[
              findIndexOfClickedField - Number(section?.columnLayout)
            ].readOnly,
        };

  updatedSectionFieldsOrder.splice(
    findIndexOfClickedField,
    1,
    clickedFieldOrder
  );
  updatedSectionFieldsOrder.splice(
    updatedSectionFieldsOrder[
      findIndexOfClickedField - Number(section?.columnLayout)
    ]?.dataType === "relatedTo"
      ? findIndexOfClickedField - Number(section?.columnLayout) - 1
      : findIndexOfClickedField - Number(section?.columnLayout),
    1,
    UpFieldOrder
  );
  updatedSections[findIndexOfClickedSection].sectionFieldsWithOrder = [
    ...sortFieldList(updatedSectionFieldsOrder),
  ];
  return updatedSections;
};
