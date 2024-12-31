import React from "react";
import RewindMiniFillIcon from "remixicon-react/RewindMiniFillIcon";
import SpeedMiniFillIcon from "remixicon-react/SpeedMiniFillIcon";
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
      <span className="text-xsm text-vryno-placeholder w-full text-right mt-1">
        <span
          className={`${showPageCount ? "" : "hidden"}`}
          data-testid={`${containerName}-${currentPageNumber}`}
        >{`Page ${currentPageNumber} of ${pagesCount} `}</span>
        <span className={`px-2 ${showPageCount ? "" : "hidden"}`}>{"|"}</span>
        <span
          data-testid={`${containerName}-${`${
            (currentPageNumber - 1) * pageSize + 1
          }-${
            currentPageItemCount % pageSize !== 0
              ? (currentPageNumber - 1) * pageSize + currentPageItemCount
              : currentPageNumber * pageSize
          } of ${itemsCount} Items`}`}
        >{`${(currentPageNumber - 1) * pageSize + 1}-${
          currentPageItemCount % pageSize !== 0
            ? (currentPageNumber - 1) * pageSize + currentPageItemCount
            : currentPageNumber * pageSize
        } of ${showTotalCount ? itemsCount : "many"} Items`}</span>
      </span>
      {handleChangeRecordPerPage && (
        <span className={`text-xsm text-vryno-placeholder px-2`}>{"|"}</span>
      )}
      {handleChangeRecordPerPage ? (
        <select
          id="page-size"
          name="pageSize"
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const value = parseInt((e.target as HTMLSelectElement).value);
            if (pageSize === value) return;
            handleChangeRecordPerPage(value);
          }}
          data-testid="page-size-select"
          className="text-xsm text-vryno-placeholder outline-none border-none bg-transparent cursor-pointer"
        >
          <option
            value="10"
            selected={pageSize === 10 ? true : false}
            data-testid="page-size-10"
          >
            10 Records Per Page
          </option>
          <option
            value="25"
            selected={pageSize === 25 ? true : false}
            data-testid="page-size-25"
          >
            25 Records Per Page
          </option>
          <option
            value="50"
            selected={pageSize === 50 ? true : false}
            data-testid="page-size-50"
          >
            50 Records Per Page
          </option>
        </select>
      ) : (
        <></>
      )}
    </div>
  );
};

export type PaginationProps = {
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
  children?: React.ReactElement;
  pageInfoLocation?: "below" | "between";
  backgroundProcessRunning?: boolean;
  hideFirstLastPageButtons?: boolean;
  hidePagination?: boolean;
  handleChangeRecordPerPage?: (value: number) => void;
};

const Pagination = ({
  itemsCount,
  pageSize = 50,
  containerName,
  onPageChange = () => {},
  currentPageNumber,
  currentPageItemCount,
  children,
  showTotalCount,
  showPageCount,
  disabledLastPage = false,
  pageInfoLocation = "below",
  backgroundProcessRunning,
  hideFirstLastPageButtons = false,
  hidePagination,
  handleChangeRecordPerPage,
}: PaginationProps) => {
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
        {pageInfoLocation === "between" && (
          <div className="whitespace-nowrap">
            <PageInfo
              containerName={containerName ? containerName : modelName}
              currentPageItemCount={currentPageItemCount}
              pagesCount={pagesCount}
              currentPageNumber={currentPageNumber}
              itemsCount={itemsCount}
              showTotalCount={showTotalCount}
              showPageCount={showPageCount}
              handleChangeRecordPerPage={handleChangeRecordPerPage}
              pageSize={pageSize}
            />
          </div>
        )}
        {pageInfoLocation === "between" && children}
        <div className="flex flex-col items-center">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Button
              id={`${
                containerName ? containerName : modelName
              }-pagination-first`}
              onClick={(e) => {
                e.stopPropagation();
                onPageChange(1, "first");
              }}
              disabled={leftDisabled}
              aria-current="page"
              customStyle={`${
                hideFirstLastPageButtons ? "hidden" : ""
              } z-10 relative inline-flex items-center px-2 py-1 border rounded-l-md bg-white`}
              userEventName="pagination-first-page:view-click"
            >
              {leftDisabled || backgroundProcessRunning ? (
                <RewindMiniFillIcon className="text-sm text-vryno-gray" />
              ) : (
                <RewindMiniFillIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>

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
              customStyle={`z-10 relative inline-flex items-center px-2 py-1 border bg-white`}
              userEventName="pagination-previous-page:view-click"
            >
              {leftDisabled || backgroundProcessRunning ? (
                <LeftArrowIcon className="text-sm text-vryno-gray" />
              ) : (
                <LeftArrowIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>

            <span className="z-10 relative inline-flex items-center px-4 py-1 border text-sm font-medium bg-vryno-theme-light-blue text-white">
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
              customStyle={`z-10 relative inline-flex items-center px-2 py-1 border bg-white`}
              userEventName="pagination-next-page:view-click"
            >
              {rightDisabled || backgroundProcessRunning || disabledLastPage ? (
                <RightArrowIcon className="text-sm text-vryno-gray" />
              ) : (
                <RightArrowIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>

            <Button
              id={`${
                containerName ? containerName : modelName
              }-pagination-last`}
              onClick={(e) => {
                e.stopPropagation();
                onPageChange(pagesCount, "last");
              }}
              disabled={
                rightDisabled || backgroundProcessRunning || disabledLastPage
              }
              aria-current="page"
              customStyle={`${
                hideFirstLastPageButtons ? "hidden" : ""
              } z-10 relative inline-flex items-center px-2 py-1 border rounded-r-md bg-white`}
              userEventName="pagination-last-page:view-click"
            >
              {rightDisabled || backgroundProcessRunning || disabledLastPage ? (
                <SpeedMiniFillIcon className="text-sm text-vryno-gray" />
              ) : (
                <SpeedMiniFillIcon className="text-sm text-vryno-theme-light-blue" />
              )}
            </Button>
          </nav>
          {pageInfoLocation === "below" && (
            <PageInfo
              containerName={containerName ? containerName : modelName}
              currentPageItemCount={currentPageItemCount}
              pagesCount={pagesCount}
              currentPageNumber={currentPageNumber}
              itemsCount={itemsCount}
              pageSize={pageSize}
              handleChangeRecordPerPage={handleChangeRecordPerPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Pagination;
