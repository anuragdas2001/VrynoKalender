import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { SupportedDashboardViews } from "../../../../../models/shared";
import { determineShowSelectItem } from "../../generic/GenericModelView/GenericDashboardDataDisplay";

export type SelectUnSelectAllButtonProps = {
  modelData: any[];
  selectedItems: any[];
  label?: string;
  labelClass?: string;
  currentDashboardView?: SupportedDashboardViews;
  handleSelectAllItems: () => void;
  handleUnselectAllItems: () => void;
};

export const SelectUnSelectAllButton = ({
  currentDashboardView,
  modelData,
  selectedItems,
  label,
  labelClass = "pl-2 text-sm text-gray-700",
  handleSelectAllItems,
  handleUnselectAllItems,
}: SelectUnSelectAllButtonProps) => {
  return (
    <div
      className={`flex flex-col justify-center sm:flex-row sm:items-center gap-x-4`}
    >
      {currentDashboardView != SupportedDashboardViews.Kanban &&
        determineShowSelectItem(modelData, selectedItems) && (
          <Button
            id="dashboard-select-all-records-button"
            customStyle="cursor-pointer flex whitespace-nowrap items-center"
            onClick={handleSelectAllItems}
            userEventName="dashboard-select-all-records:action-click"
            renderChildrenOnly={true}
          >
            <>
              <input
                type="checkbox"
                name="list_checkbox"
                checked={false}
                readOnly={true}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAllItems();
                }}
                className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
                style={{ width: "18px", height: "18px" }}
              />
              <span className={labelClass}>{label ? label : "Select all"}</span>
            </>
          </Button>
        )}
      {selectedItems.length > 0 && (
        <Button
          id="dashboard-unselect-all-records-button"
          customStyle="cursor-pointer flex whitespace-nowrap items-center"
          onClick={handleUnselectAllItems}
          userEventName="dashboard-unselect-all-records:action-click"
          renderChildrenOnly={true}
        >
          <>
            <input
              type="checkbox"
              name="list_checkbox"
              checked={true}
              readOnly={true}
              onClick={(e) => {
                e.stopPropagation();
                handleUnselectAllItems();
              }}
              className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
              style={{ width: "18px", height: "18px" }}
            />
            <span className={labelClass}>{label ? label : "Unselect all"}</span>
          </>
        </Button>
      )}
    </div>
  );
};
