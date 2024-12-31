import { Formik } from "formik";
import React, { useRef } from "react";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import MoreInfo from "remixicon-react/QuestionFillIcon";
import { ClickOutsideToClose } from "../../../../../components/TailwindControls/shared/ClickOutsideToClose";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import Switch from "react-switch";
import { IUserPreference } from "../../../../../models/shared";
import PaginationMini from "../../shared/components/PaginationMini";

export type GenericWidgetCardProps = {
  widgetName: string;
  widgetId: string;
  filterIsActive?: string;
  setFilterIsActive?: (value: string) => void;
  children?: React.ReactElement;
  handleFilterSelection?: (
    value: "null" | "day" | "week" | "month" | "year"
  ) => void;
  showFilterBar?: boolean;
  showCardInfo?: boolean;
  infoArray?: Array<{ value: string; label: string }>;
  externalFilterBar?: Array<{ value: string; label: string }>;
  showPagination?: boolean;
  showPageChanger?: boolean;
  showPageCount?: boolean;
  userPreferences: IUserPreference[];
  totalRecords?: number;
  currentPageNumber: number;
  currentPageItemCount: number;
  pageSize?: number;
  handlePageChange?: (
    filter: "null" | "day" | "week" | "month" | "year",
    pageNumber: number
  ) => void;
  handleWidgetViewOnPreference: (id: string, value: boolean) => void;
};

export const GenericWidgetCard = ({
  widgetName,
  filterIsActive,
  setFilterIsActive = () => {},
  children,
  infoArray,
  handleFilterSelection = () => {},
  showFilterBar = true,
  showCardInfo = true,
  externalFilterBar = [],
  widgetId,
  totalRecords = 0,
  showPagination = true,
  showPageChanger = true,
  userPreferences,
  currentPageItemCount,
  currentPageNumber,
  pageSize = 50,
  showPageCount,
  handlePageChange = () => {},
  handleWidgetViewOnPreference,
}: GenericWidgetCardProps) => {
  const refCloseMoreInfo = useRef(null);
  const [moreInfoVisible, setMoreInfoVisible] = React.useState(false);
  ClickOutsideToClose(refCloseMoreInfo, (value: boolean) =>
    setMoreInfoVisible(value)
  );
  const [colSpanStatus, setColSpanStatus] = React.useState(false);

  React.useEffect(() => {
    let foundValue =
      userPreferences?.[0]?.defaultPreferences?.expandWidgetStatus?.filter(
        (value: { id: string; value: boolean }) => value.id === widgetId
      );

    setColSpanStatus(foundValue?.length ? foundValue[0].value : false);
  }, [userPreferences]);

  return (
    <div
      id={`${widgetName}-${widgetId}`}
      className={`bg-white w-full h-80 max-h-80 rounded-[8px] overflow-y-hidden pb-3 ${
        colSpanStatus ? "col-span-full" : ""
      }`}
    >
      <div
        className={`w-full flex items-center justify-between py-2 border-b px-4`}
      >
        <span
          className="font-medium truncate flex justify-center gap-x-2"
          data-testid={`${widgetName}-widget-name`}
        >
          <Switch
            id={`switch-button-${widgetName}-${widgetId}`}
            name={"user-switch"}
            checked={colSpanStatus}
            onChange={() => {
              if (widgetId) {
                handleWidgetViewOnPreference(widgetId, !colSpanStatus);
              }
            }}
            onColor="#4DBE8D"
            offColor="#DBDBDB"
            width={44}
            height={23}
            handleDiameter={12}
          />
          <span className="truncate">{widgetName}</span>
        </span>
        <div className="flex items-center gap-x-3">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <Formik
              initialValues={{ filterSelected: filterIsActive }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, setFieldValue }) => (
                <div className="flex items-center gap-x-3">
                  {showPagination && totalRecords > 0 && (
                    <PaginationMini
                      containerName={widgetName}
                      itemsCount={totalRecords}
                      currentPageNumber={currentPageNumber}
                      onPageChange={(pageNumber) =>
                        handlePageChange(
                          values["filterSelected"] as
                            | "null"
                            | "day"
                            | "week"
                            | "month"
                            | "year",
                          pageNumber
                        )
                      }
                      currentPageItemCount={currentPageItemCount}
                      showPageChanger={showPageChanger}
                      showPageCount={showPageCount}
                      pageSize={pageSize}
                    />
                  )}
                  <div className={`${showFilterBar ? "" : "hidden"} w-32`}>
                    <FormDropdown
                      name={"filterSelected"}
                      options={
                        externalFilterBar?.length > 0
                          ? externalFilterBar
                          : [
                              { value: "null", label: "None" },
                              { value: "day", label: "Day" },
                              { value: "week", label: "Week" },
                              { value: "month", label: "Month" },
                              { value: "year", label: "Year" },
                            ]
                      }
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "filterSelected",
                          selectedOption.currentTarget.value
                        );
                        setFilterIsActive(selectedOption.currentTarget.value);
                        handleFilterSelection(
                          selectedOption.currentTarget.value
                        );
                      }}
                      placeholder="Select"
                      allowMargin={false}
                    />
                  </div>
                </div>
              )}
            </Formik>
          </form>
          <div
            ref={refCloseMoreInfo}
            className={`relative inline-block ${showCardInfo ? "" : "hidden"}`}
          >
            <Button
              id="widget-card-show-more-info"
              onClick={(e) => {
                e.stopPropagation();
                setMoreInfoVisible(!moreInfoVisible);
              }}
              customStyle=""
              userEventName="widget-card-showMore-info:toggle-click"
            >
              <MoreInfo
                className={`text-gray-300 cursor-pointer hover:text-vryno-theme-light-blue ${
                  moreInfoVisible ? "text-vryno-theme-light-blue" : ""
                }`}
              />
            </Button>
            {moreInfoVisible && infoArray && infoArray?.length > 0 && (
              <div
                className="origin-top-right absolute right-0 z-40 p-2 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                id="moreInfo"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                {infoArray &&
                  infoArray.map((info, index) => (
                    <div key={index} className="mb-2">
                      <span className="text-sm font-bold block">
                        {info.label}
                      </span>
                      <span className="text-xs text-vryno-label-gray">
                        {info.value}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`w-full h-full`}>{children}</div>
    </div>
  );
};
