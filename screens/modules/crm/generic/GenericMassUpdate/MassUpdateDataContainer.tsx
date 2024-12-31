import React from "react";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { ICustomField } from "../../../../../models/ICustomField";
import Pagination from "../../shared/components/Pagination";
import { determineShowSelectItem } from "../GenericModelView/GenericDashboardDataDisplay";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { BaseGenericObjectType } from "../../../../../models/shared";

export const MassUpdateDataContainer = ({
  extended,
  fieldsList,
  filteredData,
  selectedItems,
  onItemSelect,
  itemsCount,
  handleSelectAllItems,
  setSelectItemsOnAllPages,
  appName,
  modelName,
  currentPageNumber,
  onPageChange,
  handleMassUpdate,
  handleAllItemsSelectFetch,
  getAllItemsFetchLoading,
}: {
  extended: boolean;
  fieldsList: ICustomField[];
  filteredData: BaseGenericObjectType[];
  selectedItems: BaseGenericObjectType[];
  onItemSelect: (selectedItem: BaseGenericObjectType) => void;
  itemsCount: number;
  handleSelectAllItems: () => void;
  setSelectItemsOnAllPages: (items: BaseGenericObjectType[]) => void;
  appName: string;
  modelName: string;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  handleMassUpdate: (value: { visible: boolean }) => void;
  handleAllItemsSelectFetch: (totalItems: number, pageSize: number) => void;
  getAllItemsFetchLoading: boolean;
}) => {
  return (
    <>
      <GenericHeaderCardContainer cardHeading={"Results"} extended={extended}>
        <>
          <div className={`h-16 flex items-top gap-8 justify-between sticky`}>
            <div className={`flex gap-x-4 pb-6`}>
              {determineShowSelectItem(filteredData, selectedItems) && (
                <Button
                  id="mass-update-select-all-records-button"
                  customStyle="cursor-pointer flex whitespace-nowrap items-center"
                  onClick={handleSelectAllItems}
                  userEventName="massUpdate-select-all:action-click"
                  renderChildrenOnly={true}
                >
                  <>
                    <input
                      type="checkbox"
                      name="list_checkbox"
                      checked={false}
                      readOnly={true}
                      className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span className="pl-2">Select All</span>
                  </>
                </Button>
              )}
              {selectedItems.length > 0 && (
                <Button
                  id="mass-update-unselect-all-records-button"
                  customStyle="cursor-pointer flex whitespace-nowrap items-center"
                  onClick={() => {
                    setSelectItemsOnAllPages([]);
                  }}
                  userEventName="massUpdate-unselect-all:action-click"
                  renderChildrenOnly={true}
                >
                  <>
                    <input
                      type="checkbox"
                      name="list_checkbox"
                      checked={true}
                      readOnly={true}
                      className="text-white bg-vryno-theme-light-blue rounded-md cursor-pointer mb-0.5"
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span className="pl-2">Unselect All</span>
                  </>
                </Button>
              )}
              {selectedItems.length > 0 && (
                <div className="flex gap-x-4 justify-between">
                  <Button
                    id="mass-update-button"
                    kind="next"
                    onClick={() => handleMassUpdate({ visible: true })}
                    userEventName="open-massUpdate-form-click"
                  >
                    <span className="whitespace-nowrap text-sm">
                      Mass Update
                    </span>
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-1">
              {selectedItems.length !== itemsCount &&
                !determineShowSelectItem(filteredData, selectedItems) && (
                  <div
                    className={`bg-white w-full hidden p-2 md:h-8 sm:p-0 rounded-lg shadow-sm sm:flex items-center justify-center text-xs`}
                  >
                    {getAllItemsFetchLoading ? (
                      <div className="">
                        <Loading color="Blue" />
                      </div>
                    ) : (
                      <Button
                        id="select-all-items"
                        customStyle="pl-2 underline text-vryno-theme-light-blue"
                        onClick={() =>
                          handleAllItemsSelectFetch(itemsCount, 50)
                        }
                        userEventName="massUpdate-select-all-click"
                        renderChildrenOnly={true}
                      >{`Select all ${itemsCount} records`}</Button>
                    )}
                  </div>
                )}
            </div>
            <Pagination
              itemsCount={itemsCount}
              currentPageItemCount={filteredData.length}
              pageSize={50}
              onPageChange={(pageNumber) => {
                onPageChange(pageNumber);
              }}
              currentPageNumber={currentPageNumber}
            />
          </div>
          <div className="overflow-y-scroll">
            <GenericList
              data={filteredData}
              tableHeaders={fieldsList
                ?.filter((field) => field.visible)
                .map((field) => {
                  return {
                    label: field.label.en,
                    columnName: field.name,
                    dataType: field.dataType,
                  };
                })}
              listSelector={true}
              fieldsList={fieldsList}
              selectedItems={selectedItems}
              onItemSelect={(value) => onItemSelect(value)}
              onDetail={false}
              showIcons={false}
              rowUrlGenerator={(item) =>
                appsUrlGenerator(
                  appName,
                  modelName,
                  AllowedViews.detail,
                  item.id as string
                )
              }
              target="_blank"
              oldGenericListUI={true}
            />
          </div>
        </>
      </GenericHeaderCardContainer>
    </>
  );
};
