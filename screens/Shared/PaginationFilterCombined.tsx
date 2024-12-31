import React from "react";
import { TableQuickFilter } from "./TableQuickFilter";
import Pagination from "../modules/crm/shared/components/Pagination";

export type PaginationFilterComponentProps = {
  classStyle: string;
  filterName: string;
  setFilterValue: (value: string) => void;
  itemsCount: number;
  currentPageItemCount: number;
  onPageChange: (pageNumber: number) => void;
  currentPageNumber: number;
  hideSearchBar?: boolean;
  hidePagination?: boolean;
};

export const PaginationFilterComponent = ({
  classStyle,
  filterName,
  setFilterValue,
  itemsCount,
  currentPageItemCount,
  currentPageNumber,
  onPageChange,
  hideSearchBar = false,
  hidePagination,
}: PaginationFilterComponentProps) => {
  return (
    <div className={classStyle}>
      <TableQuickFilter
        filterName={filterName}
        hideSearchBar={hideSearchBar}
        setFilterValue={(value) => setFilterValue(value)}
      />
      <Pagination
        hidePagination={hidePagination}
        itemsCount={itemsCount}
        currentPageItemCount={currentPageItemCount}
        pageSize={50}
        onPageChange={(pageNumber) => onPageChange(pageNumber)}
        currentPageNumber={currentPageNumber}
        pageInfoLocation={`${hideSearchBar ? "between" : "below"}`}
      />
    </div>
  );
};
