import React from "react";
import { DetailFieldPerDataType } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldPerDataType";
import { GenericListHeaderType } from "../Lists/GenericList";
import ExpandCollapseIcon from "./ExpandCollapseIcon";
import { MixpanelActions } from "../../../screens/Shared/MixPanel";
import { kebabCase } from "lodash";
import { BaseGenericObjectType } from "../../../models/shared";

export const GenericCardContent = ({
  data,
  children,
  visibleHeaders,
  hideShowHeaders,
  fieldsList,
  selectedItems,
  onItemSelect,
  cardSelector = true,
  getExtendedValue = (extended: boolean) => {},
  innerMaxHeight,
  modelName,
  headerLink,
}: {
  data: BaseGenericObjectType;
  children?: React.ReactElement;
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  fieldsList?: Array<any>;
  selectedItems?: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  cardSelector?: boolean;
  getExtendedValue?: (extended: boolean) => void;
  innerMaxHeight: string;
  modelName: string;
  headerLink?: string;
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        {cardSelector && (
          <div className={`col-span-11 text-gray-400 text-left`}>
            {selectedItems?.filter((sItem) => sItem.id === data.id).length ===
            0 ? (
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
                  onItemSelect(data);
                  MixpanelActions.track(
                    `${modelName}-card-content-select-${data.id}:action-click`,
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
                  onItemSelect(data);
                  MixpanelActions.track(
                    `${modelName}-card-content-unselect-${data.id}:action-click`,
                    { type: "click" }
                  );
                }}
              />
            )}
          </div>
        )}
        {!cardSelector && (
          <div className="text-sm font-medium">
            <p data-testid="Instance">Instance</p>
          </div>
        )}
        <ExpandCollapseIcon
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          getExtendedValue={getExtendedValue}
        />
      </div>
      <div
        // ref={cardRef}
        className={`gap-x-4 overflow-y-auto mt-1 mr-[2%] pr-5 pl-0 grid grid-cols-2 ${innerMaxHeight} ${
          showDetails ? "card-scroll" : ""
        }`}
      >
        {visibleHeaders.map((header, index) => (
          <DetailFieldPerDataType
            field={{
              label: header.label,
              value: header.columnName,
              field: header.field,
              dataType: header.dataType,
            }}
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
          />
        ))}
        {showDetails &&
          hideShowHeaders.map((header, index) => (
            <DetailFieldPerDataType
              field={{
                label: header.label,
                value: header.columnName,
                field: header.field,
                dataType: header.dataType,
              }}
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
            />
          ))}
      </div>
      <div className="col-span-12 mt-1">{children}</div>
    </>
  );
};
