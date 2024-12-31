import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import Link from "next/link";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import ExpandCollapseIcon from "../../../../../components/TailwindControls/Cards/ExpandCollapseIcon";
import { DetailFieldPerDataType } from "../../shared/components/ReadOnly/DetailFieldPerDataType";
import React from "react";
import { GenericListHeaderType } from "../../../../../components/TailwindControls/Lists/GenericList";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { BaseGenericObjectType } from "../../../../../models/shared";

export const KanbanViewCardItem = ({
  appName,
  modelName,
  data,
  fieldsList,
  cardDragging,
  visibleHeaders,
  hideShowHeaders,
  selectedItems,
  onItemSelect,
  dataProcessed,
  dataProcessing,
  isLinkEnabled,
  openingRecordId,
  setOpeningRecordId,
}: {
  appName: string;
  modelName: string;
  data: BaseGenericObjectType;
  fieldsList: Array<any>;
  cardDragging: boolean;
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  selectedItems: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  isLinkEnabled: boolean;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
}) => {
  const [innerMaxHeight, setInnerMaxHeight] = React.useState("");
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    if (visibleHeaders?.length) {
      if (visibleHeaders.map((val) => val.dataType).includes("recordImage")) {
        if (visibleHeaders.length <= 3) setInnerMaxHeight("max-h-[120px]");
        if (visibleHeaders.length >= 4) setInnerMaxHeight("max-h-[168px]");
      } else {
        setInnerMaxHeight("max-h-[96px]");
      }
    }
  }, [visibleHeaders]);

  return (
    <Link
      href={`${
        appName && modelName
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
        className={`block px-5 py-3 w-full rounded-xl shadow-sm ${
          openingRecordId && openingRecordId === data?.id
            ? "bg-vryno-theme-item-loading-background"
            : cardDragging
            ? "bg-vryno-active-kanban-card"
            : "bg-white"
        } ${
          !isLinkEnabled ? "pointer-events-none opacity-60" : "cursor-pointer"
        }`}
        onClick={
          openingRecordId && openingRecordId === data.id
            ? () => {}
            : appName && modelName
            ? (e) => {
                if (e.ctrlKey) {
                } else {
                  setOpeningRecordId(data.id);
                }
              }
            : () => {}
        }
        aria-disabled={!isLinkEnabled}
      >
        <div className="flex justify-between items-center">
          <div className={`col-span-11 text-gray-400 text-left`}>
            {selectedItems?.filter((sItem) => sItem.id === data.id).length ===
            0 ? (
              <input
                id={`${modelName}-select-${data.id}`}
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
                id={`${modelName}-unselect-${data.id}`}
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

          {openingRecordId && openingRecordId === data.id ? (
            <Loading />
          ) : (
            <ExpandCollapseIcon
              showDetails={showDetails}
              setShowDetails={setShowDetails}
            />
          )}
        </div>
        <div
          className={`gap-x-4 overflow-y-auto mt-1 mr-[2%] pr-5 pl-0 grid ${innerMaxHeight} ${
            showDetails ? "card-scroll" : ""
          }`}
        >
          {visibleHeaders.map((header, index) => (
            <DetailFieldPerDataType
              field={{
                label: header.label,
                value: header.columnName,
                dataType: header.dataType,
                field: header.field,
              }}
              // dataProcessed={dataProcessed}
              dataProcessing={dataProcessing}
              data={data}
              headerVisible={true}
              marginBottom={"mb-0"}
              fontSize={{
                header: "text-xsm",
                value: "text-xsm",
              }}
              key={index}
              truncateData={showDetails ? false : true}
              isSample={data.isSample}
              modelName={modelName}
              supportedLabelLocation="onLeftSide"
            />
          ))}
          {showDetails &&
            hideShowHeaders.map((header, index) => (
              <DetailFieldPerDataType
                field={{
                  label: header.label,
                  value: header.columnName,
                  dataType: header.dataType,
                  field: header.field,
                }}
                // dataProcessed={dataProcessed}
                dataProcessing={dataProcessing}
                data={data}
                marginBottom={"mb-0"}
                headerVisible={true}
                fontSize={{
                  header: "text-xsm",
                  value: "text-xsm",
                }}
                key={index}
                isSample={data.isSample}
                modelName={modelName}
                supportedLabelLocation="onLeftSide"
              />
            ))}
        </div>
      </a>
    </Link>
  );
};
