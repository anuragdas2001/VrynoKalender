import React from "react";
import Button from "../../../../../../../../components/TailwindControls/Form/Button/Button";
import { handleMoveSectionUp } from "../handleMoveSectionUp";
import { handleMoveSectionDown } from "../handleMoveSectionDown";
import { SectionDetailsType } from "../../../../../generic/GenericForms/Shared/genericFormProps";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";

export type SectionMoveProps = {
  index: number;
  formCustomization: boolean;
  sections: SectionDetailsType[];
  section: SectionDetailsType;
  setSections: (value: SectionDetailsType[]) => void;
};

export const SectionMove = ({
  index,
  formCustomization,
  sections,
  section,
  setSections,
}: SectionMoveProps) => {
  return (
    <div
      className={`${
        formCustomization ? "col-span-1 " : "hidden"
      } flex gap-x-2 justify-end`}
    >
      <Button
        id="formField-up-arrow-icon"
        onClick={
          index === 0
            ? () => {}
            : () => setSections(handleMoveSectionUp(sections, section))
        }
        customStyle={`cursor-pointer flex w-7 h-7 rounded-md justify-center items-center ${
          index === 0
            ? "bg-vryno-theme-blue-disable"
            : "bg-vryno-theme-light-blue"
        }`}
        userEventName="formField-up-arrow:action-click"
      >
        <ArrowUpIcon size={18} className="text-white" />
      </Button>
      <Button
        id="formField-down-arrow-icon"
        onClick={
          index === sections?.length - 1
            ? () => {}
            : () => setSections(handleMoveSectionDown(sections, section))
        }
        customStyle={`cursor-pointer flex w-7 h-7 rounded-md justify-center items-center ${
          index === sections?.length - 1
            ? "bg-vryno-theme-blue-disable"
            : "bg-vryno-theme-light-blue"
        }`}
        userEventName="formField-down-arrow:action-click"
      >
        <ArrowDownIcon size={18} className="text-white" />
      </Button>
    </div>
  );
};
