import { ICustomField } from "../../../models/ICustomField";
import React from "react";
import { DetailFieldValuePerDatatype } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import Link from "next/link";
import { GenericListHeaderType } from "./GenericList";
import { BaseGenericObjectType, SupportedApps } from "../../../models/shared";

export const GenericTableCellWrapper = <T extends BaseGenericObjectType>({
  item,
  header,
  rowUrlGenerator,
  handleRowClick,
  showIcons,
  fieldsList,
  onDetail = false,
  modelName,
  outerIndex,
  alignText = "text-left",
  target,
  imageSize,
  includeUrlWithRender,
  dataProcessed,
  dataProcessing,
  truncate,
  includeFlagInPhoneNumber,
  isLinkEnabled,
  openingRecordId = null,
  viewType = "List",
  richTextOverflowScroll,
  setOpeningRecordId = () => {},
  showFieldEditInput,
  appName,
  updateModelFieldData,
  columnFixedWidth,
}: {
  item: T;
  header: GenericListHeaderType;
  rowUrlGenerator?: (id: string | Record<string, string> | any) => string;
  handleRowClick?: (id: string | Record<string, string> | any) => void;
  showIcons?: boolean;
  fieldsList?: ICustomField[];
  onDetail?: boolean;
  modelName?: string;
  outerIndex: number;
  alignText?: "text-center" | "text-left" | "text-right";
  target: "_self" | "_blank";
  imageSize?: string;
  includeUrlWithRender?: boolean;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  truncate?: boolean;
  includeFlagInPhoneNumber?: boolean;
  isLinkEnabled: boolean;
  openingRecordId?: string | null;
  viewType?: "Card" | "List";
  richTextOverflowScroll?: boolean;
  setOpeningRecordId?: (value: string | null) => void;
  showFieldEditInput?: boolean;
  appName?: SupportedApps;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  columnFixedWidth?: string;
}) => {
  if (header.render) {
    const internalComponent = header.render(item, outerIndex);
    if (includeUrlWithRender && (rowUrlGenerator || handleRowClick)) {
      return (
        <Link
          href={rowUrlGenerator ? rowUrlGenerator(item) : ""}
          passHref
          legacyBehavior
        >
          <a
            data-testid={`${header.columnName}-${outerIndex}`}
            id={`${header.label}-${outerIndex}`}
            className={`px-6 py-3 block ${
              openingRecordId && openingRecordId === item?.id
                ? "cursor-default"
                : "cursor-pointer"
            } ${!isLinkEnabled ? "pointer-events-none opacity-60" : ""} ${
              columnFixedWidth || ""
            }`}
            target={target}
            onClick={
              openingRecordId && openingRecordId === item?.id
                ? () => {}
                : (e) => {
                    if (e.ctrlKey) {
                    } else {
                      handleRowClick && e.preventDefault();
                      handleRowClick && e.stopPropagation();
                      handleRowClick && handleRowClick(item);
                      rowUrlGenerator ? setOpeningRecordId(item.id) : null;
                    }
                  }
            }
            aria-disabled={!isLinkEnabled}
          >
            <span className="text-vryno-card-value text-xsm">
              {internalComponent}
            </span>
          </a>
        </Link>
      );
    }
    return internalComponent ? (
      <span
        data-testid={`${header.columnName}-${outerIndex}`}
        id={`${header.label}-${outerIndex}`}
        className={`px-6 py-3 block ${
          openingRecordId && openingRecordId === item?.id
            ? "cursor-default"
            : "cursor-pointer"
        } ${columnFixedWidth || ""}`}
      >
        <span className="text-vryno-card-value text-xsm">
          {internalComponent}
        </span>
      </span>
    ) : null;
  }

  return (
    <GenericTableCell
      {...{
        item,
        header,
        rowUrlGenerator,
        handleRowClick,
        showIcons,
        fieldsList,
        onDetail,
        modelName,
        alignText,
        target,
        imageSize,
        outerIndex,
        dataProcessed,
        dataProcessing,
        truncate,
        includeFlagInPhoneNumber,
        isLinkEnabled,
        viewType,
        openingRecordId,
        richTextOverflowScroll,
        setOpeningRecordId,
        showFieldEditInput,
        appName,
        updateModelFieldData,
        columnFixedWidth,
      }}
    />
  );
};

