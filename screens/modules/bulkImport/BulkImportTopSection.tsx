import Button from "../../../components/TailwindControls/Form/Button/Button";
import Pagination from "../crm/shared/components/Pagination";
import ItemsLoader from "../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import { IBulkImportTopSection } from "./bulkImportHelper";
import { getNavigationLabel } from "../crm/shared/utils/getNavigationLabel";

export const BulkImportTopSection = ({
  id,
  modelName,
  jobPageLoading,
  jobItemsCount,
  currentJobItemsPageNumber,
  bulkImportJobItems,
  onJobItemPageChange,
  jobsCount,
  currentJobPageNumber,
  bulkImportJobs,
  onJobPageChange,
  jobItemsPageLoading,
  onTabSelection,
  selectedTab,
  bulkImportMappingDataLoading,
  bulkImportMappingData,
  bulkImportMappingCount,
  onBIMappingPageChange,
  bulkImportMappingPageNumber,
  selectedJobItemTab,
  onJobItemTabSelection,
  currentLabel,
  navigations,
}: IBulkImportTopSection) => {
  return (
    <>
      {/* Tab button and Pagination - start */}
      <div
        className={`flex flex-col gap-x-12 ${
          id ? "" : "lg:flex-row lg:justify-between"
        }`}
      >
        {id ? (
          <div className={`flex gap-x-6 ${id ? "" : "md:w-1/3"}`}>
            <div>
              <Button
                id="bi_job-success"
                buttonType={
                  selectedJobItemTab === "success" ? "pointedDownBox" : "thin"
                }
                onClick={() => onJobItemTabSelection("success")}
                paddingStyle={"py-2 px-6"}
                userEventName="bulkImport-success:tab-click"
              >
                <p>Success</p>
              </Button>
            </div>
            <div>
              <Button
                id="bi_job-failed"
                buttonType={
                  selectedJobItemTab === "failed" ? "pointedDownBox" : "thin"
                }
                onClick={() => onJobItemTabSelection("failed")}
                paddingStyle={"py-2 px-6"}
                userEventName="bulkImport-failed:tab-click"
              >
                <p>Failed</p>
              </Button>
            </div>
            <div>
              <Button
                id="bi_job-other"
                buttonType={
                  selectedJobItemTab === "other" ? "pointedDownBox" : "thin"
                }
                onClick={() => onJobItemTabSelection("other")}
                paddingStyle={"py-2 px-6"}
                userEventName="bulkImport-others:tab-click"
              >
                <p>Others</p>
              </Button>
            </div>
          </div>
        ) : (
          <div className={`flex gap-x-6 ${id ? "" : "md:w-1/3"}`}>
            <div>
              <Button
                id={"bi_job"}
                buttonType={selectedTab === "jobs" ? "pointedDownBox" : "thin"}
                onClick={() => onTabSelection("jobs")}
                paddingStyle={"py-2 px-6"}
                userEventName="bulkImport-view-jobs-click"
              >
                <p>Jobs</p>
              </Button>
            </div>
            <div>
              <Button
                id={"bi_mapping"}
                buttonType={
                  selectedTab === "mapping" ? "pointedDownBox" : "thin"
                }
                onClick={() => onTabSelection("mapping")}
                paddingStyle={"py-2 px-6"}
                userEventName="bulkImport-view-mapping-click"
              >
                <p>Mapping</p>
              </Button>
            </div>
          </div>
        )}

        <div
          className={`flex mt-4 mb-6 self-end justify-end ${
            id ? "" : "lg:mt-0 lg:w-2/3"
          } ${
            selectedTab === "jobs"
              ? jobPageLoading
                ? "hidden"
                : ""
              : bulkImportMappingDataLoading
              ? "hidden"
              : ""
          }`}
        >
          {selectedTab === "jobs"
            ? id
              ? jobItemsCount > 0 && (
                  <Pagination
                    itemsCount={jobItemsCount}
                    currentPageNumber={currentJobItemsPageNumber}
                    currentPageItemCount={bulkImportJobItems.length}
                    onPageChange={(pageNumber) =>
                      onJobItemPageChange(pageNumber)
                    }
                  />
                )
              : jobsCount > 0 && (
                  <Pagination
                    itemsCount={jobsCount}
                    currentPageNumber={currentJobPageNumber}
                    currentPageItemCount={bulkImportJobs.length}
                    onPageChange={(pageNumber) => onJobPageChange(pageNumber)}
                  />
                )
            : bulkImportMappingCount > 0 && (
                <Pagination
                  itemsCount={bulkImportMappingCount}
                  currentPageNumber={bulkImportMappingPageNumber}
                  currentPageItemCount={bulkImportMappingData?.length}
                  onPageChange={(pageNumber) =>
                    onBIMappingPageChange(pageNumber)
                  }
                />
              )}
        </div>
      </div>
      {/* Tab button and Pagination - end */}

      {/* Loaders/empty containers for no loading/no_data - start */}
      {selectedTab == "jobs" ? (
        id && jobItemsPageLoading ? (
          <ItemsLoader currentView="List" loadingItemCount={4} />
        ) : (
          jobPageLoading && (
            <ItemsLoader currentView="List" loadingItemCount={4} />
          )
        )
      ) : (
        bulkImportMappingDataLoading && (
          <ItemsLoader currentView="List" loadingItemCount={4} />
        )
      )}
      {selectedTab == "jobs" ? (
        jobItemsPageLoading && jobPageLoading ? (
          <></>
        ) : id && !jobItemsPageLoading && bulkImportJobItems.length === 0 ? (
          <NoDataFoundContainer
            modelName={"Bulk Import"}
            containerMessage={`No Item found`}
            showButton={false}
          />
        ) : (
          !jobPageLoading &&
          bulkImportJobs.length === 0 && (
            <NoDataFoundContainer
              modelName={"Bulk Import"}
              containerMessage={`No Bulk Import Job for ${getNavigationLabel({
                navigations: navigations,
                currentModuleName: currentLabel,
                currentModuleLabel: currentLabel,
                defaultLabel: modelName?.replace("rb", ""),
              })}`}
              showButton={false}
            />
          )
        )
      ) : selectedTab == "mapping" &&
        !bulkImportMappingDataLoading &&
        bulkImportMappingData.length === 0 ? (
        <NoDataFoundContainer
          modelName={"Bulk Import Mapping"}
          containerMessage={`No Mapping found`}
          showButton={false}
        />
      ) : (
        selectedTab == "mapping" && bulkImportMappingDataLoading && <></>
      )}
      {/* Loaders/empty containers for no loading/no_data - end */}
    </>
  );
};
