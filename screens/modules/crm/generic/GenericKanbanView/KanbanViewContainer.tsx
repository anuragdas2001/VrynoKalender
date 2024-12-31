import { DragDropContext } from "react-beautiful-dnd";
import { KanbanViewColumn } from "./KanbanViewColumn";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { SupportedDashboardViews } from "../../../../../models/shared";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import React from "react";
import { setHeight } from "../../shared/utils/setHeight";
import { KanbanViewColumnProps } from "./KanbanViewColumnProps";
import { getExchangeRate } from "../../../../../shared/getExchangeRate";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { KanbanViewCurrencyModal } from "./KanbanViewCurrencyModal";

export const KanbanViewContainer = ({
  KVData,
  setRecordData,
  selectedLookupField,
  recordData,
  appName,
  modelName,
  fieldsList,
  KViewDataLoading,
  loadingItemCount,
  KVDataLoading,
  recordDataLoading,
  KVColumnHeaderData,
  selectedItems,
  dataProcessed,
  dataProcessing,
  foundNewData,
  setFoundNewData = () => {},
  onItemSelect,
  onMultiItemSelect,
  onPageChange,
  pageLoader,
  deleteModalVisible,
  backgroundProcessRunning,
  setSelectItemsOnAllPages,
  fetchDataFunction,
  currentCustomViewFilter,
  fieldLevelPermission,
  openingRecordId,
  genericModels,
  instances,
  setOpeningRecordId,
  isCategorizeByVisible,
}: KanbanViewColumnProps) => {
  const subDomain = window.location.hostname.split(".")[0];
  const instance = instances?.filter(
    (instance) => instance?.subdomain === subDomain
  )?.[0];
  const [dragLoader, setDragLoader] = React.useState(false);

  const updateRecordDataFunction = (
    startArray: any[],
    finishArray: any[],
    startColumnId: any,
    finishColumnId: any
  ) => {
    setRecordData({
      ...recordData,
      [startColumnId]: {
        data: startArray,
        itemsCount: recordData[startColumnId].itemsCount - 1,
        pageNumber: recordData[finishColumnId].currentPage,
      },
      [finishColumnId]: {
        data: finishArray,
        itemsCount: recordData[finishColumnId].itemsCount + 1,
        pageNumber: recordData[finishColumnId].currentPage,
      },
    });
  };

  const [updateRecord] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || !KVData) {
      toast.error("No destination selected");
      return;
    }
    if (
      !selectedLookupField ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    const startColumnId = source.droppableId;
    const finishColumnId = destination.droppableId;
    if (startColumnId === finishColumnId) return;
    setDragLoader(true);

    const dragRecordData = recordData[startColumnId].data.filter(
      (record) => record.id === draggableId
    )[0];

    const startParentFieldData =
      modelName === "deal" && selectedLookupField?.name === "dealStageId"
        ? fieldsList.filter((field) => field.name === "dealPipelineId")[0]
        : selectedLookupField?.parentFieldUniqueName
        ? fieldsList.filter(
            (field) =>
              field.uniqueName === selectedLookupField.parentFieldUniqueName
          )[0]
        : null;

    if (startParentFieldData) {
      if (
        startParentFieldData.mandatory &&
        dragRecordData?.[startParentFieldData.name] == null
      ) {
        toast.error(
          `Dependency parent field ${startParentFieldData.label.en} data not found. Please add ${startParentFieldData.label.en} value`
        );
        setDragLoader(false);
        return;
      }
      let recordIds =
        (startParentFieldData.dataTypeMetadata.fieldDependencyMapping &&
          startParentFieldData.dataTypeMetadata.fieldDependencyMapping?.filter(
            (data: { parentRecordId: string }) =>
              data.parentRecordId ===
              dragRecordData?.[startParentFieldData.name]
          )[0]?.childRecordIds) ||
        null;

      if (!dragRecordData?.[startParentFieldData.name] || !recordIds) {
        recordIds = selectedLookupField.dataTypeMetadata.lookupOptions.map(
          (value: { id: string }) => value.id
        );
      }

      //will happen in case of no stages on pipeline - only
      if (!recordIds) {
        toast.error(
          `Dependency parent field ${startParentFieldData.label.en} lookup options not found.`
        );
        setDragLoader(false);
        return;
      }
      if (!recordIds.includes(finishColumnId)) {
        toast.error(
          `Dependent field ${selectedLookupField.label.en} does not match dependency with parent field ${startParentFieldData.label.en}`
        );
        setDragLoader(false);
        return;
      }
    }

    const startDependencyData = selectedLookupField?.dataTypeMetadata
      ?.fieldDependencyMapping.length
      ? selectedLookupField?.dataTypeMetadata?.fieldDependencyMapping.filter(
          (data: { parentRecordId: string }) =>
            data.parentRecordId === finishColumnId
        )[0]
      : null;

    const finishFieldData = startDependencyData
      ? fieldsList.filter(
          (field) =>
            field.uniqueName === startDependencyData.childFieldUniqueName
        )[0]
      : null;

    if (
      finishFieldData?.mandatory &&
      startDependencyData &&
      startDependencyData.childRecordIds.length == 0
    ) {
      toast.error(
        `Dependent ${
          finishFieldData?.label.en || "field"
        } does not have lookup options`
      );
      setDragLoader(false);
      return;
    }
    const startFallbackArray = [...recordData[startColumnId].data];
    const finishFallbackArray = [...recordData[finishColumnId].data];

    let finishedRecordData = selectedLookupField.systemDefined
      ? {
          ...dragRecordData,
          [selectedLookupField.name]: finishColumnId,
        }
      : {
          ...dragRecordData,
          [selectedLookupField.name]: finishColumnId,
          fields: {
            ...dragRecordData.fields,
            [selectedLookupField.name]: finishColumnId,
          },
        };

    if (startDependencyData && finishFieldData) {
      finishedRecordData = finishFieldData?.systemDefined
        ? {
            ...finishedRecordData,
            [finishFieldData.name]:
              startDependencyData.childRecordIds[0] || null,
          }
        : {
            ...finishedRecordData,
            fields: {
              ...finishedRecordData.fields,
              [finishFieldData.name]:
                startDependencyData.childRecordIds[0] || null,
            },
          };
    }

    const startArray = [...recordData[startColumnId].data];
    startArray.splice(source.index, 1);
    const finishArray = [...recordData[finishColumnId].data];
    finishArray.splice(destination.index, 0, finishedRecordData);

    updateRecordDataFunction(
      startArray,
      finishArray,
      startColumnId,
      finishColumnId
    );

    try {
      let saveInput = selectedLookupField?.systemDefined
        ? { [KVData?.categorizeBy]: finishColumnId }
        : { fields: { [selectedLookupField.name]: finishColumnId } };
      if (startDependencyData && finishFieldData) {
        saveInput = finishFieldData?.systemDefined
          ? {
              ...saveInput,
              [finishFieldData.name]:
                startDependencyData.childRecordIds[0] || null,
            }
          : {
              ...saveInput,
              fields: {
                ...saveInput.fields,
                [finishFieldData.name]:
                  startDependencyData.childRecordIds[0] || null,
              },
            };
      }

      await updateRecord({
        variables: {
          id: draggableId,
          modelName: modelName,
          saveInput: saveInput,
        },
      }).then((response) => {
        if (response?.data.save.messageKey.includes("-success")) {
          toast.success(response?.data.save.message);
          fetchDataFunction(currentCustomViewFilter.filters, false);
        } else {
          updateRecordDataFunction(
            startFallbackArray,
            finishFallbackArray,
            startColumnId,
            finishColumnId
          );
          toast.error(response?.data.save.message);
        }
        setDragLoader(false);
      });
    } catch (error) {
      updateRecordDataFunction(
        startFallbackArray,
        finishFallbackArray,
        startColumnId,
        finishColumnId
      );
      setDragLoader(false);
      console.error(error);
    }
  };

  const [aggregateCurrencyRateLoading, setAggregateCurrencyRateLoading] =
    React.useState(true);
  const [exchangeRate, setExchangeRate] = React.useState<Record<
    string,
    number
  > | null>(null);
  const [showCurrencyModal, setShowCurrencyModal] = React.useState(false);
  const [triggerExchangeRate, setTriggerExchangeRate] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setTriggerExchangeRate(true);
      if (!KVData) return;
      if (KVData.id && !KVData.aggregateBy) {
        setAggregateCurrencyRateLoading(false);
        return;
      }
      const convertTo = KVData?.currencyType?.toLowerCase() || null;
      if (convertTo === null) {
        setAggregateCurrencyRateLoading(false);
        return;
      }
      try {
        const exchangeRates = await getExchangeRate(convertTo);
        setExchangeRate(exchangeRates?.data?.[convertTo]);
        setAggregateCurrencyRateLoading(false);
      } catch (error) {
        toast.error("Error fetching exchange rate");
        console.error("Error fetching exchange rate", error);
        setAggregateCurrencyRateLoading(false);
      }
    })();
  }, [KVData]);

  const heightRefOne = React.useRef(null);
  React.useEffect(() => {
    if (heightRefOne?.current) {
      setHeight(heightRefOne, 20);
    }
  });

  const KanbanViewMessageContainer = (message: string) => (
    <div
      style={{
        height: (window.innerHeight * 4) / 6,
      }}
      className="w-full flex flex-col  items-center justify-center"
    >
      <div className="w-full max-w-sm max-h-64 flex flex-col items-center justify-center h-full rounded-xl p-6 bg-white">
        <p className="font-medium w-full text-center">{message}</p>
      </div>
    </div>
  );

  const KanbanViewHeader = () => (
    <div className="flex items-center justify-between mb-2 text-sm text-gray-700">
      <p>
        Kanban View:{" "}
        <span className="text-vryno-theme-light-blue">{KVData?.name}</span>
      </p>
      {KVData?.currencyType ? (
        <div>
          <Button
            id={"kanban-view-exchange-rate-button"}
            onClick={(e) => {
              e.preventDefault();
              setShowCurrencyModal(true);
              setTriggerExchangeRate(false);
            }}
            userEventName={"kanban-view-exchange-rate-button"}
          >
            Exchange Rate
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  return (
    <>
      {KViewDataLoading ? (
        <ItemsLoader
          currentView={SupportedDashboardViews.Kanban}
          loadingItemCount={loadingItemCount}
        />
      ) : !fieldLevelPermission.permission ? (
        <>
          <KanbanViewHeader />
          {KanbanViewMessageContainer(
            fieldLevelPermission?.message ||
              "No field permission for Kanban View fields"
          )}
        </>
      ) : !isCategorizeByVisible ? (
        KanbanViewMessageContainer("Selected categorized field is hidden")
      ) : !KVData ? (
        KanbanViewMessageContainer("No Kanban View Found")
      ) : KVDataLoading || recordDataLoading || aggregateCurrencyRateLoading ? (
        <ItemsLoader
          currentView={SupportedDashboardViews.Kanban}
          loadingItemCount={loadingItemCount}
        />
      ) : (
        <>
          <KanbanViewHeader />
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              ref={heightRefOne}
              className="overflow-x-auto w-full kanban-card-scroll flex pb-3"
            >
              {KVColumnHeaderData.map((data, index) =>
                recordData[data.id] ? (
                  <KanbanViewColumn
                    key={data.id}
                    index={index}
                    columnData={data}
                    recordData={recordData[data.id]?.data || []}
                    originalFieldsList={fieldsList}
                    openingRecordId={openingRecordId}
                    setOpeningRecordId={setOpeningRecordId}
                    fieldsList={fieldsList.filter((field) => {
                      if (field.systemDefined) {
                        return KVData?.availableFields.includes(field.name);
                      } else {
                        return KVData?.availableFields.includes(
                          `fields.${field.name}`
                        );
                      }
                    })}
                    currencyField={
                      fieldsList.filter(
                        (field) => field.name === "currency"
                      )?.[0]
                    }
                    availableFields={KVData.availableFields.map((fieldName) => {
                      if (fieldName.split(".")[0] === "fields") {
                        return fieldName.split(".")[1];
                      } else {
                        return fieldName;
                      }
                    })}
                    appName={appName}
                    modelName={modelName}
                    selectedItems={selectedItems}
                    dataProcessed={dataProcessed}
                    dataProcessing={dataProcessing}
                    onItemSelect={onItemSelect}
                    onMultiItemSelect={onMultiItemSelect}
                    onPageChange={onPageChange}
                    pageSize={50}
                    foundNewData={foundNewData}
                    setFoundNewData={setFoundNewData}
                    itemsCount={recordData[data.id]?.itemsCount || 0}
                    currentPageNumber={recordData[data.id]?.currentPage || 1}
                    pageLoader={pageLoader}
                    deleteModalVisible={deleteModalVisible}
                    backgroundProcessRunning={backgroundProcessRunning}
                    setSelectItemsOnAllPages={setSelectItemsOnAllPages}
                    KVData={KVData}
                    exchangeRate={exchangeRate}
                    instance={instance}
                    triggerExchangeRate={triggerExchangeRate}
                    genericModels={genericModels}
                    setTriggerExchangeRate={(value: boolean) =>
                      setTriggerExchangeRate(value)
                    }
                  />
                ) : (
                  <></>
                )
              )}
            </div>
          </DragDropContext>
          {dragLoader ? <Backdrop renderFullPage={true} /> : <></>}
        </>
      )}
      {showCurrencyModal && KVData?.currencyType ? (
        <KanbanViewCurrencyModal
          setShowCurrencyModal={(value: boolean) => setShowCurrencyModal(value)}
          exchangeRate={exchangeRate}
          currencyField={
            fieldsList.filter((val) => val.name == "currency")?.[0]
          }
          currencyType={KVData.currencyType.toLowerCase()}
          instance={instance}
          setTriggerExchangeRate={(value: boolean) =>
            setTriggerExchangeRate(value)
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};
