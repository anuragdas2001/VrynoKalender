import { getAppPathParts } from "../crm/shared/utils/getAppPathParts";
import { IBulkImport } from "../../../models/shared";
import { camelCase } from "change-case";
import { ICustomField } from "../../../models/ICustomField";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../graphql/queries/fetchQuery";
import { getSortedFieldList } from "../crm/shared/utils/getOrderedFieldsList";
import { getDataObject } from "../crm/shared/utils/getDataObject";
import React, { useContext } from "react";
import { IModuleMetadata } from "../../../models/IModuleMetadata";
import { getVisibleFieldsArray } from "../crm/shared/utils/getFieldsArray";
import {
  bulkImportItemVariablesGenerator,
  bulkImportJobItemFetchVariableType,
  bulkImportTabType,
  getModelName,
  getUpdatedJobData,
  jobFields,
} from "./bulkImportHelper";
import { BulkImportContainer } from "./BulkImportContainer";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";

export const ConnectedBulkImport = observer(() => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched, allModulesFetched } =
    generalModelStore;
  let { appName, modelName, ui, id } = getAppPathParts();
  const [updatedModuleName, setUpdatedModuleName] = React.useState<string>("");
  const [bulkImportJobs, setBulkImportJobs] = React.useState<IBulkImport[]>([]);
  const [bulkImportJobItems, setBulkImportJobItems] = React.useState<any[]>([]);
  const [bulkImportJobItemsData, setBulkImportJobItemsData] = React.useState<
    any[]
  >([]);
  const [jobsCount, setJobsCount] = React.useState<number>(0);
  const [jobItemsCount, setJobItemsCount] = React.useState<number>(0);
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [moduleData, setModuleData] = React.useState<IModuleMetadata | null>(
    null
  );
  const [bulkImportJobsLoading, setBulkImportJobsLoading] =
    React.useState<boolean>(true);
  const [bulkImportJobItemsLoading, setBulkImportJobItemsLoading] =
    React.useState(true);
  const [bulkImportJobItemsDataLoading, setBulkImportJobItemsDataLoading] =
    React.useState<boolean>(true);
  const [currentJobPageNumber, setCurrentJobPageNumber] =
    React.useState<number>(1);
  const [jobItemTableHeaderLoader, setJobItemTableHeaderLoader] =
    React.useState(true);
  const [selectedJobItemTab, setSelectJobItemTab] =
    React.useState<bulkImportTabType>("success");

  React.useEffect(() => {
    if (modelName) {
      setUpdatedModuleName(getModelName(modelName));
    }
  }, [modelName]);

  const [getBulkImportJobs] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data) {
        setBulkImportJobs(responseOnCompletion.fetch.data);
        setJobsCount(responseOnCompletion.fetch.count);
      }
      setBulkImportJobsLoading(false);
    },
  });

  const [getBulkImportJobItems] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
        setBulkImportJobItems(
          responseOnCompletion.fetch.data.map((data: any) => {
            return {
              ...getDataObject(data.dataRow),
              status: data.status,
              errorMessage: data.errorMessage,
            };
          })
        );
        setJobItemsCount(responseOnCompletion.fetch.count);
      }
      setBulkImportJobItemsLoading(false);
    },
  });

  const [getBulkImportJobItemsData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  React.useEffect(() => {
    if (allModulesFetched && updatedModuleName) {
      let moduleInfoFromStore = genericModels[updatedModuleName]?.moduleInfo;
      if (moduleInfoFromStore) setModuleData(moduleInfoFromStore);
    }
  }, [allModulesFetched, updatedModuleName]);

  //Fetching BI jobs initially when component load
  React.useEffect(() => {
    if (updatedModuleName && appName) {
      setBulkImportJobsLoading(true);
      getBulkImportJobs({
        variables: {
          modelName: "BulkImportJob",
          fields: jobFields,
          filters: [
            {
              operator: "eq",
              name: "moduleName",
              value: updatedModuleName,
            },
          ],
        },
      });
    }
  }, [updatedModuleName, appName]);

  //Fetching BI job item data (which include record/job ids) when clicked on any job
  React.useEffect(() => {
    setBulkImportJobItems([]);
    setBulkImportJobItemsData([]);
    setSelectJobItemTab("success");
    if (!id && !appName) return;
    setBulkImportJobItemsLoading(true);
    setBulkImportJobItemsDataLoading(true);
    getBulkImportJobItems({
      variables: bulkImportItemVariablesGenerator(id, "success", 1),
    });
    if (allLayoutFetched && updatedModuleName) {
      let fieldsListFromStore = genericModels[updatedModuleName]?.fieldsList;
      if (fieldsListFromStore?.length > 0) {
        setFieldsList(
          getSortedFieldList(
            fieldsListFromStore.filter(
              (field) => !["json", "relatedTo"].includes(field.dataType)
            )
          )
        );
      }
    }
  }, [id, allLayoutFetched, updatedModuleName, appName]);

  //Fetching job item record data (which we get from BI job)
  React.useEffect(() => {
    if (!bulkImportJobItemsLoading && fieldsList?.length && id) {
      if (bulkImportJobItems?.length === 0) {
        setBulkImportJobItemsData([]);
        setBulkImportJobItemsDataLoading(false);
        return;
      }
      const requestArray = bulkImportJobItems
        .filter((data) => data.id)
        .map((data) => data.id);
      if (!requestArray.length) {
        setBulkImportJobItemsData(bulkImportJobItems);
        setBulkImportJobItemsDataLoading(false);
      } else {
        if (!appName) return;
        getBulkImportJobItemsData({
          variables: {
            modelName: updatedModuleName,
            fields: getVisibleFieldsArray(fieldsList),
            filters: [
              {
                operator: "in",
                name: "id",
                value: requestArray,
              },
              { name: "recordStatus", operator: "in", value: ["a", "i", "d"] },
            ],
          },
        }).then((response) => {
          if (response?.data?.fetch?.data?.length) {
            setBulkImportJobItemsData(
              getUpdatedJobData(bulkImportJobItems, response?.data?.fetch?.data)
            );
            setBulkImportJobItemsDataLoading(false);
          } else {
            setBulkImportJobItemsData(bulkImportJobItems);
            setBulkImportJobItemsDataLoading(false);
          }
        });
      }
    }
  }, [bulkImportJobItemsLoading, fieldsList, appName]);

  const handleJobPageChange = (pageNumber: number) => {
    setBulkImportJobsLoading(true);
    getBulkImportJobs({
      variables: {
        modelName: "BulkImportJob",
        fields: jobFields,
        filters: [
          {
            operator: "eq",
            name: "moduleName",
            value: updatedModuleName,
          },
        ],
        pageNumber: pageNumber,
      },
    });
    setCurrentJobPageNumber(pageNumber);
  };

  return (
    <BulkImportContainer
      appName={appName}
      modelName={updatedModuleName}
      ui={ui}
      id={id}
      moduleData={moduleData}
      setBulkImportJobItems={(value: any) => setBulkImportJobItems(value)}
      setBulkImportJobItemsLoading={(value: boolean) =>
        setBulkImportJobItemsLoading(value)
      }
      setBulkImportJobItemsDataLoading={(value: boolean) =>
        setBulkImportJobItemsDataLoading(value)
      }
      setSelectJobItemTab={(value: bulkImportTabType) => {
        setJobItemTableHeaderLoader(true);
        setSelectJobItemTab(value);
      }}
      getBulkImportJobItems={(value: bulkImportJobItemFetchVariableType) =>
        getBulkImportJobItems(value)
      }
      bulkImportJobsLoading={bulkImportJobsLoading}
      bulkImportJobItemsDataLoading={bulkImportJobItemsDataLoading}
      currentJobPageNumber={currentJobPageNumber}
      setCurrentJobPageNumber={(value: number) =>
        setCurrentJobPageNumber(value)
      }
      setBulkImportJobs={(value: IBulkImport[]) => setBulkImportJobs(value)}
      setBulkImportJobsLoading={(value: boolean) =>
        setBulkImportJobsLoading(value)
      }
      bulkImportJobs={bulkImportJobs}
      fieldsList={fieldsList}
      bulkImportJobItemsData={bulkImportJobItemsData}
      onJobPageChange={handleJobPageChange}
      selectedJobItemTab={selectedJobItemTab}
      jobsCount={jobsCount}
      jobItemsCount={jobItemsCount}
      jobItemTableHeaderLoader={jobItemTableHeaderLoader}
      setJobItemTableHeaderLoader={(value: boolean) =>
        setJobItemTableHeaderLoader(value)
      }
    />
  );
});
