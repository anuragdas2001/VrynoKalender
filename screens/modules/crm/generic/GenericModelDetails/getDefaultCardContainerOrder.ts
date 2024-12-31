import { get } from "lodash";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { v4 as uuidv4 } from "uuid";
import { ICustomField } from "../../../../../models/ICustomField";
import { SectionDetailsType } from "../GenericForms/Shared/genericFormProps";

export const getDefaultCardContainerOrder = (
  sections: SectionDetailsType[] | undefined,
  hasRelatedTo: boolean | undefined,
  currentModule: IModuleMetadata | undefined,
  fieldsList: ICustomField[] | undefined
) => {
  let order = 0;
  let updatedCardContainerOrder: {
    id: string;
    name: string;
    label: string;
    type: string;
    order: number;
    metadata?: Record<string, any>;
  }[] = [];

  let updatedSections: SectionDetailsType[] | undefined = [];
  sections?.forEach((section) => {
    const findIndex = updatedSections?.findIndex(
      (updatedSection) =>
        JSON.stringify(updatedSection) === JSON.stringify(section)
    );
    if (findIndex === -1 && updatedSections) {
      updatedSections = [...updatedSections, section];
    }
  });

  updatedSections
    ?.filter((section) => {
      if (hasRelatedTo) return section;
      else if (section.sectionName === "relatedTo") return null;
      else return section;
    })
    ?.map((section) => section)
    ?.forEach(
      (section) =>
        (updatedCardContainerOrder = [
          ...updatedCardContainerOrder,
          {
            id: uuidv4(),
            name: section?.sectionName,
            label: section?.sectionLabel,
            type:
              section.sectionName === "relatedTo" && hasRelatedTo
                ? "relatedTo"
                : "section",
            order: order++,
          },
        ])
    );
  updatedCardContainerOrder = [
    ...updatedCardContainerOrder,
    {
      id: uuidv4(),
      name: "openActivities",
      label: "Open Activities",
      type: "activity",
      order: order++,
    },
    {
      id: uuidv4(),
      name: "closedActivities",
      label: "Closed Activities",
      type: "activity",
      order: order++,
    },
  ];
  currentModule?.reverseLookups
    ?.filter((reverseLookup) => reverseLookup.moduleName !== "")
    .forEach(
      (reverseLookup) =>
        (updatedCardContainerOrder = [
          ...updatedCardContainerOrder,
          {
            id: uuidv4(),
            type: "reverseLookup",
            name: `${get(reverseLookup, "fieldUniqueName")}`,
            label: `${get(reverseLookup?.displayedAs, "en", "moduleName")}`,
            order: order++,
          },
        ])
    );

  fieldsList?.forEach((field) => {
    if (
      field.dataType === "multiSelectRecordLookup" &&
      field.visible &&
      field.dataTypeMetadata?.isSubform
    ) {
      updatedCardContainerOrder = [
        ...updatedCardContainerOrder,
        {
          id: uuidv4(),
          type: "subForm",
          name: field.name,
          label: field.label.en,
          order: order++,
          metadata: { field: field },
        },
      ];
    }
  });
  updatedCardContainerOrder = [
    ...updatedCardContainerOrder,
    {
      id: uuidv4(),
      type: "notes",
      name: "Notes",
      label: "Notes",
      order: order++,
    },
    {
      id: uuidv4(),
      type: "attachments",
      name: "Attachments",
      label: "Attachments",
      order: order++,
    },
    {
      id: uuidv4(),
      type: "timeline",
      name: "Timeline",
      label: "Timeline",
      order: order++,
    },
    {
      id: uuidv4(),
      type: "email",
      name: "Emails",
      label: "Emails",
      order: order++,
    },
  ];
  return updatedCardContainerOrder;
};
