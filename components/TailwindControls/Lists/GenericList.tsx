import React, { memo, useMemo } from "react";
// import { paramCase } from "change-case";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../models/ICustomField";
import { getAppPathParts } from "../../../screens/modules/crm/shared/utils/getAppPathParts";
import { GenericTableCellWrapper } from "./GenericTableCellWrapper";
import { MixpanelActions } from "../../../screens/Shared/MixPanel";
import { GenericListHeader } from "./GenericListHeader";
import { Loading } from "../Loading/Loading";
import { BaseGenericObjectType, SupportedApps } from "../../../models/shared";
import { AgGridReact } from "ag-grid-react";
import _ from "lodash";
import { GenericSkeletonList } from "../ContentLoader/List/GenericSkeletonList";
import { GenericOldListHeader } from "./GenericListOldHeader";
import { usePrevious } from "../../Hooks/usePreviousState";

export type GenericListHeaderType = {
  columnName: string;
  label: string;
  dataType: FieldSupportedDataType;
  field?: ICustomField;
  colSpan?: number;
  systemDefined?: boolean;
  render?: (record: any, index: number) => JSX.Element | undefined;
};

export type GenericListPropType<T extends BaseGenericObjectType> = {
  tableHeaders: Array<GenericListHeaderType>;
  // data: Array<T>;
  data: any[];
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  selectedItems?: Array<any>;
  listSelector?: boolean;
  fieldsList?: ICustomField[];
  onDetail?: boolean;
  showIcons?: boolean;
  alignText?: "text-center" | "text-left" | "text-right";
  stickyHeader?: boolean;
  externalModelName?: string;
  target?: "_self" | "_blank";
  imageSize?: string;
  includeUrlWithRender?: boolean;
  selectMode?: "checkbox" | "radio";
  radioName?: string;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  truncate?: boolean;
  includeFlagInPhoneNumber?: boolean;
  addSorting?: boolean;
  allowNewGridInBuiltSorting?: boolean;
  oldGenericListUI?: boolean;
  filterValue?: string;
  richTextOverflowScroll?: boolean;
  handleSorting?: (value: {
    name: string;
    order: "ASC" | "DESC" | "None";
  }) => void;
  onItemSelect?: (selectedItem: any) => void;
  selectAllItems?: () => void;
  setSelectItemsOnAllPages?: () => void;
  rowUrlGenerator?: (id: string | Record<string, string> | any) => string;
  handleRowClick?: (id: string | Record<string, string> | any) => void;
  checkForMassDelete?: { check: boolean; sessionStorageKeyName: string };
  openingRecordId?: string | null;
  setOpeningRecordId?: (value: string | null) => void;
  showFieldEditInput?: boolean;
  appName?: SupportedApps;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  hideHeader?: boolean;
  columnFixedWidth?: string;
  showBGColor?: boolean;
  shiftTableBodyBy?: string;
  applyBottomBorderBetweenRows?: boolean;
  makeFirstColumnSticky?: boolean;
  renderHeaderIfNoData?: boolean;
  showNoDataMessage?: boolean;
  insertInDataTestId?: string;
};

