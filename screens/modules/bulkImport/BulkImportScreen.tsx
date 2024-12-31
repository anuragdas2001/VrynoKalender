import React from "react";
import { camelCase } from "change-case";
import { get } from "lodash";
import BulkImportJobScreenSideMenu from "./BulkImportJobScreenSideMenu";
import GenericBackHeader from "../crm/shared/components/GenericBackHeader";
import { SideDrawer } from "../crm/shared/components/SideDrawer";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { IBulkImport } from "../../../models/shared";
import { BulkImportJobScreen } from "./BulkImportJobScreen";
import { BulkImportMappingScreen } from "./BulkImportMappingScreen";
import { BulkImportTopSection } from "./BulkImportTopSection";
import router from "next/router";
import DeleteModal from "../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { IBulkImportScreen } from "./bulkImportHelper";
import { getNavigationLabel } from "../crm/shared/utils/getNavigationLabel";

export const BulkImportScreen = ({
  appName,
  modelName,
  fieldsList,
  ui,
  id,
  sideMenuLoading,
  jobPageLoading,
  jobItemsCount,
  jobItemsPageLoading,
  sideMenuItems,
  jobsCount,
  bulkImportJobs,
  bulkImportJobItems,
  currentJobPageNumber,
  currentJobItemsPageNumber,
  onJobPageChange,
  onJobItemPageChange,
  onMenuItemChange,
  selectedTab,
  onTabSelection,
  bulkImportMappingData,
  setDeleteBIMappingModal,
  bIDeleteProcessing,
  bulkImportMappingDataLoading,
  bulkImportMappingCount,
  bulkImportMappingPageNumber,
  onBIMappingPageChange,
  setBulkImportJobs,
  selectedJobItemTab,
  onJobItemTabSelection,
  updateBulkImportJobs,
  deleteBIMappingModal,
  handleBIMappingDelete,
  navigations,
  currentLabel,
  jobItemTableHeaderLoader,
  setJobItemTableHeaderLoader,
}: IBulkImportScreen) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const [cancelBIJobModal, setCancelBIJobModal] = React.useState<{
    visible: boolean;
    id: null | string;
  }>({
    visible: false,
    id: null,
  });
  const [bICancelProcess, setBICancelProcess] = React.useState(false);

  const [bulkImportJobMutation] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const handleBIJobCancel = (id: string) => {
    setBICancelProcess(true);
    bulkImportJobMutation({
      variables: {
        id: id,
        modelName: "BulkImportJob",
        saveInput: {
          status: "cancelled",
        },
      },
    }).then((response) => {
      if (
        response.data?.save?.data &&
        response.data?.save?.messageKey.includes("-success")
      ) {
        const updatedBIJobs: IBulkImport[] = [];
        bulkImportJobs.forEach((job) => {
          if (job.id === response.data?.save?.data.id) {
            updatedBIJobs.push(response.data?.save?.data);
          } else {
            updatedBIJobs.push(job);
          }
        });
        updateBulkImportJobs(updatedBIJobs);
        setCancelBIJobModal({
          visible: false,
          id: null,
        });
        toast.success("BulkImport Job Cancelled Successfully");
      } else {
        toast.error(response.data?.save?.message);
      }
      setBICancelProcess(false);
    });
  };

  return (
    <>
      <div className="flex w-full">
        <BulkImportJobScreenSideMenu
          menuItems={sideMenuItems.map((item) => {
            if (item.uniqueName === "report") {
              return {
                label: item.label?.en,
                name: camelCase(`${item.uniqueName}s`),
              };
            } else
              return {
                label: item.label?.en,
                name: camelCase(get(item.navTypeMetadata, "moduleName", "")),
              };
          })}
          onMenuItemChange={(item) => onMenuItemChange(item)}
          modelName={modelName?.replace("rb", "")}
          menuLoading={sideMenuLoading}
        />
        <div className="flex flex-col w-full sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 h-full sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12">
          <GenericBackHeader
            heading={`${id ? "Bulk Import Job Items" : "Bulk Import Jobs"}`}
          >
            {id ? (
              <div>
                {/* <div className={`${id ? "hidden" : ""}`}> */}
                <Button
                  id="cancel-import-items"
                  buttonType="thin"
                  kind="danger"
                  onClick={() => {
                    setCancelBIJobModal({ visible: true, id: id });
                  }}
                  disabled={bICancelProcess}
                  userEventName={`import-${modelName}-job:cancel-click`}
                >
                  Cancel Import Job
                </Button>
              </div>
            ) : (
              <div>
                {/* <div className={`${id ? "hidden" : ""}`}> */}
                <Button
                  id="import-items"
                  buttonType="thin"
                  onClick={() => {
                    router.push(`${appName}/${modelName}/mapping`);
                  }}
                  userEventName={`open-bulkImport-${modelName}-mapping-click`}
                >
                  {`Import ${getNavigationLabel({
                    navigations: navigations,
                    currentModuleName: currentLabel,
                    currentModuleLabel: currentLabel,
                    defaultLabel: modelName?.replace("rb", ""),
                  })}`}
                </Button>
              </div>
            )}
          </GenericBackHeader>
          <div className="sm:hidden w-40 mt-4">
            <SideDrawer
              sideMenuClass={sideMenuClass}
              setSideMenuClass={setSideMeuClass}
              buttonType={"thin"}
              menuItems={sideMenuItems.map((item) => {
                return {
                  label: item.label?.en,
                  name: camelCase(get(item.navTypeMetadata, "moduleName", "")),
                };
              })}
              onMenuItemChange={(item) => onMenuItemChange(item)}
              modelName={modelName}
              menuLoading={sideMenuLoading}
            ></SideDrawer>
          </div>
          <div>
            <div className="px-6 pt-6">
              <BulkImportTopSection
                id={id}
                modelName={modelName}
                jobPageLoading={jobPageLoading}
                jobItemsPageLoading={jobItemsPageLoading}
                bulkImportMappingDataLoading={bulkImportMappingDataLoading}
                jobItemsCount={jobItemsCount}
                currentJobItemsPageNumber={currentJobItemsPageNumber}
                bulkImportJobItems={bulkImportJobItems}
                onJobItemPageChange={onJobItemPageChange}
                jobsCount={jobsCount}
                currentJobPageNumber={currentJobPageNumber}
                bulkImportJobs={bulkImportJobs}
                onJobPageChange={onJobPageChange}
                selectedTab={selectedTab}
                onTabSelection={onTabSelection}
                bulkImportMappingData={bulkImportMappingData}
                bulkImportMappingCount={bulkImportMappingCount}
                bulkImportMappingPageNumber={bulkImportMappingPageNumber}
                onBIMappingPageChange={onBIMappingPageChange}
                selectedJobItemTab={selectedJobItemTab}
                onJobItemTabSelection={onJobItemTabSelection}
                currentLabel={currentLabel}
                navigations={navigations}
              />

              {selectedTab === "jobs" ? (
                (id && jobItemsPageLoading) ||
                jobPageLoading ||
                fieldsList?.length <= 0 ? (
                  <></>
                ) : (
                  <BulkImportJobScreen
                    id={id}
                    appName={appName}
                    modelName={modelName}
                    ui={ui}
                    jobItemsPageLoading={jobItemsPageLoading}
                    bulkImportJobItems={bulkImportJobItems}
                    fieldsList={fieldsList}
                    jobPageLoading={jobPageLoading}
                    bulkImportJobs={bulkImportJobs}
                    setBulkImportJobs={setBulkImportJobs}
                    selectedJobItemTab={selectedJobItemTab}
                    jobItemTableHeaderLoader={jobItemTableHeaderLoader}
                    setJobItemTableHeaderLoader={setJobItemTableHeaderLoader}
                  />
                )
              ) : selectedTab === "mapping" ? (
                !bulkImportMappingData?.length ? (
                  <></>
                ) : (
                  <BulkImportMappingScreen
                    bulkImportMappingData={bulkImportMappingData}
                    setDeleteBIMappingModal={setDeleteBIMappingModal}
                    bIDeleteProcessing={bIDeleteProcessing}
                    appName={appName}
                    modelName={modelName}
                    bulkImportMappingDataLoading={bulkImportMappingDataLoading}
                  />
                )
              ) : (
                <div>INVALID URL</div>
              )}
            </div>
          </div>
        </div>
        {cancelBIJobModal.visible && (
          <>
            <DeleteModal
              id={"cancel-bi-job"}
              modalHeader={"Cancel Bulk Import Job"}
              modalMessage={"Are you sure you want to cancel job import?"}
              leftButton={"No"}
              rightButton={"Yes"}
              loading={bICancelProcess}
              onCancel={() => setCancelBIJobModal({ visible: false, id: null })}
              onDelete={() => {
                if (cancelBIJobModal.id) {
                  handleBIJobCancel(cancelBIJobModal.id);
                }
              }}
              onOutsideClick={() =>
                setCancelBIJobModal({ visible: false, id: null })
              }
            />
            <Backdrop
              onClick={() => setCancelBIJobModal({ visible: false, id: null })}
            />
          </>
        )}
      </div>
      {deleteBIMappingModal.visible && (
        <>
          <DeleteModal
            id={"delete-bi-mapping"}
            modalHeader={"Delete Bulk Import Mapping"}
            modalMessage={"Are you sure you want to delete mapping?"}
            leftButton={"Cancel"}
            rightButton={"Delete"}
            loading={bIDeleteProcessing}
            onCancel={() =>
              setDeleteBIMappingModal({ visible: false, item: null })
            }
            onDelete={() => {
              if (deleteBIMappingModal.item)
                handleBIMappingDelete(deleteBIMappingModal.item);
            }}
            onOutsideClick={() =>
              setDeleteBIMappingModal({ visible: false, item: null })
            }
          />
          <Backdrop
            onClick={() =>
              setDeleteBIMappingModal({ visible: false, item: null })
            }
          />
        </>
      )}
    </>
  );
};
