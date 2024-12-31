import { useEffect } from "react";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { SectionDetailsType } from "../../../generic/GenericForms/Shared/genericFormProps";
import { checkFieldsListContainRelatedTo } from "../../../generic/GenericForms/Shared/genericFormSharedFunctions";
import { sortFieldList } from "./FormCustomization/sortFieldList";
import { getFieldsWithOrder } from "./FormCustomization/getFieldsWithOrder";
import { IUserPreference } from "../../../../../../models/shared";
import { get } from "lodash";

export function useFormCustomization(
  modelName: string,
  moduleName: string,
  userPreferences: IUserPreference[] | undefined,
  formFieldsList: ICustomField[],
  sections: SectionDetailsType[],
  addNewSection: boolean | undefined,
  setAddNewSection: (value: boolean) => void,
  setHasFieldPreferences: (value: boolean) => void,
  setSaveCustomizationFormError: (value: boolean) => void,
  setSections: (values: SectionDetailsType[]) => void
) {
  useEffect(() => {
    if (!modelName && formFieldsList?.length <= 0) return;
    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    let defaultPreferencesForModule = get(defaultPreferences, modelName, {});
    let formCustomization = get(
      defaultPreferencesForModule,
      "formCustomizationPerModule",
      []
    );

    let updatedSections: SectionDetailsType[] = [...formCustomization];
    if (
      updatedSections &&
      updatedSections?.length > 0 &&
      formFieldsList?.length > 0
    ) {
      let combinedSectionsFieldList: ICustomField[] = [];
      updatedSections.forEach(
        (section: SectionDetailsType) =>
          (combinedSectionsFieldList = [
            ...combinedSectionsFieldList,
            ...section?.sectionFields,
          ])
      );
      let totalFieldList = [...formFieldsList]?.filter(
        (field) =>
          field.visible &&
          field.addInForm &&
          field.dataType !== SupportedDataTypes.expression &&
          !field.readOnly
      );
      let newFieldsAdded: ICustomField[] = [];
      totalFieldList?.forEach((field) => {
        let findIndexInExisting = combinedSectionsFieldList?.findIndex(
          (combinedField) => combinedField.name === field.name
        );
        if (findIndexInExisting === -1)
          newFieldsAdded = [...newFieldsAdded, field];
      });
      updatedSections.forEach(
        (section: SectionDetailsType) =>
          (section.sectionFields = formFieldsList)
      );
      const findIndexOfDetailSection = updatedSections?.findIndex(
        (updatedSection) => updatedSection.sectionName === "details"
      );
      updatedSections[findIndexOfDetailSection].sectionFieldsWithOrder = [
        ...updatedSections[findIndexOfDetailSection].sectionFieldsWithOrder,
        ...newFieldsAdded?.map((field) => {
          return {
            fieldName: field.name,
            order: field.order,
            dataType: field.dataType,
            visible: field.visible,
            readOnly: field.readOnly,
            addInForm: field.addInForm,
          };
        }),
      ];
      if (
        checkFieldsListContainRelatedTo(formFieldsList) &&
        updatedSections?.findIndex(
          (section) => section.sectionName === "relatedTo"
        ) === -1
      ) {
        updatedSections = [
          ...updatedSections,
          {
            sectionOrder: updatedSections.length++,
            sectionName: "relatedTo",
            sectionLabel: "Related To",
            sectionFields: formFieldsList,
            sectionFieldsWithOrder: [],
            columnLayout: "4",
            systemDefined: true,
          },
        ];
      }
      updatedSections?.forEach((section) => {
        if (section.sectionName === "relatedTo") {
          section.sectionFields = formFieldsList?.filter(
            (field) => field.name === "relatedTo" && field.systemDefined
          );
          section.sectionFieldsWithOrder = sortFieldList(
            getFieldsWithOrder(
              formFieldsList?.filter(
                (field) => field.name === "relatedTo" && field.systemDefined
              )
            )
          );
        }
      });
      setSections(updatedSections);
      setHasFieldPreferences(true);
    } else {
      let updatedSections = [...sections];
      if (
        checkFieldsListContainRelatedTo(formFieldsList) &&
        updatedSections?.findIndex(
          (section) => section.sectionName === "relatedTo"
        ) === -1
      ) {
        updatedSections = [
          ...updatedSections,
          {
            sectionOrder: 1,
            sectionName: "relatedTo",
            sectionLabel: "Related To",
            sectionFields: formFieldsList,
            sectionFieldsWithOrder: [],
            columnLayout: "4",
            systemDefined: true,
          },
        ];
      }
      updatedSections?.forEach((section) => {
        if (section.sectionName === "relatedTo") {
          section.sectionFields = formFieldsList?.filter(
            (field) => field.name === "relatedTo" && field.systemDefined
          );
          section.sectionFieldsWithOrder = sortFieldList(
            getFieldsWithOrder(
              formFieldsList?.filter(
                (field) => field.name === "relatedTo" && field.systemDefined
              )
            )
          );
        } else {
          section.sectionFields = formFieldsList;
          section.sectionFieldsWithOrder = sortFieldList(
            getFieldsWithOrder(
              formFieldsList?.filter((field) => field.name !== "relatedTo")
            )
          );
        }
      });
      setSections(updatedSections);
    }
  }, [userPreferences, formFieldsList, moduleName]);

  useEffect(() => {
    if (addNewSection) {
      let newSectionNumber: number = 0;
      sections?.forEach((section) => {
        if (section.sectionOrder > newSectionNumber)
          newSectionNumber = section.sectionOrder;
      });

      const updatedSections = [
        ...sections,
        {
          sectionOrder: newSectionNumber + 1,
          sectionName: `newSection-${newSectionNumber + 1}`,
          sectionLabel: `New Section ${newSectionNumber + 1}`,
          sectionFields: [],
          sectionFieldsWithOrder: [],
          columnLayout: "4",
          systemDefined: false,
        },
      ];
      setSections(updatedSections);
      setAddNewSection(false);
    }
  }, [addNewSection]);

  useEffect(() => {
    setSaveCustomizationFormError(false);
    if (sections && sections?.length > 0) {
      sections.forEach((section) => {
        if (section?.sectionLabel.trim() === "")
          setSaveCustomizationFormError(true);
      });
    }
  }, [sections]);
}