function GenericList<T extends BaseGenericObjectType>({
  tableHeaders,
  data,
  sortingFieldList,
  selectedItems,
  listSelector = true,
  fieldsList = [],
  onDetail = false,
  showIcons = false,
  alignText = "text-left",
  stickyHeader = true,
  externalModelName,
  target = "_self",
  imageSize,
  includeUrlWithRender = false,
  selectMode = "checkbox",
  radioName,
  dataProcessed,
  dataProcessing,
  truncate,
  includeFlagInPhoneNumber = true,
  addSorting = false,
  allowNewGridInBuiltSorting = false,
  oldGenericListUI = false,
  filterValue,
  richTextOverflowScroll = true,
  handleSorting = () => {},
  onItemSelect = () => {},
  rowUrlGenerator,
  handleRowClick,
  openingRecordId = null,
  setOpeningRecordId = () => {},
  selectAllItems = () => {},
  setSelectItemsOnAllPages = () => {},
  checkForMassDelete,
  showFieldEditInput,
  appName,
  updateModelFieldData,
  hideHeader = false,
  columnFixedWidth,
  showBGColor,
  shiftTableBodyBy,
  applyBottomBorderBetweenRows = true,
  makeFirstColumnSticky = false,
  renderHeaderIfNoData,
  showNoDataMessage,
  insertInDataTestId,
}: GenericListPropType<T>) {
  const { modelName } = getAppPathParts();
  const gridRef = React.useRef<any>();
  const rowBuffer = 0;
  const rowSelection = "multiple";
  const containsActionHeader =
    tableHeaders.findIndex((header) => header.columnName === "actions") >= 0
      ? true
      : false;
  const checkForDelete = checkForMassDelete?.check;
  const deleteSessionData = JSON.parse(
    sessionStorage.getItem(checkForMassDelete?.sessionStorageKeyName || "") ||
      "{}"
  );
  const [gridSizeChanged, setGridSizeChanged] = React.useState<boolean>(true);
  const [colDefs, setColDefs] = React.useState<any[]>([]);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const [loadingData, setLoadingData] = React.useState(true);
  const [gridApi, setGridApi] = React.useState<any>(null);
  const [columnWidth, setColumnWidth] = React.useState<Record<
    string,
    number
  > | null>(
    _.get(
      JSON.parse(localStorage.getItem("columnWidth") as string),
      modelName,
      null
    )
  );
  const prevData = usePrevious({ data });
  const prevSelectedList = usePrevious({ selectedItems });

  const getRowId = (params: any) => {
    return params.data.uniqueIndex;
  };

  const onGridReady = (params: any) => {
    setGridApi(gridRef.current.api);
  };

  const handleDragStopped = (event: any) => {
    setColumnWidth(
      _.get(
        JSON.parse(localStorage.getItem("columnWidth") as string),
        modelName,
        null
      )
    );
    setGridSizeChanged(true);
  };

  const onColumnResized = (event: any) => {
    const columnName = event.column?.getColDef().headerName;
    const columnWidth = event.column?.actualWidth;

    if (localStorage.getItem("columnWidth")) {
      if (
        _.get(
          JSON.parse(localStorage.getItem("columnWidth") as string),
          modelName,
          null
        )
      ) {
        localStorage.setItem(
          "columnWidth",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("columnWidth") as string),
            [modelName]: {
              ..._.get(
                JSON.parse(localStorage.getItem("columnWidth") as string),
                modelName,
                ""
              ),
              [columnName]: columnWidth,
            },
          })
        );
      } else {
        localStorage.setItem(
          "columnWidth",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("columnWidth") as string),
            [modelName]: { [columnName]: columnWidth },
          })
        );
      }
    } else {
      localStorage.setItem(
        "columnWidth",
        JSON.stringify({ [modelName]: { [columnName]: columnWidth } })
      );
    }
  };

  const tableDataSetter = () => {
    setLoadingData(true);
    setColDefs([
      ...tableHeaders
        .concat(
          listSelector
            ? [{ columnName: "", label: "", dataType: "singleline" }]
            : []
        )
        .map((header, headerIndex) => {
          const CellRenderer = (rowData: any) => {
            const { data, rowIndex, value } = rowData;
            let isLinkEnabled = !checkForDelete;
            if (checkForDelete) {
              if (
                !modelName ||
                !Object.keys(deleteSessionData)?.length ||
                !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
                !data?.id
              ) {
                isLinkEnabled = true;
              } else {
                if (!modelName) return;
                const idArray: string[] = [];
                for (const key in deleteSessionData?.[modelName]) {
                  idArray.push(...deleteSessionData?.[modelName][key]);
                }
                isLinkEnabled = idArray.includes(data.id) ? false : true;
              }
            }
            if (
              header.columnName === "" &&
              header.label === "" &&
              listSelector
            ) {
              return (
                <div
                  className="px-6 py-3"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!isLinkEnabled) return;
                    openingRecordId && openingRecordId === data?.id
                      ? null
                      : onItemSelect(data);
                    MixpanelActions.track(
                      `${modelName}-genericList-toggle-item-select-${data.id}:action-click`,
                      { type: "click" }
                    );
                    setGridSizeChanged(true);
                  }}
                  id={`td-select-${rowIndex}`}
                >
                  <div className={`flex ${alignText}`}>
                    {openingRecordId && openingRecordId === data?.id ? (
                      <Loading />
                    ) : selectedItems?.filter((sItem) => sItem.id === data.id)
                        .length === 0 ? (
                      <input
                        type={selectMode}
                        data-testid={`${rowIndex}-${
                          insertInDataTestId ? `${insertInDataTestId}-` : ""
                        }list-selector`}
                        name={
                          radioName ? `${radioName}_selector` : "list_selector"
                        }
                        checked={false}
                        readOnly={true}
                        disabled={!isLinkEnabled}
                        className="cursor-pointer"
                        style={{
                          width: "18px",
                          height: "18px",
                          opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                        }}
                      />
                    ) : (
                      <input
                        type={selectMode}
                        name={
                          radioName ? `${radioName}_selector` : "list_selector"
                        }
                        data-testid={`${rowIndex}-${
                          insertInDataTestId ? `${insertInDataTestId}-` : ""
                        }list-selector`}
                        checked={true}
                        readOnly={true}
                        disabled={!isLinkEnabled}
                        className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                        style={{
                          width: "18px",
                          height: "18px",
                          opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            } else if (header.columnName === "actions" && header.render) {
              return (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setGridSizeChanged(true);
                  }}
                >
                  {header.render(data, rowIndex)}
                </div>
              );
            } else {
              return (
                <div
                  key={`${rowIndex}-inner`}
                  className={`py-0 ${alignText}`}
                  id={`td-${header.label}`}
                >
                  <GenericTableCellWrapper
                    {...{
                      item: data,
                      header,
                      rowUrlGenerator,
                      handleRowClick,
                      showIcons,
                      fieldsList,
                      onDetail,
                      modelName: externalModelName
                        ? externalModelName
                        : modelName,
                      alignText,
                      target,
                      imageSize,
                      includeUrlWithRender,
                      outerIndex: rowIndex,
                      dataProcessed,
                      dataProcessing,
                      truncate: false,
                      includeFlagInPhoneNumber,
                      isLinkEnabled,
                      openingRecordId,
                      viewType: "Card",
                      setOpeningRecordId,
                      richTextOverflowScroll,
                      columnFixedWidth,
                      showFieldEditInput,
                    }}
                  />
                </div>
              );
            }
          };
          const CustomHeader = ({ column }: { column: any }) => {
            if (column.colId === "actions" || column.colId === "0") {
              return <div>{header.label}</div>;
            }
            return (
              <GenericListHeader
                key={column.colId}
                index={column.colId}
                tableHeaders={tableHeaders}
                header={header}
                alignText={alignText}
                listSelector={listSelector}
                containsActionHeader={containsActionHeader}
                sortingFieldList={sortingFieldList}
                addSorting={addSorting}
                handleSorting={(value) => {
                  handleSorting(value);
                  setGridSizeChanged(true);
                }}
              />
            );
          };

          let commonHeaderProperties: any = {
            headerName: header.label,
            field: header.columnName,
            headerComponent: memo(CustomHeader),
            cellRenderer: memo(CellRenderer),
            headerClass: "my-ag-grid-header",
            minWidth: 180,
            cellStyle: (params: any) => {
              return {
                padding: "7.5px 0px",
                margin: 0,
                fontFamily: "Poppins,Helvetica Neue,Arial,Helvetica,sans-serif",
                fontSize: "13px",
                lineHeight: "20px",
                display: "flex",
                alignItems: "center",
                border: "none",
                outline: "none",
                overflow: "visible",
              };
            },
          };

          if (allowNewGridInBuiltSorting) {
            delete commonHeaderProperties?.headerComponent;
          }

          if (header.columnName === "" && header.label === "") {
            return {
              ...commonHeaderProperties,
              pinned: "left",
              minWidth: listSelector ? 80 : 120,
              maxWidth: listSelector ? 80 : 120,
              resizable: false,
              sortable: false,
              flex: 1,
            };
          }

          if (header.columnName === "actions" && header.render) {
            return {
              ...commonHeaderProperties,
              pinned: "right",
              minWidth: 150,
              maxWidth: 150,
              resizable: false,
              sortable: false,
              flex: 1,
            };
          }

          if (columnWidth && columnWidth[header.label]) {
            return {
              ...commonHeaderProperties,
              width: columnWidth[header.label],
              sortable: allowNewGridInBuiltSorting ? true : false,
              autoHeight: true,
            };
          }

          if (header.dataType === "phoneNumber") {
            return {
              ...commonHeaderProperties,
              flex: 1,
              sortable: allowNewGridInBuiltSorting ? true : false,
              minWidth: 250,
              autoHeight: true,
            };
          }

          return {
            ...commonHeaderProperties,
            flex: 1,
            sortable: allowNewGridInBuiltSorting ? true : false,
            autoHeight: true,
          };
        }),
    ]);
    setGridSizeChanged(false);
    setLoadingData(false);
  };

  React.useEffect(() => {
    if (
      tableHeaders?.length > 0 &&
      data?.length > 0 &&
      fieldsList?.length > 0 &&
      gridSizeChanged
    ) {
      if (
        prevData?.data &&
        data &&
        JSON.stringify(prevData?.data) === JSON.stringify(data) &&
        JSON.stringify(prevSelectedList?.selectedItems) ===
          JSON.stringify(selectedItems)
      )
        return;
      tableDataSetter();
    }
  }, [
    data,
    fieldsList,
    gridSizeChanged,
    JSON.stringify(prevSelectedList?.selectedItems) ===
      JSON.stringify(selectedItems),
  ]);

  React.useEffect(() => {
    if (data.length > 0 && fieldsList.length > 0) {
      setGridSizeChanged(true);
    }
  }, [data, fieldsList, selectedItems]);

  React.useEffect(() => {
    if (fieldsList?.length <= 0 && data?.length > 0) {
      setGridSizeChanged(true);
    }
  }, [data]);

  React.useEffect(() => {
    if (fieldsList?.length > 0) return;
    if (gridSizeChanged) {
      setLoadingData(true);
      const updatedColDefs = [
        ...tableHeaders
          .concat(
            listSelector
              ? [{ columnName: "", label: "", dataType: "singleline" }]
              : []
          )
          .map((header, headerIndex) => {
            const CellRenderer = (rowData: any) => {
              const { data, rowIndex, value } = rowData;
              let isLinkEnabled = !checkForDelete;
              if (checkForDelete) {
                if (
                  !modelName ||
                  !Object.keys(deleteSessionData)?.length ||
                  !Object.keys(deleteSessionData?.[modelName] || {})?.length ||
                  !data?.id
                ) {
                  isLinkEnabled = true;
                } else {
                  if (!modelName) return;
                  const idArray: string[] = [];
                  for (const key in deleteSessionData?.[modelName]) {
                    idArray.push(...deleteSessionData?.[modelName][key]);
                  }
                  isLinkEnabled = idArray.includes(data.id) ? false : true;
                }
              }
              if (
                header.columnName === "" &&
                header.label === "" &&
                listSelector
              ) {
                return (
                  <div
                    className="px-6 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLinkEnabled) return;
                      openingRecordId && openingRecordId === data?.id
                        ? null
                        : onItemSelect(data);
                      MixpanelActions.track(
                        `${modelName}-genericList-toggle-item-select-${data.id}:action-click`,
                        { type: "click" }
                      );
                      setGridSizeChanged(true);
                    }}
                    id={`td-select-${rowIndex}`}
                  >
                    <div className={`flex ${alignText}`}>
                      {openingRecordId && openingRecordId === data?.id ? (
                        <Loading />
                      ) : selectedItems?.filter((sItem) => sItem.id === data.id)
                          .length === 0 ? (
                        <input
                          type={selectMode}
                          data-testid={`${rowIndex}-${
                            insertInDataTestId ? `${insertInDataTestId}-` : ""
                          }list-selector`}
                          name={
                            radioName
                              ? `${radioName}_selector`
                              : "list_selector"
                          }
                          checked={false}
                          readOnly={true}
                          disabled={!isLinkEnabled}
                          className="cursor-pointer"
                          style={{
                            width: "18px",
                            height: "18px",
                            opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                          }}
                        />
                      ) : (
                        <input
                          type={selectMode}
                          name={
                            radioName
                              ? `${radioName}_selector`
                              : "list_selector"
                          }
                          data-testid={`${rowIndex}-${
                            insertInDataTestId ? `${insertInDataTestId}-` : ""
                          }list-selector`}
                          checked={true}
                          readOnly={true}
                          disabled={!isLinkEnabled}
                          className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                          style={{
                            width: "18px",
                            height: "18px",
                            opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              } else if (header.columnName === "actions" && header.render) {
                return (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setGridSizeChanged(true);
                    }}
                  >
                    {header.render(data, rowIndex)}
                  </div>
                );
              } else {
                return (
                  <div
                    key={`${rowIndex}-inner`}
                    className={`py-0 ${alignText}`}
                    id={`td-${header.label}`}
                  >
                    <GenericTableCellWrapper
                      {...{
                        item: data,
                        header,
                        rowUrlGenerator,
                        handleRowClick,
                        showIcons,
                        fieldsList,
                        onDetail,
                        modelName: externalModelName
                          ? externalModelName
                          : modelName,
                        alignText,
                        target,
                        imageSize,
                        includeUrlWithRender,
                        outerIndex: rowIndex,
                        dataProcessed,
                        dataProcessing,
                        truncate: false,
                        includeFlagInPhoneNumber,
                        isLinkEnabled,
                        openingRecordId,
                        viewType: "Card",
                        setOpeningRecordId,
                        showFieldEditInput,
                        appName,
                        updateModelFieldData,
                        columnFixedWidth,
                      }}
                    />
                  </div>
                );
              }
            };
            let commonHeaderProperties = {
              headerName: header.label,
              field: header.columnName,
              cellRenderer: memo(CellRenderer),
              headerClass: "my-ag-grid-header",
              minWidth: 180,
              cellStyle: (params: any) => {
                return {
                  padding: "7.5px 0px",
                  margin: 0,
                  fontFamily:
                    "Poppins,Helvetica Neue,Arial,Helvetica,sans-serif",
                  fontSize: "13px",
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  outline: "none",
                  overflow: "visible",
                };
              },
            };

            if (header.columnName === "" && header.label === "") {
              return {
                ...commonHeaderProperties,
                pinned: "left",
                minWidth: listSelector ? 80 : 120,
                maxWidth: listSelector ? 80 : 120,
                resizable: false,
                sortable: false,
                flex: 1,
              };
            }

            if (header.columnName === "actions" && header.render) {
              return {
                ...commonHeaderProperties,
                pinned: "right",
                minWidth: 150,
                maxWidth: 150,
                resizable: false,
                sortable: false,
                flex: 1,
              };
            }

            if (columnWidth && columnWidth[header.label]) {
              return {
                ...commonHeaderProperties,
                width: columnWidth[header.label],
                sortable:
                  header.dataType === "multiSelectRecordLookup" ||
                  header.dataType === "multiSelectLookup"
                    ? false
                    : header.render
                    ? false
                    : true,
                autoHeight: true,
              };
            }

            if (header.dataType === "phoneNumber") {
              return {
                ...commonHeaderProperties,
                flex: 1,
                sortable: true,
                minWidth: 250,
                autoHeight: true,
              };
            }

            return {
              ...commonHeaderProperties,
              flex: 1,
              sortable:
                header.dataType === "multiSelectRecordLookup" ||
                header.dataType === "multiSelectLookup"
                  ? false
                  : header.render
                  ? false
                  : true,
              autoHeight: true,
            };
          }),
      ];
      setColDefs([...updatedColDefs]);
      setLoadingData(false);
      setGridSizeChanged(false);
    }
  }, [gridSizeChanged, data]);

  React.useEffect(() => {
    if (gridApi) {
      gridApi.setQuickFilter(filterValue);
    }
  }, [filterValue]);

  React.useEffect(() => {
    if (document.getElementsByClassName("ag-header-cell-label")) {
      for (
        let i = 0;
        i < document.getElementsByClassName("ag-header-cell-label").length;
        i++
      ) {
        document
          .getElementsByClassName("ag-header-cell-label")
          [i].setAttribute(
            "data-testid",
            `table-header-${_.get(tableHeaders[i], "label", "")}`
          );
      }
    }
  }, [gridApi]);

  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);

  React.useEffect(() => {
    if (shiftTableBodyBy && tableBodyRef.current) {
      tableBodyRef.current.style.top = shiftTableBodyBy + "px";
    }
  }, [shiftTableBodyBy, tableBodyRef]);

  if (!data?.length && !renderHeaderIfNoData) return null;

  if (oldGenericListUI) {
    return (
      <div className="relative w-full scrollbar rounded-md bg-white">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          {hideHeader ? (
            <></>
          ) : (
            <thead
              className={`text-xs md:text-sm bg-vryno-table-background top-0 z-[100] ${
                stickyHeader && "sticky"
              }`}
            >
              <tr className={`${makeFirstColumnSticky ? "sticky" : ""}`}>
                {listSelector && (
                  <th
                    id={`table-header-Selector`}
                    scope="col"
                    className="px-6 py-3 rounded-l-md"
                  />
                )}
                {tableHeaders.map((header, index) =>
                  header.columnName === "actions" ? (
                    <th
                      id={`table-header-${header.label}`}
                      key={`${index}-main-header`}
                      scope="col"
                      className={`px-6 py-3 sticky right-0 bg-vryno-table-background text-black font-medium rounded-r-md ${alignText}`}
                    >
                      <span data-testid={paramCase(header.columnName)}>
                        {header.label}
                      </span>
                    </th>
                  ) : (
                    <GenericOldListHeader
                      key={index}
                      index={index}
                      tableHeaders={tableHeaders}
                      header={header}
                      alignText={alignText}
                      listSelector={listSelector}
                      containsActionHeader={containsActionHeader}
                      sortingFieldList={sortingFieldList}
                      addSorting={addSorting}
                      handleSorting={handleSorting}
                      columnFixedWidth={columnFixedWidth}
                    />
                  )
                )}
              </tr>
            </thead>
          )}
          <tbody
            className={shiftTableBodyBy ? `relative` : ""}
            ref={tableBodyRef}
          >
            {!data?.length && showNoDataMessage ? (
              <div className="w-full h-full text-sm flex items-center justify-center bg-white text-gray-500">
                {/* <span>No Data Found</span> */}
              </div>
            ) : !data?.length ? (
              <div className="w-full h-full text-sm flex items-center justify-center bg-white text-gray-500">
                <span>No Data Found</span>
              </div>
            ) : (
              data.map((item, outerIndex) => {
                let isLinkEnabled = !checkForDelete;
                if (checkForDelete) {
                  if (
                    !modelName ||
                    !Object.keys(deleteSessionData)?.length ||
                    !Object.keys(deleteSessionData?.[modelName] || {})
                      ?.length ||
                    !item?.id
                  ) {
                    isLinkEnabled = true;
                  } else {
                    if (!modelName) return;
                    const idArray: string[] = [];
                    for (const key in deleteSessionData?.[modelName]) {
                      idArray.push(...deleteSessionData?.[modelName][key]);
                    }
                    isLinkEnabled = idArray.includes(item.id) ? false : true;
                  }
                }
                return (
                  <tr
                    id={`details-${item?.id}`}
                    className={`${
                      openingRecordId && openingRecordId === item?.id
                        ? "bg-vryno-theme-item-loading-background"
                        : item?.bgColor
                        ? item?.bgColor
                        : "bg-white"
                    } ${
                      openingRecordId && openingRecordId === item?.id
                        ? ""
                        : "hover:bg-gray-50"
                    } ${
                      outerIndex === data.length - 1 && data.length !== 1
                        ? ""
                        : applyBottomBorderBetweenRows
                        ? "border-b"
                        : ""
                    } ${showBGColor ? "bg-vryno-light-gray" : ""} ${
                      makeFirstColumnSticky && outerIndex == 0 ? "sticky" : ""
                    }`}
                    key={`${outerIndex}-outer-row`}
                  >
                    {listSelector && (
                      <td
                        className="px-6 py-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLinkEnabled) return;
                          openingRecordId && openingRecordId === item?.id
                            ? null
                            : onItemSelect(item);
                          MixpanelActions.track(
                            `${modelName}-genericList-toggle-item-select-${item.id}:action-click`,
                            { type: "click" }
                          );
                        }}
                        id={`td-select-${outerIndex}`}
                      >
                        <div className={`flex ${alignText}`}>
                          {openingRecordId && openingRecordId === item?.id ? (
                            <Loading />
                          ) : selectedItems?.filter(
                              (sItem) => sItem.id === item.id
                            ).length === 0 ? (
                            <input
                              type={selectMode}
                              data-testid={`${outerIndex}-${
                                insertInDataTestId
                                  ? `${insertInDataTestId}-`
                                  : ""
                              }list-selector`}
                              name={
                                radioName
                                  ? `${radioName}_selector`
                                  : "list_selector"
                              }
                              checked={false}
                              readOnly={true}
                              disabled={!isLinkEnabled}
                              className="cursor-pointer"
                              style={{
                                width: "18px",
                                height: "18px",
                                opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                              }}
                            />
                          ) : (
                            <input
                              type={selectMode}
                              name={
                                radioName
                                  ? `${radioName}_selector`
                                  : "list_selector"
                              }
                              data-testid={`${outerIndex}-${
                                insertInDataTestId
                                  ? `${insertInDataTestId}-`
                                  : ""
                              }list-selector`}
                              checked={true}
                              readOnly={true}
                              disabled={!isLinkEnabled}
                              className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer"
                              style={{
                                width: "18px",
                                height: "18px",
                                opacity: `${!isLinkEnabled ? "0.6" : ""}`,
                              }}
                            />
                          )}
                        </div>
                      </td>
                    )}
                    {tableHeaders.map((header, innerIndex) =>
                      header.columnName === "actions" && header.render ? (
                        header.render(item, outerIndex)
                      ) : (
                        <td
                          key={`${innerIndex}-inner`}
                          className={`py-0 ${alignText}`}
                          id={`td-${header.label}-${outerIndex}`}
                        >
                          <GenericTableCellWrapper
                            {...{
                              item,
                              header,
                              rowUrlGenerator,
                              handleRowClick,
                              showIcons,
                              fieldsList,
                              onDetail,
                              modelName: externalModelName
                                ? externalModelName
                                : modelName,
                              alignText,
                              target,
                              imageSize,
                              includeUrlWithRender,
                              outerIndex,
                              dataProcessed,
                              dataProcessing,
                              truncate,
                              includeFlagInPhoneNumber,
                              isLinkEnabled,
                              openingRecordId,
                              setOpeningRecordId,
                              columnFixedWidth,
                              showFieldEditInput,
                            }}
                          />
                        </td>
                      )
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div style={containerStyle} className="w-full rounded-md bg-white ">
        <div className="ag-theme-quartz w-full" style={gridStyle}>
          {loadingData && colDefs?.length <= 0 ? (
            <GenericSkeletonList itemCount={4} />
          ) : (
            <AgGridReact
              ref={gridRef}
              rowData={data?.map((item, index) => {
                return {
                  ...item,
                  uniqueIndex: index,
                };
              })}
              columnDefs={colDefs}
              getRowId={getRowId}
              rowBuffer={rowBuffer}
              rowSelection={rowSelection}
              gridOptions={{
                suppressRowTransform: true,
                suppressMovableColumns: true,
                suppressColumnVirtualisation: true,
                suppressRowVirtualisation: true,
                rowModelType: "clientSide",
                cacheBlockSize: 100,
                maxBlocksInCache: 100,
                pagination: false,
                paginationPageSize: 100,
                rowBuffer: 100,
                getRowHeight: function (params: any) {
                  const lineHeight = 60; // Approximate line height
                  const numLines = params.data.make
                    ? params.data.make.split("\n").length
                    : 1; // Count the number of lines in the content
                  return lineHeight * numLines + 10; // Calculate the height based on the number of lines and add padding
                },
              }}
              disableStaticMarkup={true}
              enableCellChangeFlash={false}
              suppressAnimationFrame={false}
              animateRows={false}
              onColumnResized={onColumnResized}
              onGridReady={onGridReady}
              onDragStopped={handleDragStopped}
            />
          )}
        </div>
      </div>
    );
  }
}

export default React.memo(GenericList);
