import React, { useEffect, useRef } from "react";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { AllowedForms } from "./AddDashboard";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { Formik } from "formik";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { setHeight } from "../../shared/utils/setHeight";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import { IDashboardDetails, IWidget } from "../../../../../models/Dashboard";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import TrueIcon from "remixicon-react/CheckLineIcon";
import FalseIcon from "remixicon-react/CloseLineIcon";
import { useFormikContext } from "formik";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import { RecordSharingCriteriaContainer } from "../../generic/GenericAddCustomView/RecordSharingCriteriaContainer";
import { ISharingRuleData } from "../../../../../models/shared";

export type DashboardFormFieldsProps = {
  type: AllowedForms;
  widgets: Partial<IWidget>[];
  savingProcess: boolean;
  editMode: boolean;
  data: IDashboardDetails;
  dashboards: IDashboardDetails[];
  handleSave: () => void;
  setAddEditWidgetModal: (value: { visible: boolean }) => void;
  moduleViewSharingData: ISharingRuleData | null;
};

const systemDefinedWidgets = [
  "Deal Pipeline",
  "My Organization",
  "My Contacts",
  "My Deals",
  "My Leads",
  "My Call logs",
  "My Notes",
  "My Meetings",
  "My Tasks",
  "Lead By Source",
  "Deal Forecast",
  "Revenue via closed Deals",
];

export const DashboardFormFields = ({
  type,
  widgets,
  dashboards,
  savingProcess,
  editMode,
  data,
  handleSave,
  setAddEditWidgetModal,
  moduleViewSharingData,
}: DashboardFormFieldsProps) => {
  const { values, setFieldValue, handleChange } =
    useFormikContext<Record<any, any>>();
  const [dashboardNameError, setDashboardNameError] = React.useState<
    string | undefined
  >(undefined);

  const tableHeaders = [
    {
      label: "Toggle Widget",
      columnName: "",
      dataType: SupportedDataTypes.boolean,
      render: (item: any, index: number) => {
        let statusValue = false;
        const existInValue =
          values["widgets"] &&
          values["widgets"]?.filter((id: string) => id === item?.id);
        if (existInValue?.length > 0) statusValue = true;
        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`enableDisableWidget${index}`]: statusValue,
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
                  name={`enableDisableWidget${index}`}
                  onChange={() => {
                    setFieldValue(
                      `enableDisableWidget${index}`,
                      !values[`enableDisableWidget${index}`]
                    );
                    handleToggleWidgets(item);
                    MixpanelActions.track(
                      `switch-dashboard-form-enable-disable-widget:toggle-click`,
                      {
                        type: "switch",
                      }
                    );
                  }}
                  value={values[`enableDisableWidget${index}`]}
                  disabled={item.id === undefined}
                  allowMargin={false}
                />
              )}
            </Formik>
          </form>
        );
      },
    },
    {
      columnName: "name",
      label: "Widget Name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      columnName: "systemDefined",
      label: "System Defined",
      dataType: SupportedDataTypes.boolean,
      render: (item: any) => {
        return (
          <div className="w-full flex items-center justify-center">
            {systemDefinedWidgets.includes(item.name) ? (
              <TrueIcon className="text-gray-500" size={20} />
            ) : (
              <FalseIcon className="text-gray-500" size={20} />
            )}
          </div>
        );
      },
    },
  ];

  const handleToggleWidgets = (item: any) => {
    let widgetsArray: string[] = values["widgets"] ?? [];
    const findWidget = widgetsArray.findIndex(
      (widgetId) => widgetId === item.id
    );
    if (findWidget === -1) {
      widgetsArray = widgetsArray.concat([item.id]);
    } else {
      widgetsArray.splice(findWidget, 1);
    }
    setFieldValue("widgets", widgetsArray);
  };

  const heightRefOne = useRef(null);
  useEffect(() => {
    if (heightRefOne) {
      setHeight(heightRefOne, 65);
    }
  }, []);

  const checkIfNameAlreadyPresent = (value: string | null) => {
    const foundAt = dashboards.findIndex(
      (dashboard) => dashboard.name.toLowerCase() === value?.toLowerCase()
    );
    if (foundAt !== -1) {
      if (dashboards[foundAt].id === data.id) {
      } else {
        setDashboardNameError("Name already exist.");
      }
    } else {
      setDashboardNameError(undefined);
    }
  };

  return (
    <>
      <GenericBackHeader
        heading={
          type === AllowedForms.Add ? "Create Dashboard" : "Edit Dashboard"
        }
      >
        <div>
          <Button
            id={`${AllowedForms.Add ? "add" : "edit"}-dashboard-button`}
            onClick={() => handleSave()}
            kind="primary"
            disabled={
              savingProcess || (dashboardNameError !== undefined ? true : false)
            }
            loading={savingProcess}
            userEventName={`dashboard-${
              type === AllowedForms.Add ? "save" : "update"
            }-click`}
          >
            <span
              className={`px-4 sm:px-6 col-span-2 sm:col-span-8 flex justify-center items-center w-full h-full`}
            >
              <span className="text-sm">
                {type === AllowedForms.Add ? "Save" : "Update"}
              </span>
            </span>
          </Button>
        </div>
      </GenericBackHeader>
      <div className="px-6 pt-4 md:mx-20">
        <GenericHeaderCardContainer
          cardHeading="Dashboard Properties"
          extended={true}
          id="add-widgets-new-dashboard"
          allowToggle={false}
          renderHtmlNextToOpenCloseButton={
            <div className={`w-40 px-4`}>
              <Button
                id={`add-widget-button`}
                onClick={() => setAddEditWidgetModal({ visible: true })}
                kind="next"
                buttonType="thin"
                userEventName="open-add-widget-modal-click"
              >
                <span className={`flex items-center w-full h-full`}>
                  <AddIcon size={16} className="mr-2" />
                  <span className="text-sm">Widget</span>
                </span>
              </Button>
            </div>
          }
        >
          <>
            <div className="w-full h-full">
              <FormInputBox
                name="name"
                required={true}
                label="Dashboard Name"
                onChange={(e) => {
                  handleChange(e);
                  checkIfNameAlreadyPresent(e.currentTarget.value);
                }}
                externalError={dashboardNameError}
              />
            </div>
            <div className="w-full flex flex-col mt-4">
              <div
                ref={heightRefOne}
                className={`overflow-y-auto ${
                  !values["widgets"] || values["widgets"]?.length === 0
                    ? "border-2 border-red-100 rounded-md"
                    : ""
                }`}
              >
                {widgets && (
                  <GenericList
                    tableHeaders={tableHeaders}
                    data={widgets}
                    onDetail={false}
                    showIcons={false}
                    listSelector={false}
                    alignText="text-center"
                    oldGenericListUI={true}
                  />
                )}
              </div>
              <RecordSharingCriteriaContainer
                recordCreatedById={data?.createdBy ?? null}
                editMode={editMode}
                moduleViewSharingData={moduleViewSharingData}
              />
              {(!values["widgets"] || values["widgets"]?.length === 0) && (
                <label className="text-red-600 ml-2 mt-1 text-xs ">
                  {"Please select atleast one widget"}
                </label>
              )}
            </div>
          </>
        </GenericHeaderCardContainer>
      </div>
    </>
  );
};
