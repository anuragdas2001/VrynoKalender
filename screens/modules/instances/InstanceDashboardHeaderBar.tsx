import React from "react";
import { SupportedDashboardViews } from "../../../models/shared";
import Link from "next/link";
import GridIcon from "remixicon-react/LayoutGridLineIcon";
import ListIcon from "remixicon-react/ListCheck2Icon";
import CircleIcon from "remixicon-react/AddCircleFillIcon";
import Button from "../../../components/TailwindControls/Form/Button/Button";

export const ViewStoreKey = "currentView";
const InstanceViewSelector = (
  currentView: SupportedDashboardViews,
  setCurrentView: React.Dispatch<React.SetStateAction<SupportedDashboardViews>>
) => {
  return (
    <div className="h-10 w-24 rounded-md bg-white grid grid-cols-2 p-1 shadow-lg">
      <Button
        id="instance-screen-grid-view"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(SupportedDashboardViews.Card);
          sessionStorage.setItem(ViewStoreKey, SupportedDashboardViews.Card);
        }}
        customStyle={`rounded-md flex flex-row items-center justify-center cursor-pointer ${
          currentView === SupportedDashboardViews.Card
            ? "bg-vryno-theme-light-blue"
            : ""
        }`}
        userEventName="instance-screen-grid-view:action-click"
      >
        <GridIcon
          size={24}
          className={`${
            currentView === SupportedDashboardViews.Card
              ? "text-white"
              : "text-vryno-theme-light-blue"
          }`}
        />
      </Button>
      <Button
        id="instance-screen-list-view"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(SupportedDashboardViews.List);
          sessionStorage.setItem(ViewStoreKey, SupportedDashboardViews.List);
        }}
        customStyle={`rounded-md flex flex-row items-center justify-center cursor-pointer ${
          currentView === SupportedDashboardViews.List
            ? "bg-vryno-theme-light-blue"
            : ""
        }`}
        userEventName="instance-screen-list-view:action-click"
      >
        <ListIcon
          size={24}
          className={`${
            currentView === SupportedDashboardViews.List
              ? "text-white"
              : "text-vryno-theme-light-blue"
          }`}
        />
      </Button>
    </div>
  );
};
const InstanceViewButtonLoader = () => {
  return (
    <div className="h-10 w-24 animate-pulse rounded-md bg-vryno-theme-blue bg-opacity-10 p-1 shadow-lg" />
  );
};

export function InstanceDashboardHeaderBar(props: {
  headerTitle: string;
  loading: boolean | undefined;
  currentView: SupportedDashboardViews;
  setCurrentView: (
    value:
      | ((prevState: SupportedDashboardViews) => SupportedDashboardViews)
      | SupportedDashboardViews
  ) => void;
  onDesktopAddInstanceClick: () => void;
  addButtonText: string;
  onMobileAddInstanceClick: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <span className="text-lg font-semibold">{props.headerTitle}</span>
      <div className="flex justify-between gap-x-4 mt-4 sm:mt-0">
        {props.loading ? (
          InstanceViewButtonLoader()
        ) : (
          <>
            {InstanceViewSelector(props.currentView, props.setCurrentView)}
            <div className="sm:hidden">
              <Button
                id="m-add-instance"
                onClick={props.onDesktopAddInstanceClick}
                kind="primary"
                userEventName="add-instance-desktop:submit-click"
              >
                <span className={`flex items-center pr-1 w-full`}>
                  <CircleIcon size={20} className="mr-1" />
                  <span>{props.addButtonText}</span>
                </span>
              </Button>
            </div>
            <div className="hidden sm:flex">
              <Button
                id="d-add-instance"
                onClick={props.onMobileAddInstanceClick}
                kind="primary"
                userEventName="add-instance-mobile:submit-click"
              >
                <span className={`flex items-center pr-1 w-full`}>
                  <CircleIcon size={20} className="mr-1" />
                  <span>{props.addButtonText}</span>
                </span>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
