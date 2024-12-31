import GenericList, {
  GenericListHeaderType,
} from "../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../models/ICustomField";
import { ActionWrapper } from "../crm/shared/components/ActionWrapper";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import React from "react";
import router from "next/router";
import { setHeight } from "../crm/shared/utils/setHeight";
import { removeHeight } from "../crm/shared/utils/removeHeight";
import { IBulkImportMappingData } from "./bulkImportHelper";
import Button from "../../../components/TailwindControls/Form/Button/Button";

export const BulkImportMappingScreen = ({
  bulkImportMappingData,
  bIDeleteProcessing,
  setDeleteBIMappingModal,
  appName,
  modelName,
  bulkImportMappingDataLoading,
}: {
  bulkImportMappingData: IBulkImportMappingData[];
  bIDeleteProcessing: boolean;
  setDeleteBIMappingModal: (value: {
    visible: boolean;
    item: null | IBulkImportMappingData;
  }) => void;
  appName: string;
  modelName: string;
  bulkImportMappingDataLoading: boolean;
}) => {
  const tableHeaders: GenericListHeaderType[] = [
    {
      label: "Name",
      columnName: "name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "File Name",
      columnName: "fileName",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Actions",
      columnName: "",
      dataType: SupportedDataTypes.singleline,
      render: (item: IBulkImportMappingData, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2 items-center">
                <Button
                  onClick={() => {
                    router.push(`${appName}/${modelName}/biedit/${item.id}`);
                  }}
                  id={`edit-mapping-${item.id}`}
                  disabled={bIDeleteProcessing}
                  customStyle=""
                  userEventName="bulkImport-mapping-edit:action-click"
                >
                  <EditBoxIcon
                    size={20}
                    className={`text-vryno-theme-light-blue cursor-pointer ${
                      bIDeleteProcessing ? "opacity-75" : ""
                    }`}
                  />
                </Button>
                <Button
                  onClick={() =>
                    setDeleteBIMappingModal({ visible: true, item: item })
                  }
                  id={`delete-mapping-${item.id}`}
                  disabled={bIDeleteProcessing}
                  customStyle=""
                  userEventName="bulkImport-mapping-delete:action-click"
                >
                  <DeleteBinIcon
                    size={20}
                    className={`text-vryno-theme-light-blue cursor-pointer ${
                      bIDeleteProcessing ? "opacity-75" : ""
                    }`}
                  />
                </Button>
              </div>
            }
          />
        );
      },
    },
  ];
  const bulkImportMappingHeightRef = React.useRef(null);
  React.useEffect(() => {
    if (bulkImportMappingHeightRef) {
      if (bulkImportMappingData.length > 5) {
        setHeight(bulkImportMappingHeightRef, 20);
      } else {
        removeHeight(bulkImportMappingHeightRef);
      }
    }
  }, [bulkImportMappingData]);

  return !bulkImportMappingDataLoading && bulkImportMappingData.length ? (
    <div className="pt-4 pb-4 px-4 bg-white rounded-xl">
      <div
        ref={bulkImportMappingHeightRef}
        className="flex flex-col lg:flex-row overflow-y-auto bg-white pr-1"
      >
        <GenericList
          data={bulkImportMappingData}
          tableHeaders={tableHeaders}
          listSelector={false}
          rowUrlGenerator={(item) => {
            return `${appName}/${modelName}/biimport/${item.id}`;
          }}
          oldGenericListUI={true}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};
