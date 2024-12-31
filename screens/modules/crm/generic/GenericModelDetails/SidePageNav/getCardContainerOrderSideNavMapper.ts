import { capitalCase } from "change-case";
import { checkOrder } from "../../../shared/utils/checkOrderAndUpdateOrder";
import { SectionDetailsType } from "../../GenericForms/Shared/genericFormProps";

export const getCardContainerOrderSideNavMapper = (
  cardContainerOrder: {
    id: string;
    label: string;
    name: string;
    type: string;
    order: number;
    metadata?: Record<string, any>;
  }[],
  sections: SectionDetailsType[],
  openActivityCount: number,
  closeActivityCount: number,
  notesCount: number,
  attachmentsCount: number,
  emailCount: number,
  reverseRecordLookupsCount?: { label: string; value: string; count: number }[],
  subFormsCount?: { label: string; value: string; count: number }[]
) => {
  const updatedCardContainerOrder: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number;
  }[] = cardContainerOrder.map((cardContainer) => {
    if (cardContainer?.type === "section") {
      const sectionIndex = sections?.findIndex(
        (section) => section.sectionName === cardContainer?.name
      );
      if (sectionIndex === -1 || sectionIndex === undefined || !sections) {
        return {
          id: cardContainer?.id,
          label: cardContainer?.name,
          value: cardContainer?.name,
          name: cardContainer?.name,
          type: cardContainer?.type,
          order: cardContainer?.order,
        };
      }
      return {
        id: cardContainer?.id,
        label: sections[sectionIndex].sectionLabel,
        value: sections[sectionIndex].sectionLabel,
        name: cardContainer?.name,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    }
    if (
      cardContainer?.type === "activity" &&
      cardContainer?.name === "openActivities"
    )
      return {
        id: cardContainer?.id,
        label: capitalCase(cardContainer?.name),
        value: cardContainer?.name,
        name: cardContainer?.name,
        count: openActivityCount,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    if (
      cardContainer?.type === "activity" &&
      cardContainer?.name === "closedActivities"
    )
      return {
        id: cardContainer?.id,
        label: capitalCase(cardContainer?.name),
        value: cardContainer?.name,
        name: cardContainer?.name,
        count: closeActivityCount,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    if (cardContainer?.type === "notes")
      return {
        id: cardContainer?.id,
        label: cardContainer?.name,
        value: cardContainer?.name,
        name: cardContainer?.name,
        count: notesCount,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    if (cardContainer?.type === "attachments")
      return {
        id: cardContainer?.id,
        label: cardContainer?.name,
        value: cardContainer?.name,
        name: cardContainer?.name,
        count: attachmentsCount,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    if (cardContainer?.type === "reverseLookup") {
      const reverseLookupIndex: number | undefined =
        reverseRecordLookupsCount?.findIndex(
          (reverseLookup) => cardContainer?.name === reverseLookup?.value
        );
      if (
        reverseLookupIndex === -1 ||
        !reverseRecordLookupsCount ||
        reverseLookupIndex === undefined
      ) {
        return {
          id: cardContainer?.id,
          label: cardContainer?.label,
          value: cardContainer?.name,
          name: cardContainer?.name,
          count: 0,
          type: cardContainer?.type,
          order: cardContainer?.order,
        };
      } else {
        return {
          id: cardContainer?.id,
          label: cardContainer?.label,
          value: reverseRecordLookupsCount[reverseLookupIndex]?.label,
          name: cardContainer?.name,
          count: reverseRecordLookupsCount[reverseLookupIndex]?.count,
          type: cardContainer?.type,
          order: cardContainer?.order,
        };
      }
    }
    if (cardContainer?.type === "subForm") {
      const subFormIndex: number | undefined = subFormsCount?.findIndex(
        (subForm) => cardContainer?.name === subForm?.value
      );
      if (subFormIndex === -1 || !subFormsCount || subFormIndex === undefined) {
        return {
          id: cardContainer?.id,
          label: cardContainer?.label,
          value: cardContainer?.name,
          name: cardContainer?.name,
          count: 0,
          type: cardContainer?.type,
          order: cardContainer?.order,
          metadata: cardContainer?.metadata || null,
        };
      } else {
        return {
          id: cardContainer?.id,
          label: cardContainer?.label,
          value: subFormsCount[subFormIndex]?.value,
          name: cardContainer?.name,
          count: subFormsCount[subFormIndex]?.count,
          type: cardContainer?.type,
          order: cardContainer?.order,
          metadata: cardContainer?.metadata || null,
        };
      }
      // return {
      //   id: cardContainer?.id,
      //   label: cardContainer?.label,
      //   value: cardContainer?.name,
      //   name: cardContainer?.name,
      //   // count: reverseRecordLookupsCount[reverseLookupIndex]?.count,
      //   type: cardContainer?.type,
      //   order: cardContainer?.order,
      //   metadata: cardContainer?.metadata || null,
      // };
    }
    if (cardContainer?.type === "email")
      return {
        id: cardContainer?.id,
        label: cardContainer?.name,
        value: cardContainer?.name,
        name: cardContainer?.name,
        count: emailCount,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
    else
      return {
        id: cardContainer?.id,
        label: cardContainer?.label,
        value: cardContainer?.name,
        name: cardContainer?.name,
        type: cardContainer?.type,
        order: cardContainer?.order,
      };
  });

  if (checkOrder(updatedCardContainerOrder)) {
    updatedCardContainerOrder
      ?.slice()
      .sort((itemOne, itemTwo) =>
        (itemOne?.order as number) >= (itemTwo?.order as number) ? 1 : -1
      );

    return updatedCardContainerOrder.map((item, index) => {
      return { ...item, order: index };
    });
  }

  return updatedCardContainerOrder;
};
