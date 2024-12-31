import React from "react";
import Link from "next/link";
import { GenericListHeaderType } from "../Lists/GenericList";
import { DetailFieldPerDataType } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldPerDataType";
import ExpandCollapseIcon from "./ExpandCollapseIcon";
import { appsUrlGenerator } from "../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { getAppPathParts } from "../../../screens/modules/crm/shared/utils/getAppPathParts";
import { AllowedViews } from "../../../models/allowedViews";
import { MixpanelActions } from "../../../screens/Shared/MixPanel";
import { kebabCase } from "lodash";
import { DetailFieldValuePerDatatype } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import { ICustomField } from "../../../models/ICustomField";
import { Loading } from "../Loading/Loading";
import { BaseGenericObjectType, SupportedApps } from "../../../models/shared";

export type GenericCardType<T extends BaseGenericObjectType> = {
  children?: React.ReactElement;
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  data: T;
  fieldsList?: ICustomField[];
  headerLink?: string;
  selectedItems?: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  cardSelector?: boolean;
  modelName: string;
  getExtendedValue?: (extended: boolean) => void;
  innerMaxHeight: string;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  cardDragging?: boolean;
  cardHeading?: string;
  headingColor?: string;
  checkForDelete?: boolean;
  deleteSessionData?: any;
  openingRecordId?: string | null;
  setOpeningRecordId?: (value: string | null) => void;
  imageServiceName?: SupportedApps.crm | SupportedApps.accounts;
  imageServiceModelName?: string;
  imageServiceSubdomain?: string;
};

