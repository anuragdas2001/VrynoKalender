import React from "react";
import LeftIcon from "remixicon-react/ArrowLeftSLineIcon";
import RightIcon from "remixicon-react/ArrowRightSLineIcon";
import UpIcon from "remixicon-react/ArrowUpSLineIcon";
import DownIcon from "remixicon-react/ArrowDownSLineIcon";
import { ICustomField } from "../../../../models/ICustomField";
import { leftFieldInSectionFieldListFunc } from "./leftFieldInSectionFieldListWithOrder";
import { rightFieldInSectionFieldListFunc } from "./rightFieldInSectionFieldListWithOrder";
import { upFieldInSectionFieldListFunc } from "./upFieldInSectionFieldListFunc";
import { downFieldInSectionFieldListFunc } from "./downFieldInSectionFieldListFunc";
import Button from "../Button/Button";
import { SectionDetailsType } from "../../../../screens/modules/crm/generic/GenericForms/Shared/genericFormProps";

export type InlineSectionControlProps = {
  sectionFieldList: ICustomField[];
  fieldIndex: number;
  field?: ICustomField;
  sectionDetails?: SectionDetailsType;
  sectionFieldListWithOrder?: {
    fieldName: string;
    order: number;
    dataType: string;
  }[];
  handleLeftFieldOrderUpdateInsideSection: () => void;
  handleUpFieldOrderUpdateInsideSection: () => void;
  handleRightFieldOrderUpdateInsideSection: () => void;
  handleDownFieldOrderUpdateInsideSection: () => void;
};

export const InlineSectionControl = ({
  sectionFieldList,
  fieldIndex,
  field,
  sectionDetails,
  sectionFieldListWithOrder,
  handleDownFieldOrderUpdateInsideSection = () => {},
  handleLeftFieldOrderUpdateInsideSection = () => {},
  handleRightFieldOrderUpdateInsideSection = () => {},
  handleUpFieldOrderUpdateInsideSection = () => {},
}: InlineSectionControlProps) => {
  let currentSelectedField = sectionFieldList[fieldIndex];
  let findFieldIndexInSectionFieldListWithOrder =
    sectionFieldListWithOrder?.findIndex(
      (sectionFieldWithOrder) =>
        sectionFieldWithOrder?.fieldName === currentSelectedField?.name
    );

  let leftFieldInSectionFieldList: ICustomField | undefined =
    leftFieldInSectionFieldListFunc(
      findFieldIndexInSectionFieldListWithOrder,
      sectionFieldListWithOrder,
      sectionFieldList
    );

  let rightFieldInSectionFieldList: ICustomField | undefined =
    rightFieldInSectionFieldListFunc(
      findFieldIndexInSectionFieldListWithOrder,
      sectionFieldListWithOrder,
      sectionFieldList
    );

  let upFieldInSectionFieldList: ICustomField | undefined =
    upFieldInSectionFieldListFunc(
      sectionDetails,
      findFieldIndexInSectionFieldListWithOrder,
      sectionFieldListWithOrder,
      sectionFieldList
    );

  let downFieldInSectionFieldList: ICustomField | undefined =
    downFieldInSectionFieldListFunc(
      sectionDetails,
      findFieldIndexInSectionFieldListWithOrder,
      sectionFieldListWithOrder,
      sectionFieldList
    );

  return (
    <div className={`flex items-center`}>
      <div>
        <Button
          id={`${field?.name}-inline-section-left-icon`}
          customStyle=""
          onClick={
            !leftFieldInSectionFieldList ||
            leftFieldInSectionFieldList?.dataType === "recordImage"
              ? () => {}
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLeftFieldOrderUpdateInsideSection();
                }
          }
          userEventName="inline-section-left-btn:action-click"
        >
          <LeftIcon
            className={`${
              !leftFieldInSectionFieldList ||
              leftFieldInSectionFieldList?.dataType === "recordImage"
                ? "text-gray-300"
                : "cursor-pointer hover:text-vryno-theme-light-blue"
            }`}
          />
        </Button>
      </div>
      <div className="flex flex-col gap-y-4">
        <Button
          id={`${field?.name}-inline-section-up-icon`}
          customStyle=""
          onClick={
            !upFieldInSectionFieldList ||
            upFieldInSectionFieldList?.dataType === "recordImage"
              ? () => {}
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpFieldOrderUpdateInsideSection();
                }
          }
          userEventName="inline-section-up-btn:action-click"
        >
          <UpIcon
            className={`${
              !upFieldInSectionFieldList ||
              upFieldInSectionFieldList?.dataType === "recordImage"
                ? "text-gray-300"
                : "cursor-pointer hover:text-vryno-theme-light-blue"
            }`}
          />
        </Button>
        <Button
          id={`${field?.name}-inline-section-down-icon`}
          customStyle=""
          onClick={
            !downFieldInSectionFieldList ||
            downFieldInSectionFieldList?.dataType === "recordImage"
              ? () => {}
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDownFieldOrderUpdateInsideSection();
                }
          }
          userEventName="inline-section-down-btn:action-click"
        >
          <DownIcon
            className={`${
              !downFieldInSectionFieldList ||
              downFieldInSectionFieldList?.dataType === "recordImage"
                ? "text-gray-300"
                : "cursor-pointer hover:text-vryno-theme-light-blue"
            }`}
          />
        </Button>
      </div>
      <div>
        <Button
          id={`${field?.name}-inline-section-right-icon`}
          customStyle=""
          onClick={
            !rightFieldInSectionFieldList ||
            rightFieldInSectionFieldList?.dataType === "recordImage"
              ? () => {}
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRightFieldOrderUpdateInsideSection();
                }
          }
          userEventName="inline-section-right-btn:action-click"
        >
          <RightIcon
            className={`${
              !rightFieldInSectionFieldList ||
              rightFieldInSectionFieldList?.dataType === "recordImage"
                ? "text-gray-300"
                : "cursor-pointer hover:text-vryno-theme-light-blue"
            }`}
          />
        </Button>
      </div>
    </div>
  );
};
