import { BulkImportScreen } from "./BulkImportScreen";
import ConnectedBulkImportModal from "../crm/shared/components/BulkImportAddModal/ConnectedBulkImportModal";
import { Backdrop } from "../../../components/TailwindControls/Backdrop";
import { useRouter } from "next/router";
import React from "react";
import { NavigationStoreContext } from "../../../stores/RootStore/NavigationStore/NavigationStore";
import {
  IBulkImportContainer,
  IBulkImportMappingData,
  bulkImportItemVariablesGenerator,
  bulkImportTabType,
  emptyModalValues,
  getModelName,
} from "./bulkImportHelper";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../graphql/queries/fetchQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { IFormModalObject } from "../crm/generic/GenericModelView/GenericModalCardItems";
import { toast } from "react-toastify";
import { IBulkImport } from "../../../models/shared";

export const BulkImportContainer = ({
  appName,
  modelName,
  ui,
  id,
  moduleData,
  setBulkImportJobItems,
  setBulkImportJobItemsLoading,
  setBulkImportJobItemsDataLoading,
  setSelectJobItemTab,
  getBulkImportJobItems,
  bulkImportJobsLoading,
  bulkImportJobItemsDataLoading,
  currentJobPageNumber,
  setCurrentJobPageNumber,
  setBulkImportJobs,
  setBulkImportJobsLoading,
  bulkImportJobs,
  fieldsList,
  bulkImportJobItemsData,
  onJobPageChange,
  selectedJobItemTab,
  jobsCount,
  jobItemsCount,
  jobItemTableHeaderLoader,
  setJobItemTableHeaderLoader,
}: IBulkImportContainer) => {
  const router = useRouter();
  const { navigations } = React.useContext(NavigationStoreContext);
  const [successJobPageNumber, setSuccessJobPageNumber] =
    React.useState<number>(1);
  const [failedJobPageNumber, setFailedJobPageNumber] =
    React.useState<number>(1);
  const [othersJobPageNumber, setOthersJobPageNumber] =
    React.useState<number>(1);
  const [bulkImportModal, setBulkImportModal] =
    React.useState<IFormModalObject>(emptyModalValues);
  const [selectedTab, setSelectedTab] = React.useState<"jobs" | "mapping">(
    "jobs"
  );
  // -------------------------------- BIMapping - start --------------------------------
  const [bulkImportMappingDataLoading, setBulkImportMappingDataLoading] =
    React.useState(true);
  const [bulkImportMappingData, setBulkImportMappingData] = React.useState<
    IBulkImportMappingData[]
  >([]);
  const [bulkImportMappingCount, setBulkImportMappingCount] =
    React.useState<number>(0);
  const [bulkImportMappingPageNumber, setBulkImportMappingPageNumber] =
    React.useState<number>(1);

  const [getBulkImportMapping] = useLazyQuery<
    FetchData<IBulkImportMappingData>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setBulkImportMappingData(responseOnCompletion?.fetch?.data);
        setBulkImportMappingCount(responseOnCompletion.fetch.count);
      }
      setBulkImportMappingDataLoading(false);
    },
  });

  React.useEffect(() => {
    if (moduleData && appName) {
      getBulkImportMapping({
        variables: {
          modelName: "BulkImportMapping",
          fields: ["id", "name", "fileName", "moduleUniqueName"],
          filters: [
            {
              operator: "eq",
              name: "moduleUniqueName",
              value: moduleData.uniqueName,
            },
          ],
          pageNumber: 1,
        },
      });
    }
  }, [moduleData, appName]);
  // -------------------------------- BIMapping - end --------------------------------

  const [bIDeleteProcessing, setBIDeleteProcessing] = React.useState(false);
  const [deleteBIMappingModal, setDeleteBIMappingModal] = React.useState<{
    visible: boolean;
    item: null | IBulkImportMappingData;
  }>({
    visible: false,
    item: null,
  });

  const [bulkImportDeleteMutation] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const handleBIMappingDelete = (item: IBulkImportMappingData) => {
    setBIDeleteProcessing(true);
    bulkImportDeleteMutation({
      variables: {
        id: item.id,
        modelName: "BulkImportMapping",
        saveInput: {
          recordStatus: "d",
        },
      },
    }).then((response) => {
      if (response.data?.save?.data) {
        const updatedMappingData = bulkImportMappingData.filter(
          (data) => data.id !== response.data?.save?.data.id
        );
        setBulkImportMappingData(updatedMappingData);
        setBulkImportMappingCount(updatedMappingData?.length);
        setDeleteBIMappingModal({ visible: false, item: null });
        toast.success("Bulk Import Mapping Deleted Successfully");
      } else {
        toast.error(response.data?.save.message);
      }
      setBIDeleteProcessing(false);
    });
  };

  const handlePageNumberUpdate = (pageNumber: number) => {
    selectedJobItemTab === "success"
      ? setSuccessJobPageNumber(pageNumber)
      : selectedJobItemTab === "failed"
      ? setFailedJobPageNumber(pageNumber)
      : setOthersJobPageNumber(pageNumber);
  };

  const handleJobItemTabSelection = (selectedTab: bulkImportTabType) => {
    setBulkImportJobItems([]);
    setBulkImportJobItemsLoading(true);
    setBulkImportJobItemsDataLoading(true);
    setSelectJobItemTab(selectedTab);
    getBulkImportJobItems({
      variables: bulkImportItemVariablesGenerator(
        id,
        selectedTab,
        selectedTab === "success"
          ? successJobPageNumber
          : selectedTab === "failed"
          ? failedJobPageNumber
          : othersJobPageNumber
      ),
    });
  };

  return (
    <>
      <BulkImportScreen
        appName={appName}
        modelName={getModelName(modelName)}
        ui={ui}
        id={id}
        bulkImportJobs={bulkImportJobs}
        fieldsList={fieldsList}
        bulkImportJobItems={bulkImportJobItemsData}
        sideMenuLoading={navigations.length === 0 ? true : false}
        jobPageLoading={bulkImportJobsLoading}
        jobItemsPageLoading={bulkImportJobItemsDataLoading}
        currentJobPageNumber={currentJobPageNumber}
        currentJobItemsPageNumber={
          selectedJobItemTab === "success"
            ? successJobPageNumber
            : selectedJobItemTab === "failed"
            ? failedJobPageNumber
            : othersJobPageNumber
        }
        onJobPageChange={onJobPageChange}
        onJobItemPageChange={(pageNumber) => {
          setBulkImportJobItems([]);
          setBulkImportJobItemsLoading(true);
          setBulkImportJobItemsDataLoading(true);
          getBulkImportJobItems({
            variables: bulkImportItemVariablesGenerator(
              id,
              selectedJobItemTab,
              pageNumber
            ),
          });
          handlePageNumberUpdate(pageNumber);
        }}
        sideMenuItems={navigations?.filter(
          (navigation) => navigation.groupKey === "default-navigation"
        )}
        jobsCount={jobsCount}
        jobItemsCount={jobItemsCount}
        onMenuItemChange={(item) => {
          setSuccessJobPageNumber(1);
          setFailedJobPageNumber(1);
          setOthersJobPageNumber(1);
          setCurrentJobPageNumber(1);
          setBulkImportMappingPageNumber(1);
          setBulkImportMappingDataLoading(true);
          setBulkImportMappingData([]);
          router?.replace(`${appName}/bi-${item.name}/${ui}`);
        }}
        selectedTab={selectedTab}
        onTabSelection={(value) => setSelectedTab(value)}
        bulkImportMappingData={bulkImportMappingData}
        bIDeleteProcessing={bIDeleteProcessing}
        setDeleteBIMappingModal={(value: {
          visible: boolean;
          item: null | IBulkImportMappingData;
        }) => setDeleteBIMappingModal(value)}
        bulkImportMappingDataLoading={bulkImportMappingDataLoading}
        bulkImportMappingCount={bulkImportMappingCount}
        bulkImportMappingPageNumber={bulkImportMappingPageNumber}
        onBIMappingPageChange={(pageNumber: number) => {
          if (moduleData) {
            setBulkImportMappingDataLoading(true);
            getBulkImportMapping({
              variables: {
                modelName: "BulkImportMapping",
                fields: ["id", "name", "fileName", "moduleUniqueName"],
                filters: [
                  {
                    operator: "eq",
                    name: "moduleUniqueName",
                    value: moduleData.uniqueName,
                  },
                ],
                pageNumber: pageNumber,
              },
            });
            setBulkImportMappingPageNumber(pageNumber);
          } else {
            toast.error("Module data not found, cannot make request.");
          }
        }}
        setBulkImportJobs={(value: IBulkImport[]) => {
          setBulkImportJobs(value);
          setBulkImportJobsLoading(true);
        }}
        updateBulkImportJobs={(value: IBulkImport[]) => {
          setBulkImportJobs(value);
        }}
        selectedJobItemTab={selectedJobItemTab}
        onJobItemTabSelection={handleJobItemTabSelection}
        deleteBIMappingModal={deleteBIMappingModal}
        handleBIMappingDelete={handleBIMappingDelete}
        navigations={navigations}
        currentLabel={`${modelName
          ?.replace("bi", "")[0]
          ?.toLowerCase()}${modelName?.replace("bi", "").slice(1)}`}
        jobItemTableHeaderLoader={jobItemTableHeaderLoader}
        setJobItemTableHeaderLoader={setJobItemTableHeaderLoader}
      />
      {bulkImportModal.visible ? (
        <>
          <ConnectedBulkImportModal
            formDetails={bulkImportModal.formDetails}
            onCancel={() => setBulkImportModal(emptyModalValues)}
          />
          <Backdrop onClick={() => setBulkImportModal(emptyModalValues)} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
