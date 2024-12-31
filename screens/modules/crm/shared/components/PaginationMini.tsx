import React from "react";
import LeftArrowIcon from "remixicon-react/ArrowLeftSLineIcon";
import RightArrowIcon from "remixicon-react/ArrowRightSLineIcon";
import { getAppPathParts } from "../utils/getAppPathParts";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";

export const PageInfo = ({
  currentPageNumber,
  containerName,
  pagesCount,
  currentPageItemCount,
  itemsCount,
  showTotalCount = true,
  showPageCount = true,
  handleChangeRecordPerPage,
  pageSize,
}: {
  currentPageNumber: number;
  containerName: string;
  pagesCount: number;
  currentPageItemCount: number;
  itemsCount: number;
  showTotalCount?: boolean;
  showPageCount?: boolean;
  handleChangeRecordPerPage?: (value: number) => void;
  pageSize: number;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center">
      <span className="text-sm text-vryno-placeholder w-full text-right mt-1">
        <span
          data-testid={`name-${containerName}-pageNumber-${currentPageNumber}`}
        >
          {!showPageCount
            ? "Total Records"
            : `${currentPageNumber} of ${pagesCount} `}
        </span>
        <span className={`px-2 `}>{!showPageCount ? ":" : "/"}</span>
        <span
          data-testid={`name-${containerName}-${
            !showPageCount
              ? `item-count-${itemsCount}`
              : `item-from-${(currentPageNumber - 1) * pageSize + 1}-${
                  currentPageItemCount % pageSize !== 0
                    ? (currentPageNumber - 1) * pageSize + currentPageItemCount
                    : currentPageNumber * pageSize
                } of ${itemsCount}`
          }`}
        >
          {!showPageCount
            ? itemsCount
            : `${(currentPageNumber - 1) * pageSize + 1}-${
                currentPageItemCount % pageSize !== 0
                  ? (currentPageNumber - 1) * pageSize + currentPageItemCount
                  : currentPageNumber * pageSize
              } of ${showTotalCount ? itemsCount : "many"}`}
        </span>
      </span>
    </div>
  );
};

export type PaginationMiniProps = {
  itemsCount: number;
  pageSize?: number;
  containerName?: string;
  onPageChange: (
    pageNumber: number,
    pageType?: "first" | "back" | "next" | "last"
  ) => void;
  currentPageNumber: number;
  currentPageItemCount: number;
  disabledLastPage?: boolean;
  showTotalCount?: boolean;
  showPageCount?: boolean;
  pageInfoLocation?: "below" | "between";
  backgroundProcessRunning?: boolean;
  hidePagination?: boolean;
  showPageChanger?: boolean;
  handleChangeRecordPerPage?: (value: number) => void;
};

const PaginationMini = ({
  itemsCount,
  pageSize = 50,
  containerName,
  onPageChange = () => {},
  currentPageNumber,
  currentPageItemCount,
  showTotalCount,
  showPageCount,
  disabledLastPage = false,
  pageInfoLocation = "below",
  backgroundProcessRunning,
  showPageChanger = true,
  hidePagination,
  handleChangeRecordPerPage,
}: PaginationMiniProps) => {
  const { modelName } = getAppPathParts();
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const leftDisabled = currentPageNumber === 1;
  const rightDisabled = currentPageNumber == pagesCount;
  return (
    <>
      <div
        className={`flex w-full items-center gap-x-4 ${
          pageInfoLocation === "between" ? "justify-between" : "justify-end"
        } ${hidePagination ? "hidden" : ""}`}
      >
        <div className="whitespace-nowrap">
          <PageInfo
            containerName={containerName ? containerName : modelName}
            currentPageItemCount={currentPageItemCount}
            pagesCount={pagesCount}
            currentPageNumber={currentPageNumber}
            itemsCount={itemsCount}
            showTotalCount={showTotalCount}
            showPageCount={false}
            handleChangeRecordPerPage={handleChangeRecordPerPage}
            pageSize={pageSize}
          />
        </div>
        <div
          className={`flex flex-col items-center ${
            showPageChanger && pagesCount > 1 ? "" : "hidden"
          }`}
        >
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              id={`${
                containerName ? containerName : modelName
              }-pagination-previous`}
              onClick={(e) => {
                e.stopPropagation();
                onPageChange(currentPageNumber - 1, "back");
              }}
              disabled={leftDisabled}
              aria-current="page"
              customStyle={`z-10 relative inline-flex items-center px-1 py-1 border bg-white`}
              userEventName="pagination-previous-page:view-click"
            >
              {leftDisabled || backgroundProcessRunning ? (
                <LeftArrowIcon className="text-sm text-vryno-gray" />
              ) : (
                <LeftArrowIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>
            <span className="z-10 relative inline-flex items-center px-3 py-1 border bg-white text-gray-500">
              {currentPageNumber}
            </span>
            <Button
              id={`${
                containerName ? containerName : modelName
              }-pagination-next`}
              onClick={(e) => {
                e.stopPropagation();
                onPageChange(currentPageNumber + 1, "next");
              }}
              disabled={
                rightDisabled || backgroundProcessRunning || disabledLastPage
              }
              aria-current="page"
              customStyle={`z-10 relative inline-flex items-center px-1 py-1 border bg-white`}
              userEventName="pagination-next-page:view-click"
            >
              {rightDisabled || backgroundProcessRunning || disabledLastPage ? (
                <RightArrowIcon className="text-sm text-vryno-gray" />
              ) : (
                <RightArrowIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default PaginationMini;
