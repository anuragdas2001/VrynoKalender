import React, { useEffect, useRef } from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import Pagination from "../../shared/components/Pagination";
import { IWidget } from "../../../../../models/Dashboard";
import { setHeight } from "../../shared/utils/setHeight";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { ActionWrapper } from "../../shared/components/ActionWrapper";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import { useRouter } from "next/router";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { kebabCase } from "lodash";

export const systemDefinedWidgets = [
  "deal-pipeline",
  "revenue-via-closed-deals",
  "lead-by-source",
  "deal-forecast",
  "my-tasks",
  "my-meetings",
  "my-notes",
  "my-call-logs",
  "my-leads",
  "my-deals",
  "my-contacts",
  "my-organization",
];

export type WidgetDashboardProps = {
  widgets: IWidget[];
  itemsCount: number;
  currentPageNumber: number;
  handlePageChange: (pageNumber: number) => void;
  setDeleteModal: (value: { visible: boolean; item: IWidget }) => void;
  setAddEditWidgetModal: (value: {
    visible: boolean;
    item: IWidget | null;
    editMode: boolean;
  }) => void;
};

export const WidgetDashboard = ({
  widgets,
  itemsCount,
  currentPageNumber,
  setDeleteModal,
  handlePageChange,
  setAddEditWidgetModal,
}: WidgetDashboardProps) => {
  const router = useRouter();
  let { appName, modelName } = getAppPathParts();
  let tableHeaders = [
    {
      columnName: "name",
      label: "Widget Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "widgetType",
      label: "Widget Type",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "actions",
      label: "Actions",
      dataType: SupportedDataTypes.singleline,
      render: (item: IWidget, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2">
                <Button
                  id={`${
                    item.key || kebabCase(item.name)
                  }-widget-dashboard-edit`}
                  onClick={
                    systemDefinedWidgets.includes(item.key || "")
                      ? () => {}
                      : () =>
                          setAddEditWidgetModal({
                            visible: true,
                            item: item,
                            editMode: true,
                          })
                  }
                  customStyle=""
                  userEventName={`${
                    item.key || kebabCase(item.name)
                  }-widget-dashboard-edit:action-click`}
                >
                  <EditBoxIcon
                    size={20}
                    className={`${
                      systemDefinedWidgets.includes(item.key || "")
                        ? "text-vryno-theme-blue-disable"
                        : "text-vryno-theme-light-blue cursor-pointer"
                    }`}
                  />
                </Button>
                <Button
                  id={`${
                    item.key || kebabCase(item.name)
                  }-widget-dashboard-delete`}
                  onClick={() => {
                    !systemDefinedWidgets.includes(item.key || "")
                      ? setDeleteModal({
                          visible: true,
                          item: item,
                        })
                      : () => {};
                  }}
                  customStyle=""
                  userEventName={`${
                    item.key || kebabCase(item.name)
                  }-widget-dashboard-delete:action-click`}
                >
                  <DeleteBinIcon
                    size={20}
                    className={`${
                      !systemDefinedWidgets.includes(item.key || "")
                        ? "text-vryno-theme-light-blue cursor-pointer"
                        : "text-vryno-theme-blue-disable"
                    }`}
                  />
                </Button>
              </div>
            }
          />
        );
      },
    },
  ];

  const heightRefOne = useRef(null);
  useEffect(() => {
    if (heightRefOne) {
      setHeight(heightRefOne, 40);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <GenericBackHeader
        heading="Widget Dashboard"
        onClick={() => {
          router.push(`${appName}/${modelName}/dashboard`);
        }}
      >
        <div>
          <Button
            id={`add-widget-button`}
            onClick={() => {
              setAddEditWidgetModal({
                visible: true,
                item: null,
                editMode: false,
              });
            }}
            kind="primary"
            userEventName="open-add-widget-modal-click"
          >
            <span
              className={`px-4 sm:px-6 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
            >
              <AddIcon size={16} className="mr-2" />
              <span className="text-sm">Widget</span>
            </span>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="w-full flex flex-col mt-5 px-6">
        <div className="w-full h-full flex justify-end">
          <Pagination
            itemsCount={itemsCount}
            currentPageItemCount={widgets.length}
            pageSize={50}
            pageInfoLocation="between"
            onPageChange={(pageNumber) => handlePageChange(pageNumber)}
            currentPageNumber={currentPageNumber}
          />
        </div>
        <div className="bg-white pt-4 pb-1 px-4 rounded-xl mt-2">
          <div ref={heightRefOne} className={`overflow-y-auto`}>
            {widgets && (
              <GenericList
                tableHeaders={tableHeaders}
                data={widgets}
                onDetail={false}
                showIcons={false}
                listSelector={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
