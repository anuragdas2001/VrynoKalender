import React from "react";
import Link from "next/link";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import GenericCard from "../../../../../components/TailwindControls/Cards/GenericCard";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import { GenericListHeaderType } from "../../../../../components/TailwindControls/Lists/GenericList";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { ICustomField } from "../../../../../models/ICustomField";
import { DetailRecordStatus } from "../../shared/components/ReadOnly/DetailRecordStatus";

export type GenericModelCardType = {
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  fieldsList: ICustomField[];
  data: Record<string, string | string[]>;
  launchUrl?: string;
  launchMenuArray?: Array<{
    icon: React.JSX.Element;
    label: string;
    onClick: () => void;
    labelClasses?: string;
    visible?: boolean;
  }>;
  headerLink?: string;
  selectedItems: Array<any>;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  dataDisplayType?: "gridView" | "flexView";
  onItemSelect: (selectedItem: any) => void;
  cardDragging?: boolean;
  deleteSessionData?: any;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
};

export default function GenericModelCard({
  visibleHeaders,
  hideShowHeaders,
  fieldsList,
  data,
  launchUrl,
  launchMenuArray,
  headerLink,
  selectedItems,
  dataProcessed,
  dataProcessing,
  dataDisplayType,
  onItemSelect,
  cardDragging = false,
  deleteSessionData,
  openingRecordId,
  setOpeningRecordId,
}: GenericModelCardType) {
  const [launchMenuVisible, setLaunchMenuVisible] = React.useState(false);
  const { modelName } = getAppPathParts();
  const [recordStatusField, setRecordStatusField] =
    React.useState<ICustomField | null>(null);
  const [innerMaxHeight, setInnerMaxHeight] = React.useState("");
  const wrapperRef = React.useRef(null);
  ClickOutsideToClose(wrapperRef, (value: boolean) =>
    setLaunchMenuVisible(value)
  );

  React.useEffect(() => {
    if (visibleHeaders?.length) {
      setInnerMaxHeight("max-h-[100px]");
    }
  }, [visibleHeaders]);

  return (
    <GenericCard
      visibleHeaders={visibleHeaders}
      hideShowHeaders={hideShowHeaders}
      data={data}
      fieldsList={fieldsList}
      headerLink={headerLink}
      selectedItems={selectedItems}
      onItemSelect={(value) => onItemSelect(value)}
      modelName={modelName}
      innerMaxHeight={innerMaxHeight}
      dataProcessed={dataProcessed}
      dataProcessing={dataProcessing}
      cardDragging={cardDragging}
      checkForDelete={true}
      deleteSessionData={deleteSessionData}
      openingRecordId={openingRecordId}
      setOpeningRecordId={setOpeningRecordId}
    >
      <>
        <div className="border-t w-full col-span-2"></div>
        <div
          className={`w-full flex flex-row items-center ${
            recordStatusField && data?.recordStatus
              ? "justify-between"
              : "justify-end mt-2"
          } col-span-2`}
        >
          {recordStatusField && data?.recordStatus && (
            <DetailRecordStatus
              data={data}
              field={{
                value: recordStatusField?.name,
                label: recordStatusField.label.en,
                dataType: recordStatusField.dataType,
                field: recordStatusField,
              }}
              truncateData={false}
              fontSize={{ header: "text-xsm", value: "text-xsm" }}
              fontColor={""}
              viewType={"Card"}
            />
          )}
          <div
            className="h-9 w-28 rounded-md grid grid-cols-10 border border-vryno-button-border"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
            }}
          >
            <Link
              legacyBehavior
              href={
                openingRecordId && openingRecordId === data?.id
                  ? launchUrl || ""
                  : launchUrl || ""
              }
            >
              <a
                onClick={(e) => {
                  e.stopPropagation();
                }}
                id={`edit-${modelName}`}
                className={`${
                  openingRecordId && openingRecordId === data?.id
                    ? "cursor-default"
                    : ""
                } col-span-7 border-r border-vryno-content-divider flex flex-row items-center justify-center`}
              >
                <EditBoxIcon
                  size={17}
                  className="text-vryno-theme-light-blue mr-2"
                />
                <span className="text-xsm font-medium">Edit</span>
              </a>
            </Link>
            <div
              ref={wrapperRef}
              className="col-span-3 relative inline-block text-left cursor-pointer"
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLaunchMenuVisible(!launchMenuVisible);
                }}
                id="open-card-menu-visibility-button"
                customStyle="w-full h-full flex flex-row justify-center items-center"
                userEventName="generic-card-toggle-details-visibility-click"
              >
                {launchMenuVisible ? (
                  <ChevronUpIcon size={15} className="text-gray-500" />
                ) : (
                  <ChevronDownIcon size={15} className="text-gray-500" />
                )}
              </Button>
              {launchMenuVisible && launchMenuArray && (
                <div
                  className="origin-top-right absolute right-0 z-10 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  {launchMenuArray.map((menuItem, index) => (
                    <Button
                      key={index}
                      id={`${menuItem.label}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        menuItem.onClick();
                        setLaunchMenuVisible(!launchMenuVisible);
                      }}
                      customStyle={`w-full p-2 border border-t-0 border-gray-100 text-xs hover:bg-vryno-dropdown-hover ${
                        menuItem.labelClasses || ""
                      }`}
                      userEventName="generic-card-item-click"
                      renderChildrenOnly={true}
                    >
                      <span className="grid grid-cols-12 items-center">
                        <span className="col-span-2">
                          <>{menuItem.icon}</>
                        </span>
                        <span className="text-xsm col-span-10 text-left truncate">
                          {menuItem.label}
                        </span>
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </GenericCard>
  );
}
