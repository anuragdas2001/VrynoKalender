import React, { useEffect, useRef } from "react";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { IWorkflowRule } from "../../../../../models/shared";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import Link from "next/link";
import { useRouter } from "next/router";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { SettingsSideBar } from "../../SettingsSidebar";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import NoDataFoundContainer from "../../../crm/shared/components/NoDataFoundContainer";
import { WorkFlowList } from "./WorkFlowList";
import Pagination from "../../../crm/shared/components/Pagination";
import { NoViewPermission } from "../../../crm/shared/components/NoViewPermission";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { TableQuickFilter } from "../../../../Shared/TableQuickFilter";
import { PaginationFilterComponent } from "../../../../Shared/PaginationFilterCombined";
import { Formik } from "formik";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";

const workflowTableHeader = (
  editWorkflow: (item: IWorkflowRule) => void,
  deleteWorkflow: (item: IWorkflowRule) => void,
  handleStatusChange: (id: string, recordStatus: "a" | "i") => void,
  statusChangeProcess: boolean,
  setStatusChangeProcess: (value: boolean) => void
) => [
  {
    label: "Rule Name",
    columnName: "name",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Module Name",
    columnName: "recordModuleName",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Execute When",
    columnName: "typeConfig.triggeringEvent",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Last Modified At",
    columnName: "updatedAt",
    dataType: SupportedDataTypes.date,
  },
  {
    label: "Active",
    columnName: "recordStatus",
    dataType: SupportedDataTypes.boolean,
    render: (item: IWorkflowRule, index: number) => {
      return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
          <Formik
            initialValues={{
              [`recordStatus${index}`]:
                item.recordStatus === "a" ? true : false,
            }}
            enableReinitialize
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({ values }) => (
              <SwitchToggle
                name={`recordStatus${index}`}
                dataTestId={`toggle-recordStatus-${_.get(
                  item?.label,
                  "en",
                  ""
                )}`}
                onChange={() => {
                  setStatusChangeProcess(true);
                  handleStatusChange(
                    item.id,
                    values[`recordStatus${index}`] === true ? "i" : "a"
                  );
                  MixpanelActions.track(
                    `switch-workflow-${item?.name}-recordStatus:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                }}
                value={values[`recordStatus${index}`] as any}
                disabled={statusChangeProcess}
              />
            )}
          </Formik>
        </form>
      );
    },
  },
  {
    label: "Actions",
    columnName: "actions",
    dataType: SupportedDataTypes.singleline,
    render: (item: IWorkflowRule, index: number) => {
      return (
        <ActionWrapper
          index={index}
          content={
            <div className="flex flex-row gap-x-2 items-center">
              <Button
                id={`edit-workflow-${item.name}`}
                onClick={() => editWorkflow(item)}
                customStyle=""
                userEventName="workflow-edit:action-click"
              >
                <EditBoxIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
              <Button
                id={`delete-workflow-${item.name}`}
                onClick={() => deleteWorkflow(item)}
                customStyle=""
                userEventName="workflow-delete:action-click"
              >
                <DeleteBinIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
            </div>
          }
        />
      );
    },
  },
];

export type WorkFlowScreenProps = {
  rules: IWorkflowRule[];
  dataFetchLoading: boolean;
  viewPermission: boolean;
  deleteWorkFlowRule: (item: IWorkflowRule) => void;
  itemsCount: number;
  currentPageNumber: number;
  filterValue: string;
  setFilterValue?: (value: string) => void;
  onPageChange: (pageNumber: number) => void;
  statusChangeProcess: boolean;
  handleStatusChange: (id: string, recordStatus: "a" | "i") => void;
  setStatusChangeProcess: (value: boolean) => void;
};

export const WorkFlowScreen = ({
  rules,
  dataFetchLoading,
  viewPermission,
  deleteWorkFlowRule,
  itemsCount,
  currentPageNumber,
  filterValue,
  setFilterValue = () => {},
  onPageChange = () => {},
  statusChangeProcess,
  handleStatusChange,
  setStatusChangeProcess,
}: WorkFlowScreenProps) => {
  const router = useRouter();
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const heightRef = useRef(null);

  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [rules]);

  return (
    <>
      <GenericBackHeader heading="WorkFlows">
        <Link href="" legacyBehavior>
          <a
            id="add-workflow"
            onClick={
              dataFetchLoading
                ? () => {}
                : (e) => {
                    e.preventDefault();
                    router.push("crm/workflows/add").then();
                  }
            }
            className={`py-2 px-4 text-white rounded-md text-sm flex items-center justify-center gap-x-2 bg-vryno-theme-blue ${
              dataFetchLoading ? "opacity-50 cursor-default" : ""
            }`}
          >
            <AddIcon size={18} />
            <span>{`Workflow`}</span>
          </a>
        </Link>
      </GenericBackHeader>
      <div className="flex justify-between mt-4">
        <div className="sm:hidden w-40">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
          >
            <SettingsSideBar />
          </SideDrawer>
        </div>
        {rules.length > 0 && (
          <div className="pr-6 w-full flex justify-end pl-6">
            <PaginationFilterComponent
              filterName={"workflows"}
              currentPageItemCount={rules.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`hidden sm:flex sm:justify-between w-full`}
            />
            <PaginationFilterComponent
              filterName={"workflows"}
              currentPageItemCount={rules.length}
              currentPageNumber={currentPageNumber}
              onPageChange={onPageChange}
              setFilterValue={setFilterValue}
              itemsCount={itemsCount}
              classStyle={`sm:hidden flex flex-col`}
            />
          </div>
        )}
      </div>

      <div className="px-6 mt-2">
        {dataFetchLoading ? (
          ItemsLoader({ currentView: "List", loadingItemCount: 4 })
        ) : !viewPermission ? (
          <NoViewPermission
            modelName="WorkFlows"
            addPadding={false}
            marginTop={"mt-8"}
          />
        ) : rules.length > 0 ? (
          <div className="bg-white pt-4 pb-1 px-4 rounded-xl">
            <div ref={heightRef}>
              <WorkFlowList
                data={rules}
                tableHeaders={workflowTableHeader(
                  (item: IWorkflowRule) =>
                    router.push(`/settings/crm/workflows/edit/${item.id}`),
                  (item: IWorkflowRule) => deleteWorkFlowRule(item),
                  handleStatusChange,
                  statusChangeProcess,
                  setStatusChangeProcess
                )}
                modelName="emailTemplate"
                filterValue={filterValue}
              />
            </div>
          </div>
        ) : (
          <NoDataFoundContainer
            modelName="workflow"
            onClick={() => router.push("/settings/crm/workflows/add")}
          />
        )}
      </div>
    </>
  );
};
