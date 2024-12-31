import React, { useEffect, useRef } from "react";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { useRouter } from "next/router";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { SettingsSideBar } from "../../SettingsSidebar";
import { PaginationFilterComponent } from "../../../../Shared/PaginationFilterCombined";

type CustomizationContainerProps = {
  heading: string;
  subHeading?: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  showTabBar?: boolean;
  currentPageNumber?: number;
  itemsCount?: number;
  currentPageItemCount?: number;
  hidePagination?: boolean;
  hideSearchBar?: boolean | undefined;
  setFilterValue?: (value: string) => void;
  setCurrentPageNumber?: (pageNumber: number) => void;
  onPageChange?: (pageNumber: number) => void;
};

const CustomizationContainerTabBar = ({
  heading,
  visible,
  currentPageNumber,
  itemsCount,
  currentPageItemCount,
  hidePagination,
  hideSearchBar,
  setFilterValue = () => {},
  onPageChange = () => {},
  setCurrentPageNumber = () => {},
}: {
  heading: string;
  visible: boolean;
  currentPageNumber: number;
  itemsCount: number;
  currentPageItemCount: number;
  hidePagination?: boolean;
  hideSearchBar?: boolean | undefined;
  setFilterValue?: (value: string) => void;
  setCurrentPageNumber: (pageNumber: number) => void;
  onPageChange: (pageNumber: number) => void;
}) => {
  if (!visible) {
    return null;
  }
  return (
    <div className={`pr-6 mt-4 w-full flex items-center justify-end gap-x-6`}>
      <div
        className={`w-full pl-6 ${currentPageItemCount > 0 ? "" : "hidden"}`}
      >
        <PaginationFilterComponent
          filterName={heading}
          currentPageItemCount={currentPageItemCount}
          currentPageNumber={currentPageNumber}
          onPageChange={onPageChange}
          setFilterValue={setFilterValue}
          itemsCount={itemsCount}
          hideSearchBar={hideSearchBar}
          hidePagination={hidePagination}
          classStyle={`hidden sm:flex sm:justify-between`}
        />
        <PaginationFilterComponent
          filterName={heading}
          currentPageItemCount={currentPageItemCount}
          currentPageNumber={currentPageNumber}
          onPageChange={onPageChange}
          setFilterValue={setFilterValue}
          itemsCount={itemsCount}
          hideSearchBar={hideSearchBar}
          hidePagination={hidePagination}
          classStyle={`sm:hidden flex flex-col`}
        />
      </div>
    </div>
  );
};

export const CustomizationContainer = ({
  heading,
  children,
  subHeading = "",
  showTabBar = false,
  buttons = null,
  currentPageNumber = 1,
  itemsCount = 0,
  currentPageItemCount = 0,
  hidePagination,
  hideSearchBar,
  setFilterValue = () => {},
  onPageChange = () => {},
  setCurrentPageNumber = () => {},
}: CustomizationContainerProps) => {
  const router = useRouter();

  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 35);
    }
  });

  return (
    <div className="flex flex-col w-full h-full">
      <GenericBackHeader
        heading={heading}
        subHeading={subHeading}
        onClick={() => router.back()}
        addButtonInFlexCol={false}
      >
        <div>{buttons}</div>
      </GenericBackHeader>

      <div className="flex justify-between sm:justify-end">
        <div className="sm:hidden w-40 mt-4 mb-1">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
          >
            <SettingsSideBar />
          </SideDrawer>
        </div>
        <CustomizationContainerTabBar
          heading={heading}
          visible={showTabBar}
          currentPageNumber={currentPageNumber}
          itemsCount={itemsCount}
          currentPageItemCount={currentPageItemCount}
          setFilterValue={setFilterValue}
          onPageChange={onPageChange}
          hidePagination={hidePagination}
          hideSearchBar={hideSearchBar}
          setCurrentPageNumber={setCurrentPageNumber}
        />
      </div>
      <div className="px-6 pt-4">
        <div className="py-4 px-4 bg-white rounded-xl">
          <div ref={heightRef}>{children}</div>
        </div>
      </div>
    </div>
  );
};
