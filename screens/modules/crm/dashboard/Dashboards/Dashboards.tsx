import React, { useEffect, useRef } from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import Pagination from "../../shared/components/Pagination";
import { IDashboardDetails } from "../../../../../models/Dashboard";
import { setHeight } from "../../shared/utils/setHeight";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { ActionWrapper } from "../../shared/components/ActionWrapper";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import { IUserPreference } from "../../../../../models/shared";
import { Formik } from "formik";
import { useRouter } from "next/router";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { MixpanelActions } from "../../../../Shared/MixPanel";

export type DashboardsProps = {
  dashboards: IDashboardDetails[];
  userPreferenceDefaultDashboard?: IUserPreference;
  itemsCount: number;
  currentPageNumber: number;
  handlePageChange: (pageNumber: number) => void;
  setDeleteModal: (value: { visible: boolean; item: any }) => void;
  handlePreferencesChange?: (item: IDashboardDetails, value: boolean) => void;
};

export const Dashboards = ({
  dashboards,
  userPreferenceDefaultDashboard,
  itemsCount,
  currentPageNumber,
  handlePageChange,
  setDeleteModal,
  handlePreferencesChange = () => {},
}: DashboardsProps) => {
  const router = useRouter();
  let { appName, modelName } = getAppPathParts();

  let tableHeaders = [
    {
      columnName: "name",
      label: "Dashboard Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Default Dashboard",
      columnName: "",
      dataType: SupportedDataTypes.boolean,
      render: (item: any, index: number) => {
        let defaultDashboard: string | undefined = undefined;
        if (userPreferenceDefaultDashboard) {
          defaultDashboard = userPreferenceDefaultDashboard.defaultPreferences
            .dashboard
            ? userPreferenceDefaultDashboard.defaultPreferences.dashboard
            : undefined;
        }
        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`defaultDashboard${index}`]:
                  defaultDashboard === item.id ? true : false,
              }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({
                values,
                setFieldValue,
              }: {
                values: any;
                setFieldValue: any;
              }) => (
                <SwitchToggle
                  name={`defaultDashboard${index}`}
                  onChange={() => {
                    setFieldValue(
                      `defaultDashboard${index}`,
                      !values[`defaultDashboard${index}`]
                    );
                    handlePreferencesChange(
                      item,
                      !values[`defaultDashboard${index}`]
                    );
                    MixpanelActions.track(
                      `switch-dashboard-set-default-dashboard:toggle-click`,
                      {
                        type: "switch",
                      }
                    );
                  }}
                  value={values[`defaultDashboard${index}`]}
                  disabled={
                    userPreferenceDefaultDashboard?.defaultPreferences.dashboard
                      ? false
                      : item.id
                      ? false
                      : true
                  }
                />
              )}
            </Formik>
          </form>
        );
      },
    },
    {
      columnName: "actions",
      label: "Actions",
      dataType: SupportedDataTypes.singleline,
      render: (item: any, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2">
                <Button
                  onClick={() => {
                    item.id
                      ? router.push(
                          `${appName}/${modelName}/edit-dashboard/${item.id}`
                        )
                      : () => {};
                  }}
                  id={`dashboard-edit-${item.id || item.name}`}
                  customStyle=""
                  userEventName="dashboard-edit:action-click"
                >
                  <EditBoxIcon
                    size={20}
                    className={`${
                      item.id
                        ? "text-vryno-theme-light-blue cursor-pointer"
                        : "text-vryno-theme-blue-disable cursor-default"
                    }`}
                  />
                </Button>
                <Button
                  onClick={() => {
                    item.id
                      ? setDeleteModal({ visible: true, item: item })
                      : () => {};
                  }}
                  id={`dashboard-delete-${item.id || item.name}`}
                  customStyle=""
                  userEventName="dashboard-delete:action-click"
                >
                  <DeleteBinIcon
                    size={20}
                    className={`${
                      item.id
                        ? "text-vryno-theme-light-blue cursor-pointer"
                        : "text-vryno-theme-blue-disable cursor-default"
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

  const heightRefOne = useRef(null);
  useEffect(() => {
    if (heightRefOne) {
      setHeight(heightRefOne, 40);
    }
  }, []);

  return (
    <div className="w-full h-full">
      <GenericBackHeader
        heading="Dashboards"
        onClick={() => {
          router.push(`${appName}/${modelName}/dashboard`);
        }}
      >
        <div>
          <Button
            id={`add-dashboard-button`}
            onClick={() => {
              router.push(`${appName}/${modelName}/add-dashboard`);
            }}
            kind="primary"
            userEventName="open-add-dashboard-page-click"
          >
            <span
              className={`px-4 sm:px-6 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
            >
              <AddIcon size={16} className="mr-2" />
              <span className="text-sm">Dashboard</span>
            </span>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="w-full flex flex-col mt-10 px-6">
        <div className="w-full h-full flex justify-end">
          <Pagination
            itemsCount={itemsCount}
            currentPageItemCount={dashboards.length}
            pageSize={50}
            onPageChange={(pageNumber) => handlePageChange(pageNumber)}
            currentPageNumber={currentPageNumber}
          />
        </div>
        <div className="bg-white pt-4 pb-1 px-4 rounded-xl mt-2">
          <div ref={heightRefOne} className={`overflow-y-auto`}>
            {dashboards && (
              <GenericList
                tableHeaders={tableHeaders}
                data={dashboards}
                onDetail={false}
                showIcons={false}
                listSelector={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
