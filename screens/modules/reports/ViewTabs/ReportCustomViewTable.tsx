import React from "react";
import GenericList, {
  GenericListHeaderType,
} from "../../../../components/TailwindControls/Lists/GenericList";
import { setHeight } from "../../crm/shared/utils/setHeight";
import { ICustomView, SupportedApps } from "../../../../models/shared";
import { SupportedDataTypes } from "../../../../models/ICustomField";
import { ActionWrapper } from "../../crm/shared/components/ActionWrapper";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import router from "next/router";
import { appsUrlGenerator } from "../../crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../models/allowedViews";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { User } from "../../../../models/Accounts";

export const ReportCustomViewTable = ({
  customViewList,
  moduleName,
  handleReportSubmit,
  user,
}: {
  customViewList: ICustomView[];
  moduleName: string;
  handleReportSubmit: (values: any, type: "filterValues" | "viewId") => void;
  user: User | null;
}) => {
  const { id } = router.query;
  const reportId = id as string;

  let tableHeaders: GenericListHeaderType[] = [
    {
      label: "Name",
      columnName: "name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Created On",
      columnName: "createdAt",
      dataType: SupportedDataTypes.datetime,
    },
    {
      columnName: "updatedAt",
      label: "Last Modified",
      dataType: SupportedDataTypes.datetime,
    },
    {
      label: "Actions",
      columnName: "actions",
      dataType: SupportedDataTypes.singleline,
      render: (item: ICustomView, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2 w-full">
                <Button
                  id="reports-custom-view-edit-view"
                  customStyle="h-9 w-24 rounded-md p-1 border border-vryno-button-border"
                  cssStyle={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #E3E3E3 100%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      appsUrlGenerator(
                        SupportedApps.crm,
                        moduleName,
                        AllowedViews.customView,
                        item.id,
                        ["reports", reportId]
                      )
                    );
                  }}
                  //   disabled={
                  //     dataProcessing || item.systemDefined || saveProcessing
                  //   }
                  disabled={item.systemDefined || user?.id !== item.createdBy}
                  userEventName="reports-customView-edit-view:action-click"
                >
                  <div className="border-vryno-content-divider flex flex-row items-center justify-center">
                    <EditBoxIcon
                      size={17}
                      className={`mr-2 ${
                        item.systemDefined || user?.id !== item.createdBy
                          ? "text-vryno-theme-blue-disable"
                          : "text-vryno-theme-light-blue cursor-pointer"
                      }`}
                    />
                    <span
                      className={`text-xsm font-medium ${
                        item.systemDefined || user?.id !== item.createdBy
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      Edit
                    </span>
                  </div>
                </Button>
              </div>
            }
          />
        );
      },
    },
  ];

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [customViewList]);

  return (
    <>
      <div className="px-6 pt-5">
        <div className="rounded-xl bg-white p-4">
          <div ref={heightRef} className="overflow-y-auto">
            <GenericList
              data={customViewList}
              tableHeaders={tableHeaders}
              listSelector={false}
              handleRowClick={(item) => {
                handleReportSubmit(item.id, "viewId");
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
