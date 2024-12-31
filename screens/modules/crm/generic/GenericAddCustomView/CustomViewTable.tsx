import { Formik, FormikValues } from "formik";
import React, { useEffect, useRef } from "react";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../components/TailwindControls/Lists/GenericList";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { ICustomView, IUserPreference } from "../../../../../models/shared";
import { ActionWrapper } from "../../shared/components/ActionWrapper";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import { setHeight } from "../../shared/utils/setHeight";
import { useRouter } from "next/router";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../models/allowedViews";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import { get } from "lodash";

export const CustomViewTable = ({
  appName,
  modelName,
  customViewList,
  dataProcessing,
  userPreferences,
  saveProcessing,
  handleUserPreference,
  handleDeleteCustomView,
}: {
  appName: string;
  modelName: string;
  customViewList: ICustomView[];
  dataProcessing: boolean;
  userPreferences: IUserPreference[] | null;
  saveProcessing: boolean;
  handleUserPreference: (
    status: boolean,
    customViewId: string,
    customView: ICustomView
  ) => void;
  handleDeleteCustomView: (item: ICustomView) => void;
}) => {
  const router = useRouter();

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
      label: "Status",
      columnName: "updatedBy",
      dataType: SupportedDataTypes.boolean,
      render: (item: ICustomView, index: number) => {
        const userPreferencesForModel =
          userPreferences &&
          userPreferences.length > 0 &&
          get(userPreferences[0]?.defaultPreferences, modelName);

        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`status${index}`]:
                  userPreferencesForModel?.moduleView === item.id
                    ? true
                    : false,
              }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, setFieldValue }) => (
                <SwitchToggle
                  name={`status${index}`}
                  onChange={() => {
                    setFieldValue(`status${index}`, !values[`status${index}`]);
                    handleUserPreference(
                      !values[`status${index}`],
                      item.id,
                      item
                    );
                    MixpanelActions.track(
                      `switch-customView-status:toggle-click`,
                      {
                        type: "switch",
                      }
                    );
                  }}
                  value={values[`status${index}`].toString()}
                  disabled={item.restricted || dataProcessing || saveProcessing}
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
      render: (item: ICustomView, index: number) => {
        return (
          <ActionWrapper
            index={index}
            content={
              <div className="flex flex-row gap-x-2 w-full">
                <Button
                  id={`custom-view-edit-${item.id}`}
                  onClick={
                    dataProcessing || item.systemDefined
                      ? () => {}
                      : () =>
                          router.push(
                            appsUrlGenerator(
                              appName,
                              modelName,
                              AllowedViews.customView,
                              item.id
                            )
                          )
                  }
                  customStyle=""
                  disabled={
                    dataProcessing || item.systemDefined || saveProcessing
                  }
                  userEventName="customView-table-edit:action-click"
                >
                  <EditBoxIcon
                    size={20}
                    className={`${
                      dataProcessing || item.systemDefined || saveProcessing
                        ? "text-vryno-theme-blue-disable"
                        : "text-vryno-theme-light-blue cursor-pointer"
                    }`}
                  />
                </Button>
                <Button
                  id={`custom-view-edit-${item.id}`}
                  onClick={
                    dataProcessing || item.systemDefined
                      ? () => {}
                      : () => handleDeleteCustomView(item)
                  }
                  disabled={
                    dataProcessing || item.systemDefined || saveProcessing
                  }
                  customStyle=""
                  userEventName="customView-table-delete:action-click"
                >
                  <DeleteIcon
                    size={20}
                    className={`${
                      dataProcessing || item.systemDefined || saveProcessing
                        ? "text-vryno-theme-blue-disable"
                        : "text-vryno-theme-light-blue cursor-pointer"
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

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [customViewList]);

  return (
    <div className="rounded-xl bg-white p-4">
      <div ref={heightRef} className="overflow-y-auto">
        <GenericList
          data={customViewList}
          tableHeaders={tableHeaders}
          listSelector={false}
        />
      </div>
    </div>
  );
};