export default function GenericCard<T extends BaseGenericObjectType>({
  children,
  visibleHeaders,
  hideShowHeaders,
  data,
  fieldsList,
  headerLink,
  selectedItems,
  onItemSelect,
  cardSelector = true,
  modelName,
  dataProcessed,
  dataProcessing,
  getExtendedValue = (extended: boolean) => {},
  innerMaxHeight,
  cardDragging = false,
  cardHeading = "",
  headingColor = "",
  checkForDelete = false,
  deleteSessionData,
  openingRecordId = null,
  setOpeningRecordId = () => {},
  imageServiceName,
  imageServiceModelName,
  imageServiceSubdomain,
}: GenericCardType<T>) {
  const [showDetails, setShowDetails] = React.useState(false);
  const { appName } = getAppPathParts();
  let isLinkEnabled = !checkForDelete;
  if (checkForDelete && deleteSessionData) {
    if (
      !Object.keys(deleteSessionData)?.length ||
      !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
      !data?.id
    ) {
      isLinkEnabled = true;
    } else {
      const idArray: string[] = [];
      for (const key in deleteSessionData?.[modelName]) {
        idArray.push(...deleteSessionData?.[modelName][key]);
      }
      isLinkEnabled = idArray.includes(data.id) ? false : true;
    }
  }

  return (
    <div className={`w-full h-full`}>
      {headerLink && (
        <Link href={headerLink} legacyBehavior>
          <a
            id={`details-${data?.id}`}
            className={`text-align-right block hover:shadow-lg focus-within:shadow-lg z-[1] after:content-[' '] ${
              !isLinkEnabled ? "pointer-events-none opacity-60" : ""
            }`}
            onClick={() => {
              setOpeningRecordId(data?.id);
            }}
            aria-disabled={!isLinkEnabled}
          />
        </Link>
      )}
      <div
        style={{
          paddingBottom: "30px",
        }}
        className={`${
          [...visibleHeaders, ...hideShowHeaders]?.filter(
            (header) => header.dataType === "recordImage"
          )?.length > 0
            ? "items-center self-center w-full flex justify-center"
            : "hidden"
        }`}
      >
        <div
          style={{
            width: "50%",
            display: "block",
            position: "relative",
          }}
          className={`z-[1]`}
        >
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              margin: "0 auto -50%",
              position: "relative",
            }}
          >
            {[...visibleHeaders, ...hideShowHeaders]
              ?.filter((header) => header.dataType === "recordImage")
              .map((header, index) => (
                <div
                  className={`p-1 rounded-full`}
                  style={{ background: "#f2f7fa" }}
                  key={index}
                >
                  <DetailFieldValuePerDatatype
                    field={{
                      label: header.label,
                      value: header.columnName,
                      dataType: header.dataType,
                      field: header.field,
                    }}
                    data={data}
                    headerVisible={true}
                    fontSize={{ header: "text-xsm", value: "text-xsm" }}
                    fontColor={
                      header.columnName === "name"
                        ? headerLink
                          ? "text-vryno-theme-light-blue"
                          : ""
                        : ""
                    }
                    key={index}
                    modelName={modelName}
                    onDetail={false}
                    isSample={false}
                    dataProcessed={dataProcessed}
                    dataProcessing={dataProcessing}
                    fieldsList={fieldsList}
                    customOpacity={!isLinkEnabled ? "opacity-60" : null}
                    imageServiceName={imageServiceName}
                    imageServiceModelName={imageServiceModelName}
                    imageServiceSubdomain={imageServiceSubdomain}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <Link
        href={`${
          headerLink
            ? headerLink
            : appName && modelName
            ? appsUrlGenerator(
                appName,
                modelName,
                AllowedViews.detail,
                data.id as string
              )
            : ""
        }`}
        passHref
        legacyBehavior
      >
        <a
          className={`block relative px-5 pt-5 pb-3 w-full rounded-xl shadow-sm  ${
            openingRecordId && openingRecordId === data?.id
              ? "bg-vryno-theme-item-loading-background"
              : cardDragging
              ? "bg-vryno-active-kanban-card"
              : "bg-white block"
          } ${
            headerLink && !(openingRecordId && openingRecordId === data?.id)
              ? "hover:shadow-lg focus-within:shadow-lg cursor-pointer"
              : "cursor-auto"
          } ${!isLinkEnabled ? "pointer-events-none opacity-60" : ""}`}
          onClick={
            openingRecordId && openingRecordId === data?.id
              ? (e) => {}
              : (e) => {
                  if (e.ctrlKey) {
                  } else {
                    setOpeningRecordId(data?.id);
                  }
                }
          }
          aria-disabled={!isLinkEnabled}
        >
          <div className="flex justify-between items-center">
            {cardSelector && (
              <div className={`col-span-11 text-gray-400 text-left`}>
                {selectedItems?.filter((sItem) => sItem.id === data.id)
                  .length === 0 ? (
                  <input
                    id={`${kebabCase(modelName)}-select-${data.id}`}
                    type="checkbox"
                    name="list_checkbox"
                    checked={false}
                    readOnly={true}
                    className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                    style={{ width: "18px", height: "18px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLinkEnabled) return;
                      onItemSelect(data);
                      MixpanelActions.track(
                        `${modelName}-card-item-select-${data.id}:action-click`,
                        { type: "click" }
                      );
                    }}
                  />
                ) : (
                  <input
                    id={`${kebabCase(modelName)}-unselect-${data.id}`}
                    type="checkbox"
                    name="list_checkbox"
                    checked={true}
                    readOnly={true}
                    className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                    style={{ width: "18px", height: "18px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLinkEnabled) return;
                      onItemSelect(data);
                      MixpanelActions.track(
                        `${modelName}-card-item-unselect-${data.id}:action-click`,
                        { type: "click" }
                      );
                    }}
                  />
                )}
              </div>
            )}
            {!cardSelector && (
              <div className={`text-sm font-medium ${headingColor}`}>
                <p data-testid={cardHeading || "card-heading"}>{cardHeading}</p>
              </div>
            )}
            {openingRecordId && openingRecordId === data?.id ? (
              <Loading />
            ) : (
              <ExpandCollapseIcon
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                getExtendedValue={getExtendedValue}
              />
            )}
          </div>
          <div
            className={`gap-x-4 overflow-y-auto mt-1 mr-[2%] pr-5 pl-0 grid grid-cols-2 ${innerMaxHeight} ${
              showDetails ? "card-scroll" : ""
            }`}
          >
            {visibleHeaders
              ?.filter((header) => header.dataType !== "recordImage")
              .map((header, index) => (
                <DetailFieldPerDataType
                  field={{
                    label: header.label,
                    value: header.columnName,
                    dataType: header.dataType,
                    field: header.field,
                  }}
                  dataProcessed={dataProcessed}
                  dataProcessing={dataProcessing}
                  data={data}
                  headerVisible={true}
                  marginBottom={"mb-2"}
                  fontSize={{ header: "text-xsm", value: "text-xsm" }}
                  fontColor={
                    header.columnName === "name"
                      ? headerLink
                        ? "text-vryno-theme-light-blue"
                        : ""
                      : ""
                  }
                  key={index}
                  truncateData={showDetails ? false : true}
                  isSample={data.isSample}
                  modelName={modelName}
                  colSpan={header?.colSpan}
                  imageServiceModelName={imageServiceModelName}
                  imageServiceSubdomain={imageServiceSubdomain}
                />
              ))}
            {showDetails &&
              hideShowHeaders
                ?.filter((header) => header.dataType !== "recordImage")
                .map((header, index) => (
                  <DetailFieldPerDataType
                    field={{
                      label: header.label,
                      value: header.columnName,
                      dataType: header.dataType,
                      field: header.field,
                    }}
                    dataProcessed={dataProcessed}
                    dataProcessing={dataProcessing}
                    fontColor={
                      header.columnName === "name"
                        ? headerLink
                          ? "text-vryno-theme-light-blue"
                          : ""
                        : ""
                    }
                    data={data}
                    marginBottom={"mb-2"}
                    headerVisible={true}
                    fontSize={{ header: "text-xsm", value: "text-xsm" }}
                    key={index}
                    isSample={data.isSample}
                    modelName={modelName}
                    imageServiceModelName={imageServiceModelName}
                    imageServiceSubdomain={imageServiceSubdomain}
                  />
                ))}
          </div>
          <div className="col-span-12 mt-1">{children}</div>
        </a>
      </Link>
    </div>
  );
}
