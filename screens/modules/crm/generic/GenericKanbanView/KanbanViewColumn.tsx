import { ICustomField } from "../../../../../models/ICustomField";
import { IKanbanViewData, SupportedApps } from "../../../../../models/shared";
import { Droppable } from "react-beautiful-dnd";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import LeftArrowIcon from "remixicon-react/ArrowLeftSLineIcon";
import RightArrowIcon from "remixicon-react/ArrowRightSLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  getAllCustomViewFieldsArray,
  getAllFieldsObjectArrayForModal,
} from "../../shared/utils/getFieldsArray";
import ConnectedKanbanCard from "../GenericModelView/ConnectedKanbanCard";
import { equalsCheck } from "../GenericModelView/GenericModelDashboard";
import { useGetProcessedData } from "../GenericModelView/ViewUtils/useGetProcessedData";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import React from "react";
import { toast } from "react-toastify";
import { IInstance } from "../../../../../models/Accounts";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const KanbanViewColumn = ({
  columnData,
  index,
  recordData,
  originalFieldsList,
  fieldsList,
  availableFields,
  appName,
  modelName,
  selectedItems,
  dataProcessed,
  dataProcessing,
  foundNewData,
  setFoundNewData = () => {},
  onItemSelect,
  onMultiItemSelect,
  onPageChange,
  pageSize = 50,
  itemsCount,
  currentPageNumber,
  pageLoader,
  deleteModalVisible,
  backgroundProcessRunning,
  setSelectItemsOnAllPages,
  KVData,
  openingRecordId,
  setOpeningRecordId,
  exchangeRate,
  instance,
  triggerExchangeRate,
  genericModels,
  setTriggerExchangeRate,
  currencyField,
}: {
  columnData: {
    id: string;
    label: string;
  };
  index: number;
  recordData: any[];
  originalFieldsList: ICustomField[];
  fieldsList: ICustomField[];
  availableFields: string[];
  appName: SupportedApps;
  modelName: string;
  selectedItems: Array<any>;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  foundNewData: boolean;
  setFoundNewData?: (value: boolean) => void;
  onItemSelect: (selectedItem: any) => void;
  onMultiItemSelect: (selectedItem: any[]) => void;
  onPageChange: (pageNumber: number, columnId: string) => void;
  pageSize: number;
  itemsCount: number;
  currentPageNumber: number;
  pageLoader: string | null;
  deleteModalVisible: boolean;
  backgroundProcessRunning?: boolean;
  setSelectItemsOnAllPages: (items: any[]) => void;
  KVData: IKanbanViewData;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
  exchangeRate: Record<string, number> | null;
  instance: IInstance;
  triggerExchangeRate: boolean;
  genericModels: IGenericModel;
  setTriggerExchangeRate: (value: boolean) => void;
  currencyField: ICustomField;
}) => {
  // const converter = new Converter();
  const [componentAggregateData, setComponentAggregateData] = React.useState(0);

  const pagesCount = Math.ceil(itemsCount / pageSize);
  const leftDisabled = pageLoader
    ? true
    : recordData?.length == 0
    ? true
    : currentPageNumber === 1;
  const rightDisabled = pageLoader
    ? true
    : recordData?.length == 0
    ? true
    : currentPageNumber == pagesCount;

  const updatedModelData =
    useGetProcessedData(
      recordData?.length > 0 ? getDataObjectArray(recordData) : [],
      originalFieldsList?.length > 0 ? originalFieldsList : [],
      currentPageNumber,
      deleteModalVisible,
      recordData?.length ? true : backgroundProcessRunning || false,
      genericModels,
      foundNewData,
      setFoundNewData
    ) ?? [];

  const [areAllColumnRecordsSelected, setAreAllColumnRecordsSelected] =
    React.useState(false);

  React.useEffect(() => {
    let foundItemsCount = 0;
    for (const item of recordData) {
      const found =
        selectedItems.filter((sItem) => sItem.id === item.id).length === 0
          ? false
          : true;
      if (found) {
        foundItemsCount += 1;
      }
    }
    if (recordData?.length && foundItemsCount === recordData.length)
      setAreAllColumnRecordsSelected(true);
    else setAreAllColumnRecordsSelected(false);
  }, [selectedItems]);

  const aggregateDataGenerator = async () => {
    let aggregateData: number = 0;
    const convertTo = KVData?.currencyType?.toLowerCase() || null;
    if (convertTo === null) return 0;
    const sessionStoredExchangeRate = JSON.parse(
      sessionStorage.getItem("kanbanViewExchangeRate") || "{}"
    );
    for (const item of recordData) {
      const amount: number = item[KVData?.aggregateBy || ""] || 0;
      const convertFrom: string | null =
        currencyField?.dataTypeMetadata.lookupOptions
          ?.filter((val: { id: string }) => val.id === item["currency"])?.[0]
          ?.label.en?.toLowerCase() || null;

      if (!convertFrom || !convertTo || convertFrom === convertTo) {
        aggregateData += amount;
      } else {
        try {
          const currencyExchangeRate =
            sessionStoredExchangeRate[instance.id]?.[convertTo]?.[
              convertFrom
            ] ||
            exchangeRate?.[convertFrom] ||
            1;
          if (
            typeof currencyExchangeRate === "number" &&
            !Number.isNaN(currencyExchangeRate)
          ) {
            aggregateData += amount / currencyExchangeRate;
          } else {
            aggregateData += amount;
          }
        } catch (e) {
          toast.error("Unable to fetch currency value. Please try again");
          console.error("Currency fetch exchange rate error: ", e);
          aggregateData += amount;
        }
      }
    }
    return parseFloat(aggregateData.toFixed(5));
  };

  React.useEffect(() => {
    (async () => {
      if (KVData.aggregateBy && triggerExchangeRate) {
        const data = await aggregateDataGenerator();
        setComponentAggregateData(data);
      }
    })();
  }, [recordData, triggerExchangeRate]);

  const getFormattedCurrency = (amount: number, countryCode: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: countryCode,
    });
    return formatter.format(amount);
  };

  return (
    <div
      className={`min-w-[325px] w-full h-full ${
        index === 0 ? "mr-4" : "mx-4"
      } ${!recordData?.length ? "kanban-column-shadow" : ""}`}
      data-testid={`${columnData.label}-kanban-column`}
    >
      <div
        className="bg-vryno-theme-highlighter-blue rounded-lg mb-2 py-1 flex items-center justify-between"
        data-testid={`${columnData.label}-kanban-column-header`}
      >
        <div className="ml-[14px] w-[32px] text-gray-400 text-left flex items-center justify-center">
          {areAllColumnRecordsSelected == false ? (
            <input
              id={`${columnData.label}-select-all-kanban-column`}
              type="checkbox"
              name="list_checkbox"
              checked={false}
              readOnly={true}
              className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
              style={{ width: "18px", height: "18px" }}
              onClick={(e) => {
                e.stopPropagation();
                if (!recordData) return;
                onMultiItemSelect(recordData);
                MixpanelActions.track(
                  `${columnData.label}-select-all-kanban-column:action-click`,
                  { type: "click" }
                );
              }}
            />
          ) : (
            <input
              id={`${columnData.label}-deselect-all-kanban-column`}
              type="checkbox"
              name="list_checkbox"
              checked={true}
              readOnly={true}
              className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
              style={{ width: "18px", height: "18px" }}
              onClick={(e) => {
                e.stopPropagation();
                if (!recordData) return;
                onMultiItemSelect(recordData);
                MixpanelActions.track(
                  `${columnData.label}-deselect-all-kanban-column:action-click`,
                  { type: "click" }
                );
              }}
            />
          )}
        </div>
        <div className="w-[70%] flex items-center justify-start leading-5 gap-x-1 px-1">
          <p className="text-sm truncate" title={columnData.label}>
            {columnData.label}
          </p>
          <p className="text-xs text-vryno-theme-light-blue">{`(${itemsCount})`}</p>
        </div>
        <div className="flex mr-[14px]">
          <div className="w-[28px] rounded-tl-md rounded-bl-md">
            <Button
              id={`${columnData.label}-kanban-column-pagination-previous`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPageChange(currentPageNumber - 1, columnData.id);
              }}
              disabled={leftDisabled}
              aria-current="page"
              customStyle="z-10 relative inline-flex items-center mr-2 mt-2 cursor-pointer bg-vryno-theme-light-blue"
              userEventName={`${columnData.label}-kanban-column-pagination-previous:view-click`}
            >
              {leftDisabled ? (
                <LeftArrowIcon className="text-sm text-vryno-gray" size={20} />
              ) : (
                <LeftArrowIcon className="text-sm text-white" size={20} />
              )}
            </Button>
          </div>
          <div className="w-[28px] rounded-tr-md rounded-br-md">
            <Button
              id={`${columnData.label}-kanban-column-pagination-next`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPageChange(currentPageNumber + 1, columnData.id);
              }}
              disabled={rightDisabled}
              aria-current="page"
              customStyle={`z-10 relative inline-flex items-center mr-2 mt-2 cursor-pointer bg-vryno-theme-light-blue`}
              userEventName={`${columnData.label}-kanban-column-pagination-next:view-click`}
            >
              {rightDisabled ? (
                <RightArrowIcon className="text-sm text-vryno-gray" size={20} />
              ) : (
                <RightArrowIcon className="text-sm text-white" size={20} />
              )}
            </Button>
          </div>
        </div>
        {modelName === "deal" ? (
          <div
            className={`ml-[20px] text-xsm tracking-wide ${
              KVData?.aggregateBy ? "" : "hidden"
            }`}
            data-testid={`${columnData.label}-aggregate-data`}
          >
            {KVData?.currencyType
              ? getFormattedCurrency(
                  componentAggregateData,
                  KVData.currencyType
                )
              : componentAggregateData}
          </div>
        ) : (
          <></>
        )}
      </div>
      {pageLoader && pageLoader === columnData.id ? (
        <div className="h-full flex justify-center items-center">
          <PageLoader />
        </div>
      ) : (
        <Droppable droppableId={columnData.id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div
                className={`h-full overflow-y-hidden ${
                  recordData?.length
                    ? "hover:overflow-y-auto kanban-card-scroll hover:pr-1 hover:mr-1"
                    : ""
                } ${snapshot.isDraggingOver ? "bg-vryno-select-bg" : ""}`}
                {...provided.droppableProps}
                style={{ transition: "background-color 0.2s ease" }}
              >
                {!recordData?.length ? (
                  <p className="text-center mt-[45%]">No record found</p>
                ) : (
                  <ConnectedKanbanCard
                    appName={appName}
                    modelData={
                      !equalsCheck(
                        updatedModelData.map((data) => {
                          return data?.id;
                        }),
                        recordData?.map((data) => {
                          return data?.id;
                        })
                      )
                        ? recordData
                        : updatedModelData?.length > 0
                        ? updatedModelData
                        : recordData
                    }
                    modelName={modelName}
                    openingRecordId={openingRecordId}
                    setOpeningRecordId={setOpeningRecordId}
                    visibleHeaders={
                      availableFields.length
                        ? getAllCustomViewFieldsArray(
                            fieldsList,
                            availableFields,
                            ["recordStatus"]
                          ).splice(0, 4)
                        : getAllFieldsObjectArrayForModal(fieldsList, "", [
                            "recordStatus",
                          ]).splice(0, 4)
                    }
                    hideShowHeaders={
                      availableFields.length
                        ? getAllCustomViewFieldsArray(
                            fieldsList,
                            availableFields,
                            ["recordStatus"]
                          ).splice(4)
                        : getAllFieldsObjectArrayForModal(fieldsList, "", [
                            "recordStatus",
                          ]).splice(4)
                    }
                    fieldsList={fieldsList}
                    selectedItems={selectedItems}
                    onItemSelect={onItemSelect}
                    dataProcessed={dataProcessed}
                    dataProcessing={dataProcessing}
                  />
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};
