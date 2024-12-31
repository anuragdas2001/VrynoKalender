import { Formik } from "formik";
import React, { useState } from "react";
import { IRole } from "../../../../../../models/shared";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { getMergedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { ConnectedCustomizationFieldsPermission } from "./ConnectedCustomizationFieldsPermission";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import GenericList, {
  GenericListHeaderType,
} from "../../../../../../components/TailwindControls/Lists/GenericList";
import { toast } from "react-toastify";
import _ from "lodash";
import { CustomizationFieldsListActionWrapper } from "./CustomizationFieldsActionWrapper";

export type CustomizationFieldsTableProps = {
  fieldList: ICustomField[];
  tableDataProcessing: boolean;
  onEditCustomField?: (item: ICustomField) => void;
  handleCustomFieldUpdate: (item: ICustomField) => void;
  handleOrderUpdate: (itemOne: ICustomField, itemTwo: ICustomField) => void;
  userRoles: IRole[];
  filterValue: string;
  fieldPermissionData: Record<string, Record<string, boolean>>;
  setFieldPermissionData: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, boolean>>>
  >;
  savedFieldPermissionData: Record<string, string>;
  setSavedFieldPermissionData: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  userRoleLoader: boolean;
  fieldPermissionLoader: boolean;
};

const CustomizationFieldsTable = ({
  fieldList,
  tableDataProcessing,
  onEditCustomField = () => {},
  handleCustomFieldUpdate,
  handleOrderUpdate = () => {},
  userRoles,
  filterValue,
  fieldPermissionData,
  setFieldPermissionData,
  savedFieldPermissionData,
  setSavedFieldPermissionData,
  userRoleLoader,
  fieldPermissionLoader,
}: CustomizationFieldsTableProps) => {
  const filteredFieldList = fieldList
    ? getMergedFieldList(fieldList, [])
        .filter((field) => field.addInForm)
        .filter((field) => field.recordStatus !== "d")
    : [];
  const [debugModeOn, setDebugModeOn] = useState<boolean>(false);
  const [editFieldPermission, setEditFieldPermission] = React.useState<{
    visible: boolean;
    data: ICustomField | null;
  }>({
    visible: false,
    data: null,
  });

  React.useEffect(() => {
    try {
      const debugModeValue = window.getVrynoDebug();
      if (debugModeValue) {
        setDebugModeOn(debugModeValue === "true" ? true : false);
      }
    } catch (error) {}
  }, []);

  let tableHeaders: GenericListHeaderType[] = [
    {
      label: "",
      columnName: "",
      dataType: SupportedDataTypes.boolean,
      render: (item: ICustomField, index: number) => {
        return (
          <div className="flex gap-x-2 items-center">
            <Button
              id={`customization-${item?.label?.en}-up-arrow-icon`}
              onClick={
                tableDataProcessing
                  ? () => {}
                  : () =>
                      handleOrderUpdate(
                        {
                          ...filteredFieldList[index],
                          order: filteredFieldList[index - 1].order,
                        },
                        {
                          ...filteredFieldList[index - 1],
                          order: filteredFieldList[index].order,
                        }
                      )
              }
              customStyle={`cursor-pointer w-7 h-7 rounded-md justify-center items-center ${
                index === 1 &&
                filteredFieldList?.filter(
                  (header) => header.dataType === "recordImage"
                )?.length > 0
                  ? "hidden"
                  : index === 0
                  ? "hidden"
                  : "flex"
              } ${
                tableDataProcessing
                  ? "bg-vryno-theme-blue-disable"
                  : "bg-vryno-theme-light-blue"
              }`}
              disabled={tableDataProcessing}
              userEventName={`customization-${item?.label?.en}-up-arrow:action-click`}
            >
              <ArrowUpIcon size={18} className="text-white" />
            </Button>
            <Button
              id={`customization-${item?.label?.en}-down-arrow-icon`}
              onClick={
                tableDataProcessing
                  ? () => {}
                  : () =>
                      handleOrderUpdate(
                        {
                          ...filteredFieldList[index],
                          order: filteredFieldList[index + 1].order,
                        },
                        {
                          ...filteredFieldList[index + 1],
                          order: filteredFieldList[index].order,
                        }
                      )
              }
              customStyle={`cursor-pointer w-7 h-7  rounded-md flex justify-center items-center ${
                index === filteredFieldList.length - 1 ||
                (index === 0 && item.dataType === "recordImage")
                  ? "hidden"
                  : "flex"
              } ${
                tableDataProcessing
                  ? "bg-vryno-theme-blue-disable"
                  : "bg-vryno-theme-light-blue"
              }`}
              disabled={tableDataProcessing}
              userEventName={`customization-${item?.label?.en}-down-arrow:action-click`}
            >
              <ArrowDownIcon size={18} className="text-white" />
            </Button>
          </div>
        );
      },
    },
    {
      label: "Displayed As",
      columnName: "label.en",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Name",
      columnName: "name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Unique Name",
      columnName: "uniqueName",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Data Type",
      columnName: "dataType",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "System Defined",
      columnName: "systemDefined",
      dataType: SupportedDataTypes.boolean,
    },
    {
      label: "Quick Create",
      columnName: "showInQuickCreate",
      dataType: SupportedDataTypes.boolean,
      render: (item: ICustomField, index: number) => {
        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`showInQuickCreate${index}`]: item.showInQuickCreate,
              }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values }) => (
                <SwitchToggle
                  name={`showInQuickCreate${index}`}
                  dataTestId={`showInQuickCreate ${_.get(
                    item?.label,
                    "en",
                    ""
                  )}`}
                  onChange={() => {
                    item.showInQuickCreate === false
                      ? handleCustomFieldUpdate({
                          ...item,
                          showInQuickCreate: true,
                          visible: true,
                        })
                      : handleCustomFieldUpdate({
                          ...item,
                          showInQuickCreate: false,
                        });
                    MixpanelActions.track(
                      `switch-customization-field-${item?.name}-quick-create:toggle-click`,
                      {
                        type: "switch",
                      }
                    );
                  }}
                  value={values[`showInQuickCreate${index}`] as any}
                  disabled={
                    item?.dataTypeMetadata?.isSubform ||
                    item.restricted ||
                    tableDataProcessing ||
                    item.dataType === "autoNumber" ||
                    item.readOnly
                  }
                />
              )}
            </Formik>
          </form>
        );
      },
    },
    {
      label: "Mandatory",
      columnName: "mandatory",
      dataType: SupportedDataTypes.boolean,
      render: (item: ICustomField, index: number) => {
        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`mandatory${index}`]: item.mandatory,
              }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values }) => (
                <SwitchToggle
                  name={`mandatory${index}`}
                  dataTestId={`mandatory ${_.get(item?.label, "en", "")}`}
                  onChange={() => {
                    let allowProcessing = true;
                    if (fieldPermissionData[item.name]) {
                      for (const key in fieldPermissionData[item.name]) {
                        const permission = key.split(":")[1];
                        if (["read", "hide"].includes(permission)) {
                          if (fieldPermissionData[item.name][key] === true) {
                            toast.error(
                              "Please set field permissions to read/write"
                            );
                            allowProcessing = false;
                            break;
                          }
                        }
                      }
                    }
                    if (allowProcessing) {
                      item.mandatory === false
                        ? handleCustomFieldUpdate({
                            ...item,
                            mandatory: true,
                            visible: true,
                          })
                        : handleCustomFieldUpdate({
                            ...item,
                            mandatory: false,
                          });
                      MixpanelActions.track(
                        `switch-customization-field-${item?.name}-mandatory:toggle-click`,
                        {
                          type: "switch",
                        }
                      );
                    }
                  }}
                  value={values[`mandatory${index}`] as any}
                  disabled={
                    item?.dataTypeMetadata?.isSubform ||
                    item.restricted ||
                    tableDataProcessing ||
                    item.dataType === "autoNumber" ||
                    item.readOnly
                  }
                />
              )}
            </Formik>
          </form>
        );
      },
    },
    {
      label: "Visible",
      columnName: "visible",
      dataType: SupportedDataTypes.boolean,
      render: (item: ICustomField, index: number) => {
        return (
          <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
            <Formik
              initialValues={{
                [`visible${index}`]: item.visible,
              }}
              enableReinitialize
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values }) => (
                <SwitchToggle
                  name={`visible${index}`}
                  dataTestId={`visible ${_.get(item?.label, "en", "")}`}
                  onChange={() => {
                    MixpanelActions.track(
                      `switch-customization-field-${item?.name}-visible:toggle-click`,
                      {
                        type: "switch",
                      }
                    );
                    if (item.visible) {
                      handleCustomFieldUpdate({
                        ...item,
                        mandatory: false,
                        visible: false,
                        showInQuickCreate: false,
                      });
                    } else {
                      if (item?.dataTypeMetadata?.isSubform) {
                        let subFormFieldsCount = 0;
                        fieldList.map((field) => {
                          if (
                            field.dataTypeMetadata?.isSubform &&
                            field.visible
                          ) {
                            subFormFieldsCount++;
                          }
                        });
                        if (subFormFieldsCount >= 3) {
                          toast.error(
                            "Only 3 subform fields can be visible at a time."
                          );
                          return;
                        }
                      }
                      handleCustomFieldUpdate({ ...item, visible: true });
                    }
                  }}
                  value={values[`visible${index}`] as any}
                  disabled={item.restricted || tableDataProcessing}
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
      render: (item: ICustomField, index: number) => {
        return (
          <CustomizationFieldsListActionWrapper
            index={index}
            record={item}
            recordId={item?.id}
            tableDataProcessing={tableDataProcessing}
            onEditCustomField={onEditCustomField}
            setEditFieldPermission={setEditFieldPermission}
            zIndexValue={filteredFieldList.length - index}
          />
        );
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <GenericList
        data={filteredFieldList}
        tableHeaders={
          !debugModeOn
            ? tableHeaders.filter(
                (fieldsHeader: GenericListHeaderType) =>
                  fieldsHeader.columnName !== "uniqueName"
              )
            : tableHeaders
        }
        listSelector={false}
        filterValue={filterValue}
      />
      {editFieldPermission.visible && editFieldPermission?.data ? (
        <ConnectedCustomizationFieldsPermission
          fieldData={editFieldPermission.data}
          setEditFieldPermission={(value: { visible: boolean; data: null }) =>
            setEditFieldPermission(value)
          }
          userRoles={userRoles}
          selectedFieldPermissionData={
            fieldPermissionData[editFieldPermission.data.name] || null
          }
          fieldPermissionData={fieldPermissionData}
          setFieldPermissionData={setFieldPermissionData}
          savedFieldPermissionData={savedFieldPermissionData}
          setSavedFieldPermissionData={setSavedFieldPermissionData}
          userRoleLoader={userRoleLoader}
          fieldPermissionLoader={fieldPermissionLoader}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default CustomizationFieldsTable;
