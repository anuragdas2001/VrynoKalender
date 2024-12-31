import React from "react";
import GenericList from "../../../components/TailwindControls/Lists/GenericList";
import { ICustomField, SupportedDataTypes } from "../../../models/ICustomField";
import { setHeight } from "../crm/shared/utils/setHeight";
import { removeHeight } from "../crm/shared/utils/removeHeight";
import { camelCase, pascalCase } from "change-case";
import { IBulkImport } from "../../../models/shared";
import router from "next/router";
import NoDataFoundContainer from "../crm/shared/components/NoDataFoundContainer";
import ItemsLoader from "../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

export const BulkImportJobScreen = ({
  id,
  appName,
  modelName,
  ui,
  jobItemsPageLoading,
  bulkImportJobItems,
  fieldsList,
  jobPageLoading,
  bulkImportJobs,
  setBulkImportJobs,
  selectedJobItemTab,
  jobItemTableHeaderLoader,
  setJobItemTableHeaderLoader,
}: {
  id: string;
  appName: string;
  modelName: string;
  ui: string;
  jobItemsPageLoading: boolean;
  bulkImportJobItems: any[];
  fieldsList: ICustomField[];
  jobPageLoading: boolean;
  bulkImportJobs: IBulkImport[];
  setBulkImportJobs: (value: IBulkImport[]) => void;
  selectedJobItemTab: "success" | "failed" | "other";
  jobItemTableHeaderLoader: boolean;
  setJobItemTableHeaderLoader: (value: boolean) => void;
}) => {
  const tableHeaders = [
    {
      columnName: "fileName",
      label: "File Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "dumpedRecords",
      label: "Read from file",
      dataType: SupportedDataTypes.number,
    },
    {
      columnName: "totalRecords",
      label: "Total Records",
      dataType: SupportedDataTypes.number,
    },
    {
      columnName: "status",
      label: "Status",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "createdAt",
      label: "Job created at",
      dataType: SupportedDataTypes.datetime,
    },
  ];

  const bulkImportItemsHeightRef = React.useRef(null);
  const bulkImportJobItemsHeightRef = React.useRef(null);
  React.useEffect(() => {
    if (bulkImportItemsHeightRef) {
      if (bulkImportJobs.length > 9) {
        setHeight(bulkImportItemsHeightRef, 20);
      } else {
        removeHeight(bulkImportItemsHeightRef);
      }
    }
  }, [bulkImportJobs]);

  React.useEffect(() => {
    if (bulkImportJobItemsHeightRef) {
      if (bulkImportJobItems.length > 5) {
        setHeight(bulkImportJobItemsHeightRef, 20);
      } else {
        removeHeight(bulkImportJobItemsHeightRef);
      }
    }
  }, [bulkImportJobItems]);

  const [jobItemTableHeader, setJobItemTableHeader] = React.useState<
    {
      columnName: string;
      label: string;
      dataType: SupportedDataTypes;
    }[]
  >([]);

  React.useEffect(() => {
    const statusFields = [
      {
        columnName: "status",
        label: "Status",
        dataType: SupportedDataTypes.singleline,
      },
      {
        columnName: "errorMessage",
        label: "Error Message",
        dataType: SupportedDataTypes.singleline,
      },
    ];

    if (selectedJobItemTab === "success" || !bulkImportJobItems?.length) {
      setJobItemTableHeader([
        ...statusFields,
        ...fieldsList
          ?.filter((field) => field.visible && field.addInForm)
          .map((field) => {
            return {
              columnName: field.name,
              label: field.label.en,
              dataType: field.dataType as SupportedDataTypes,
            };
          }),
      ]);
      setJobItemTableHeaderLoader(false);
    }
    if (
      ["failed", "other"].includes(selectedJobItemTab) &&
      bulkImportJobItems?.length
    ) {
      const fieldsArray = [];
      for (const key in bulkImportJobItems[0]) {
        if (!["status", "errorMessage", "fields"].includes(key))
          fieldsArray.push({
            columnName: key,
            label: pascalCase(key),
            dataType: SupportedDataTypes.singleline,
          });
      }
      setJobItemTableHeader([...statusFields, ...fieldsArray]);
      setJobItemTableHeaderLoader(false);
    }
  }, [selectedJobItemTab, bulkImportJobItems, fieldsList]);

  return id && !jobItemsPageLoading ? (
    <>
      {bulkImportJobItems.length === 0 ? (
        <NoDataFoundContainer
          modelName={"Bulk Import"}
          containerMessage={`No ${
            selectedJobItemTab === "success"
              ? "Success"
              : selectedJobItemTab === "failed"
              ? "Failed"
              : "Other"
          } Job items found`}
          showButton={false}
        />
      ) : (
        <div className={`pt-4 pb-4 px-4 bg-white rounded-xl`}>
          <div
            ref={bulkImportJobItemsHeightRef}
            className="flex flex-col lg:flex-row overflow-y-auto bg-white"
          >
            {jobItemTableHeaderLoader ? (
              <ItemsLoader currentView={"List"} />
            ) : (
              <GenericList
                data={bulkImportJobItems}
                tableHeaders={jobItemTableHeader}
                fieldsList={fieldsList.filter((field) => field.visible)}
                onDetail={false}
                showIcons={false}
                listSelector={false}
                rowUrlGenerator={(item) => {
                  return item.id
                    ? `/app/${appName}/${
                        modelName[0].toLocaleLowerCase() + modelName.slice(1)
                      }/detail/${item.id}`
                    : "#";
                }}
                oldGenericListUI={true}
              />
            )}
          </div>
        </div>
      )}
    </>
  ) : !jobPageLoading && bulkImportJobs.length ? (
    <div className="pt-4 pb-4 px-4 bg-white rounded-xl">
      <div
        ref={bulkImportItemsHeightRef}
        className="flex flex-col lg:flex-row overflow-y-auto bg-white pr-1"
      >
        <GenericList
          tableHeaders={tableHeaders}
          fieldsList={fieldsList.filter((field) => field.visible)}
          data={bulkImportJobs}
          onDetail={false}
          showIcons={false}
          listSelector={false}
          handleRowClick={(item) => {
            setBulkImportJobs([]);
            router.push(
              `${appName}/bi-${camelCase(modelName)}/${ui}/${item.id}`
            );
          }}
          oldGenericListUI={true}
          // alignText="text-center"
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
