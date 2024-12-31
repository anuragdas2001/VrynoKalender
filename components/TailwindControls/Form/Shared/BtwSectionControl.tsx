import React from "react";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import Button from "../Button/Button";
import { ICustomField } from "../../../../models/ICustomField";
import { SectionDetailsType } from "../../../../screens/modules/crm/generic/GenericForms/Shared/genericFormProps";

export type BtwSectionControlProps = {
  sections?: SectionDetailsType[];
  field?: ICustomField;
  sectionDetails?: SectionDetailsType;
  allSectionsLength?: number;
  handleUpSectionOrder?: (section?: SectionDetailsType) => void;
  handleDownSectionOrder?: (section?: SectionDetailsType) => void;
};

export const BtwSectionControl = ({
  sections,
  field,
  sectionDetails,
  allSectionsLength = 0,
  handleUpSectionOrder = () => {},
  handleDownSectionOrder = () => {},
}: BtwSectionControlProps) => {
  if (!sections || typeof sectionDetails?.sectionOrder !== "number")
    return null;

  let upSectionName: SectionDetailsType | undefined;
  let downSectionName: SectionDetailsType | undefined;

  sections.forEach((section, index) => {
    if (sectionDetails.sectionOrder === section.sectionOrder) {
      if (sections[index + 1]?.sectionName === "relatedTo") {
        downSectionName = sections[index + 2];
      } else {
        downSectionName = sections[index + 1];
      }

      if (sections[index - 1]?.sectionName === "relatedTo") {
        upSectionName = sections[index - 2];
      } else {
        upSectionName = sections[index - 1];
      }
    }
  });

  return (
    <div className="flex flex-col gap-y-2 items-center">
      <Button
        id={`${field?.name}-btw-section-up-arrow-icon`}
        onClick={
          !upSectionName || upSectionName?.sectionName === "relatedTo"
            ? () => {}
            : (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpSectionOrder(upSectionName);
              }
        }
        customStyle={`w-7 h-7 rounded-md flex justify-center items-center ${
          !upSectionName || upSectionName?.sectionName === "relatedTo"
            ? "bg-vryno-theme-blue-disable"
            : "bg-vryno-theme-light-blue cursor-pointer"
        }`}
        userEventName="btw-section-up-arrow:action-click"
      >
        <ArrowUpIcon size={18} className="text-white" />
      </Button>
      <Button
        id={`${field?.name}-btw-section-down-arrow-icon`}
        onClick={
          !downSectionName || downSectionName?.sectionName === "relatedTo"
            ? () => {}
            : (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownSectionOrder(downSectionName);
              }
        }
        customStyle={`w-7 h-7 rounded-md flex justify-center items-center ${
          !downSectionName || downSectionName?.sectionName === "relatedTo"
            ? "bg-vryno-theme-blue-disable"
            : "bg-vryno-theme-light-blue cursor-pointer"
        }`}
        userEventName="btw-section-down-arrow:action-click"
      >
        <ArrowDownIcon size={18} className="text-white" />
      </Button>
    </div>
  );
};
