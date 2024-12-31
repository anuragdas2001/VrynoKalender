import React from "react";
import { toast } from "react-toastify";
import { useFormikContext } from "formik";
import { useMutation } from "@apollo/client";
import { SupportedApps } from "../../../../../../models/shared";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import {
  ICreateModuleDataSharingRuleResponse,
  IUpdateModuleDataSharingRuleResponse,
  SAVE_MODULE_DATA_SHARING_RULE,
  UPDATE_MODULE_DATA_SHARING_RULE,
} from "../../../../../../graphql/mutations/dataSharingMutations";

export const ModuleDataSharingRulesForm = ({
  modulesData,
  moduleDataSharingRuleData,
  dataSaving,
  moduleDataRulesInitialValue,
  setDataSaving,
  setModuleDataSharingRuleData,
  updateInitialValues,
}: {
  modulesData: IModuleMetadata[];
  moduleDataSharingRuleData: Record<string, string>;
  dataSaving: boolean;
  moduleDataRulesInitialValue: Record<string, boolean>;
  setDataSaving: (value: boolean) => void;
  setModuleDataSharingRuleData: (value: Record<string, string>) => void;
  updateInitialValues: (keyName: string, name: string) => void;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, boolean>>();

  const [addModuleRule] = useMutation<ICreateModuleDataSharingRuleResponse>(
    SAVE_MODULE_DATA_SHARING_RULE,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    }
  );

  const [updateModuleRule] = useMutation<IUpdateModuleDataSharingRuleResponse>(
    UPDATE_MODULE_DATA_SHARING_RULE,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    }
  );

  const handlePermissionUpdate = (
    name: string,
    valueFrom: string,
    item: IModuleMetadata
  ) => {
    setDataSaving(true);
    const updateFunction = () => {
      setFieldValue(
        `${name}-private`,
        `${name}-private` === valueFrom ? !values[`${name}-private`] : false
      );
      setFieldValue(
        `${name}-read`,
        `${name}-read` === valueFrom ? !values[`${name}-read`] : false
      );
      setFieldValue(
        `${name}-read/modify`,
        `${name}-read/modify` === valueFrom
          ? !values[`${name}-read/modify`]
          : false
      );
      setFieldValue(
        `${name}-read/modify/remove`,
        `${name}-read/modify/remove` === valueFrom
          ? !values[`${name}-read/modify/remove`]
          : false
      );
    };

    if (!moduleDataSharingRuleData[name])
      addModuleRule({
        variables: {
          input: {
            moduleName: item.name,
            serviceName: SupportedApps.crm,
            modulePermission: valueFrom.split("-")[1],
          },
        },
      }).then((response) => {
        const responseType = "createModuleDataSharingRule";
        if (!response.data) return;
        if (response.data[responseType].messageKey.includes("-success")) {
          const updatedData = {
            ...moduleDataSharingRuleData,
            [item.name]: response.data[responseType].data.id,
          };
          setModuleDataSharingRuleData(updatedData);
          toast.success(response.data[responseType].message);
          updateFunction();
          updateInitialValues(valueFrom, name);
        } else {
          toast.error(response.data[responseType].message);
          console.log(response);
        }
        setDataSaving(false);
      });
    else
      updateModuleRule({
        variables: {
          id: moduleDataSharingRuleData[name],
          input: {
            moduleName: item.name,
            serviceName: SupportedApps.crm,
            modulePermission: valueFrom.split("-")[1],
          },
        },
      }).then((response) => {
        const responseType = "updateModuleDataSharingRule";
        if (!response.data) return;
        if (response.data[responseType].messageKey.includes("-success")) {
          const updatedData = {
            ...moduleDataSharingRuleData,
            [item.name]: response.data[responseType].data.id,
          };
          setModuleDataSharingRuleData(updatedData);
          toast.success(response.data[responseType].message);
          updateFunction();
          updateInitialValues(valueFrom, name);
        } else {
          toast.error(response.data[responseType].message);
          console.log(response);
        }
        setDataSaving(false);
      });
  };

  const tableHeaders = [
    {
      label: "Displayed As",
      columnName: "label.en",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Module Name",
      columnName: "name",
      dataType: SupportedDataTypes.singleline,
    },
    {
      label: "Private",
      columnName: "private",
      dataType: SupportedDataTypes.singleline,
      render: (item: IModuleMetadata, index: number) => {
        const name = item.name;
        return (
          <SwitchToggle
            name={`${name}-private`}
            onChange={() =>
              handlePermissionUpdate(name, `${name}-private`, item)
            }
            value={
              moduleDataRulesInitialValue[`${name}-private`]
                ? String(moduleDataRulesInitialValue[`${name}-private`])
                : "false"
            }
            disabled={values[`${name}-private`] === true ? true : dataSaving}
          />
        );
      },
    },
    {
      label: "Public Read",
      columnName: "read",
      dataType: SupportedDataTypes.singleline,
      render: (item: IModuleMetadata, index: number) => {
        const name = item.name;
        return (
          <SwitchToggle
            name={`${name}-read`}
            onChange={() => handlePermissionUpdate(name, `${name}-read`, item)}
            value={
              moduleDataRulesInitialValue[`${name}-read`]
                ? String(moduleDataRulesInitialValue[`${name}-read`])
                : "false"
            }
            disabled={values[`${name}-read`] === true ? true : dataSaving}
          />
        );
      },
    },
    {
      label: "Public Read/Write",
      columnName: "read/modify",
      dataType: SupportedDataTypes.singleline,
      render: (item: IModuleMetadata, index: number) => {
        const name = item.name;
        return (
          <SwitchToggle
            name={`${name}-read/modify`}
            onChange={() =>
              handlePermissionUpdate(name, `${name}-read/modify`, item)
            }
            value={
              moduleDataRulesInitialValue[`${name}-read/modify`]
                ? String(moduleDataRulesInitialValue[`${name}-read/modify`])
                : "false"
            }
            disabled={
              values[`${name}-read/modify`] === true ? true : dataSaving
            }
          />
        );
      },
    },
    {
      label: "Public Read/Write/Delete",
      columnName: "read/modify/remove",
      dataType: SupportedDataTypes.singleline,
      render: (item: IModuleMetadata, index: number) => {
        const name = item.name;
        return (
          <SwitchToggle
            name={`${name}-read/modify/remove`}
            onChange={() =>
              handlePermissionUpdate(name, `${name}-read/modify/remove`, item)
            }
            value={
              moduleDataRulesInitialValue[`${name}-read/modify/remove`]
                ? String(
                    moduleDataRulesInitialValue[`${name}-read/modify/remove`]
                  )
                : "false"
            }
            disabled={
              values[`${name}-read/modify/remove`] === true ? true : dataSaving
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
  }, []);

  return (
    <div className="px-6 mt-6">
      <div className="p-4 bg-white rounded-xl">
        <div ref={heightRef} className="overflow-y-auto">
          <GenericList
            data={[...modulesData, { ...moduleDataRulesInitialValue }]?.filter(
              (module) => module.customizationAllowed
            )}
            tableHeaders={tableHeaders}
            listSelector={false}
            showIcons={true}
          />
        </div>
      </div>
    </div>
  );
};