const GenericTableCell = <T extends BaseGenericObjectType>({
  item,
  header,
  rowUrlGenerator,
  handleRowClick,
  showIcons,
  fieldsList,
  onDetail = false,
  modelName,
  alignText = "text-left",
  target,
  imageSize,
  outerIndex,
  dataProcessed,
  dataProcessing,
  truncate = false,
  includeFlagInPhoneNumber = true,
  isLinkEnabled,
  viewType,
  openingRecordId = null,
  richTextOverflowScroll,
  setOpeningRecordId = () => {},
  showFieldEditInput = false,
  appName,
  updateModelFieldData,
  columnFixedWidth,
}: {
  item: T;
  header: GenericListHeaderType;
  rowUrlGenerator?: (id: string | Record<string, string> | any) => string;
  handleRowClick?: (id: string | Record<string, string> | any) => void;
  showIcons?: boolean;
  fieldsList?: ICustomField[];
  onDetail?: boolean;
  modelName?: string;
  alignText?: "text-center" | "text-left" | "text-right";
  target: "_self" | "_blank";
  imageSize?: string;
  outerIndex: number;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  truncate?: boolean;
  viewType?: "List" | "Card";
  includeFlagInPhoneNumber?: boolean;
  isLinkEnabled: boolean;
  openingRecordId?: string | null;
  richTextOverflowScroll?: boolean;
  setOpeningRecordId?: (value: string | null) => void;
  showFieldEditInput?: boolean;
  appName?: SupportedApps;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  columnFixedWidth?: string;
}) => {
  const actualData = (
    <span
      id={`${header.label}-${outerIndex}`}
      className={`px-6 py-3 block w-full h-full ${alignText} ${
        truncate && header.dataType !== "multiSelectRecordLookup"
          ? "max-w-[240px]"
          : ""
      } ${columnFixedWidth || ""}`}
    >
      <DetailFieldValuePerDatatype
        field={{
          label: header.label,
          value: header.columnName,
          dataType: header.dataType,
          field: fieldsList?.filter(
            (field) => field.name === header.columnName
          )[0],
        }}
        dataProcessed={dataProcessed}
        dataProcessing={dataProcessing}
        data={item}
        headerVisible={true}
        fontSize={{
          header: "text-sm",
          value: "text-xsm",
        }}
        fontColor={
          header.columnName === "name"
            ? rowUrlGenerator || handleRowClick
              ? "text-vryno-theme-light-blue"
              : ""
            : ""
        }
        truncateData={typeof truncate === "boolean" ? truncate : true}
        isSample={item.isSample}
        onDetail={onDetail}
        modelName={modelName}
        showIcons={showIcons}
        from={"table"}
        imageSize={imageSize}
        viewType={viewType}
        includeFlagInPhoneNumber={includeFlagInPhoneNumber}
        fieldsList={fieldsList}
        richTextOverflowScroll={richTextOverflowScroll}
        showFieldEditInput={showFieldEditInput}
        appName={appName}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={columnFixedWidth}
      />
    </span>
  );
  const linkTagClasses = `h-full w-full block ${
    !isLinkEnabled ? "pointer-events-none opacity-60" : ""
  } ${columnFixedWidth || ""}`;

  if (
    rowUrlGenerator &&
    rowUrlGenerator(item) &&
    rowUrlGenerator(item) !== "#"
  ) {
    return (
      <Link href={`${rowUrlGenerator(item)}`} passHref legacyBehavior>
        <a
          id={`${header.label}-${outerIndex}`}
          onClick={
            openingRecordId && openingRecordId === item?.id
              ? (e) => {}
              : (e) => {
                  if (e.ctrlKey) {
                  } else {
                    handleRowClick && handleRowClick(item);
                    setOpeningRecordId(item?.id);
                  }
                }
          }
          className={linkTagClasses}
          target={target}
          aria-disabled={!isLinkEnabled}
        >
          {actualData}
        </a>
      </Link>
    );
  }

  if (handleRowClick) {
    return (
      <div
        id={`${header.label}-${outerIndex}`}
        className={`cursor-pointer ${linkTagClasses} ${columnFixedWidth || ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRowClick && handleRowClick(item);
        }}
        aria-disabled={!isLinkEnabled}
      >
        {actualData}
      </div>
    );
  }

  return actualData;
};
