import React from "react";
import GridIcon from "remixicon-react/LayoutGridLineIcon";
import ListIcon from "remixicon-react/ListCheck2Icon";
import MenuIcon from "remixicon-react/Menu2LineIcon";
import {
  IKanbanViewData,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { AddKanbanView } from "../../generic/GenericKanbanView/AddKanbanView";
import { ICustomField } from "../../../../../models/ICustomField";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import SettingsIcon from "remixicon-react/ListSettingsFillIcon";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import Link from "next/link";
import { appsUrlGenerator } from "../utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import { paramCase } from "change-case";

const ViewStoreKey = "currentView";

const DashboardViewSelector = (
  currentView: SupportedDashboardViews,
  setCurrentView: React.Dispatch<React.SetStateAction<SupportedDashboardViews>>,
  modelName: string,
  lookupFieldsList: ICustomField[],
  numberFieldsList: ICustomField[],
  currencyField: ICustomField,
  fieldsList: ICustomField[],
  KVData: IKanbanViewData | null,
  setKVData: (value: IKanbanViewData) => void,
  sortingFieldList:
    | {
        name: string;
        order: "ASC" | "DESC" | "None";
      }[]
    | undefined = [],
  KViewDataLoading: boolean
) => {
  const [kanbanViewModal, setKanbanViewModal] = React.useState<{
    visible: boolean;
    data: IKanbanViewData | null;
    edit: boolean;
  }>({
    visible: false,
    data: null,
    edit: false,
  });
  const [kanbanMenuVisible, setKanbanMenuVisible] = React.useState(false);
  const wrapperRef = React.useRef(null);
  ClickOutsideToClose(wrapperRef, (value) => setKanbanMenuVisible(value));

  return (
    <>
      <div
        className={`h-10 w-36 rounded-md bg-white border grid p-1 col-span-3 sm:col-span-1 gap-1 ${
          KVData ? "grid-cols-4" : "grid-cols-3"
        }`}
      >
        <Link
          href={appsUrlGenerator(
            SupportedApps.crm,
            modelName,
            AllowedViews.view,
            SupportedDashboardViews.Card.toLocaleLowerCase()
          )}
          legacyBehavior
        >
          <a
            id={`${modelName}-grid-view`}
            data-testid={paramCase(`${modelName}-grid-view`)}
            className={`rounded-md flex flex-row items-center justify-center ${
              currentView === SupportedDashboardViews.Card
                ? "bg-vryno-theme-light-blue"
                : ""
            } ${
              sortingFieldList?.length > 0
                ? "bg-gray-200 pointer-events-none cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={(e) => {
              if (sortingFieldList?.length > 0) return;

              setCurrentView(SupportedDashboardViews.Card);
              sessionStorage.setItem(
                ViewStoreKey,
                SupportedDashboardViews.Card
              );
            }}
          >
            <GridIcon
              className={`${
                currentView === SupportedDashboardViews.Card
                  ? "text-white"
                  : "text-vryno-theme-light-blue"
              }`}
              size={20}
            />
          </a>
        </Link>
        <Link
          href={appsUrlGenerator(
            SupportedApps.crm,
            modelName,
            AllowedViews.view,
            SupportedDashboardViews.List.toLocaleLowerCase()
          )}
          legacyBehavior
        >
          <a
            id={`${modelName}-list-view`}
            data-testid={paramCase(`${modelName}-list-view`)}
            className={`rounded-md flex flex-row items-center justify-center cursor-pointer ${
              currentView === SupportedDashboardViews.List
                ? "bg-vryno-theme-light-blue"
                : ""
            }`}
            onClick={(e) => {
              setCurrentView(SupportedDashboardViews.List);
              sessionStorage.setItem(
                ViewStoreKey,
                SupportedDashboardViews.List
              );
            }}
          >
            <ListIcon
              className={`${
                currentView === SupportedDashboardViews.List
                  ? "text-white"
                  : "text-vryno-theme-light-blue"
              }`}
              size={20}
            />
          </a>
        </Link>
        <Link
          href={appsUrlGenerator(
            SupportedApps.crm,
            modelName,
            AllowedViews.view,
            SupportedDashboardViews.Kanban.toLocaleLowerCase()
          )}
          legacyBehavior
        >
          <a
            id={`${modelName}-kanban-view`}
            data-testid={paramCase(`${modelName}-kanban-view`)}
            className={`${
              KVData ? "col-span-2" : "col-span-1"
            } w-full h-full rounded-md flex ${
              currentView === SupportedDashboardViews.Kanban
                ? "bg-vryno-theme-light-blue"
                : "border"
            } ${
              KViewDataLoading || sortingFieldList?.length > 0
                ? "bg-gray-200 pointer-events-none cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={(e) => {
              if (KViewDataLoading) return;
              if (sortingFieldList?.length > 0) return;
              if (kanbanMenuVisible) setKanbanMenuVisible(false);
              setCurrentView(SupportedDashboardViews.Kanban);
              sessionStorage.setItem(
                ViewStoreKey,
                SupportedDashboardViews.Kanban
              );
              if (KVData) return;
              setKanbanViewModal({
                visible: true,
                data: null,
                edit: false,
              });
            }}
          >
            <div
              className={`grid w-full h-full ${
                KVData ? "grid-cols-2" : "grid-cols-1"
              }`}
              ref={wrapperRef}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MenuIcon
                  className={`${
                    currentView === SupportedDashboardViews.Kanban
                      ? "text-white"
                      : "text-vryno-theme-light-blue"
                  }`}
                  size={20}
                />
              </div>
              {KVData ? (
                <Button
                  id={`${modelName}-kanban-view-edit-dropdown`}
                  customStyle={`relative inline-block cursor-pointer w-full h-full flex items-center justify-center border-l`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    !sortingFieldList?.length &&
                      setKanbanMenuVisible(!kanbanMenuVisible);
                  }}
                  disabled={sortingFieldList?.length > 0}
                  userEventName={`${modelName}-kanban-view-edit-dropdown:toggle-click`}
                >
                  <>
                    <span
                      id="open-card-menu"
                      className="w-full h-full flex flex-row justify-center items-center"
                    >
                      {kanbanMenuVisible ? (
                        <ChevronUpIcon
                          size={20}
                          className={`${
                            currentView === SupportedDashboardViews.Kanban
                              ? "text-white"
                              : "text-vryno-dropdown-icon"
                          }`}
                        />
                      ) : (
                        <ChevronDownIcon
                          size={20}
                          className={`${
                            currentView === SupportedDashboardViews.Kanban
                              ? "text-white"
                              : "text-vryno-dropdown-icon"
                          }`}
                        />
                      )}
                    </span>
                    {kanbanMenuVisible && (
                      <div
                        className={`origin-top-right absolute right-0 z-[1000] mt-2 w-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                      >
                        <Button
                          id={`${modelName}-kanban-view-edit`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setKanbanViewModal({
                              visible: true,
                              data: KVData || null,
                              edit: KVData ? true : false,
                            });
                            setKanbanMenuVisible(false);
                          }}
                          customStyle={`w-20 p-2 flex flex-row items-center justify-center border border-t-0 border-gray-100 text-xs ${
                            KVData
                              ? "bg-gray-100 hover:bg-vryno-dropdown-hover"
                              : "bg-gray-200"
                          }`}
                          userEventName={`${modelName}-kanban-view-edit:action-click`}
                          disabled={
                            sortingFieldList?.length > 0
                              ? true
                              : KVData
                              ? false
                              : true
                          }
                          renderChildrenOnly={true}
                        >
                          <>
                            <span>
                              <SettingsIcon
                                className={`${
                                  KVData
                                    ? "text-vryno-theme-light-blue"
                                    : "text-gray-600"
                                }`}
                                size={16}
                              />
                            </span>
                            <span className="truncate text-gray-600 ml-2">
                              Edit
                            </span>
                          </>
                        </Button>
                      </div>
                    )}
                  </>
                </Button>
              ) : (
                <></>
              )}
            </div>
          </a>
        </Link>
      </div>
      {kanbanViewModal.visible ? (
        <AddKanbanView
          kanbanViewModal={kanbanViewModal}
          setKanbanViewModal={(value: {
            visible: boolean;
            data: IKanbanViewData | null;
            edit: boolean;
          }) => setKanbanViewModal(value)}
          lookupFieldsList={lookupFieldsList}
          numberFieldsList={numberFieldsList}
          currencyField={currencyField}
          fieldsList={fieldsList}
          modelName={modelName}
          setKVData={setKVData}
          setCurrentView={setCurrentView}
        />
      ) : (
        <></>
      )}
    </>
  );
};
export default DashboardViewSelector;
