import { Draggable } from "react-beautiful-dnd";
import React from "react";
import { GenericListHeaderType } from "../../../../../components/TailwindControls/Lists/GenericList";
import { KanbanViewCardItem } from "./KanbanViewCardItem";
import { BaseGenericObjectType } from "../../../../../models/shared";

type KanbanCardType<T extends BaseGenericObjectType> = {
  appName: string;
  modelData: T[];
  modelName: string;
  visibleHeaders: Array<GenericListHeaderType>;
  hideShowHeaders: Array<GenericListHeaderType>;
  fieldsList: Array<any>;
  selectedItems: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
};

export default function ConnectedKanbanCard<T extends BaseGenericObjectType>({
  appName,
  modelData,
  modelName,
  visibleHeaders = [],
  hideShowHeaders,
  fieldsList,
  selectedItems,
  onItemSelect,
  dataProcessed,
  dataProcessing,
  openingRecordId,
  setOpeningRecordId,
}: KanbanCardType<T>) {
  const deleteSessionData = JSON.parse(
    sessionStorage.getItem("bulkDeleteData") || "{}"
  );
  return (
    modelData &&
    modelData.map((item, index) => {
      let isLinkEnabled = true;
      if (
        !Object.keys(deleteSessionData)?.length ||
        !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
        !item?.id
      ) {
        isLinkEnabled = true;
      } else {
        const idArray: string[] = [];
        for (const key in deleteSessionData?.[modelName]) {
          idArray.push(...deleteSessionData?.[modelName][key]);
        }
        isLinkEnabled = idArray.includes(item.id) ? false : true;
      }
      return (
        <Draggable
          draggableId={item.id}
          index={index}
          key={item.id}
          isDragDisabled={!isLinkEnabled}
        >
          {(provided, snapshot) => (
            <div
              className={`flex flex-col border rounded-xl ${
                index === modelData.length - 1 ? "mb-15" : "mb-3"
              }`}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <KanbanViewCardItem
                appName={appName}
                modelName={modelName}
                data={item}
                fieldsList={fieldsList}
                cardDragging={snapshot.isDragging}
                visibleHeaders={visibleHeaders}
                hideShowHeaders={hideShowHeaders}
                selectedItems={selectedItems}
                onItemSelect={onItemSelect}
                dataProcessed={dataProcessed}
                dataProcessing={dataProcessing}
                isLinkEnabled={isLinkEnabled}
                openingRecordId={openingRecordId}
                setOpeningRecordId={setOpeningRecordId}
              />
            </div>
          )}
        </Draggable>
      );
    })
  );
}
