import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { FetchResult, useMutation } from "@apollo/client";
import { IRole, SupportedApps } from "../../../../../../models/shared";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import {
  SAVE_FIELD_PERMISSION,
  UPDATE_FIELD_PERMISSION,
} from "../../../../../../graphql/mutations/fieldPermissionMutations";

export const ConnectedCustomizationFieldsPermission = ({
  fieldData,
  setEditFieldPermission,
  userRoles,
  selectedFieldPermissionData,
  fieldPermissionData,
  setFieldPermissionData,
  savedFieldPermissionData,
  setSavedFieldPermissionData,
  userRoleLoader,
  fieldPermissionLoader,
}: {
  fieldData: ICustomField | null;
  setEditFieldPermission: (value: { visible: boolean; data: null }) => void;
  userRoles: IRole[];
  selectedFieldPermissionData: Record<string, boolean> | null;
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
}) => {
  const { t } = useTranslation(["forgot-password", "common"]);
  const [dataSaving, setDataSaving] = React.useState(false);

  const [addFieldPermissionData] = useMutation(SAVE_FIELD_PERMISSION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });
  const [updateFieldPermissionData] = useMutation(UPDATE_FIELD_PERMISSION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
  });

  const handleSaveUpdateFieldPermission = (
    name: string,
    permission: "read/write" | "read" | "hide",
    setFieldValue: any
  ) => {
    if (!fieldData) return;
    setDataSaving(true);
    const updateFormikFieldPermission = () => {
      setFieldValue(
        `${name}:read/write`,
        permission === "read/write" ? true : false
      );
      setFieldValue(`${name}:read`, permission === "read" ? true : false);
      setFieldValue(`${name}:hide`, permission === "hide" ? true : false);
    };
    const responseHandler = (
      response: FetchResult<any>,
      type: "add" | "update"
    ) => {
      const responseType =
        type === "add" ? "createFieldPermission" : "updateFieldPermission";
      if (response?.data?.[responseType].messageKey.includes("-success")) {
        const updatedData = {
          [fieldData.name]: {
            ...fieldPermissionData[fieldData.name],
            [`${name}:read/write`]: permission === "read/write" ? true : false,
            [`${name}:read`]: permission === "read" ? true : false,
            [`${name}:hide`]: permission === "hide" ? true : false,
          },
        };
        setFieldPermissionData({
          ...fieldPermissionData,
          ...updatedData,
        });
        if (type === "add") {
          const data = response.data[responseType].data;
          setSavedFieldPermissionData({
            ...savedFieldPermissionData,
            [`${data.fieldName}:${data.role}`]: data.id,
          });
        }
        toast.success(response.data[responseType].message);
        updateFormikFieldPermission();
      } else if (response?.data?.[responseType].message) {
        toast.error(response.data[responseType].message);
      } else {
        toast.error(t("common:unknown-message"));
        console.error(response);
      }
      setDataSaving(false);
    };
    if (savedFieldPermissionData[`${fieldData.name}:${name}`]) {
      updateFieldPermissionData({
        variables: {
          id: savedFieldPermissionData[`${fieldData.name}:${name}`],
          input: {
            moduleName: fieldData?.moduleName,
            fieldName: fieldData?.name,
            permission: permission,
            role: name,
          },
        },
      }).then((response) => responseHandler(response, "update"));
    } else {
      addFieldPermissionData({
        variables: {
          input: {
            moduleName: fieldData?.moduleName,
            fieldName: fieldData?.name,
            permission: permission,
            role: name,
          },
        },
      }).then((response) => responseHandler(response, "add"));
    }
  };
  const initialValues: Record<string, boolean> = {};
  userRoles.forEach((data) => {
    initialValues[`${data.key}:read/write`] = true;
  });

  if (selectedFieldPermissionData) {
    for (const roleKey in initialValues) {
      const [roleName, permissionName] = roleKey.split(":");
      for (const fieldDataKey in selectedFieldPermissionData) {
        if (roleName === fieldDataKey.split(":")[0]) {
          if (selectedFieldPermissionData[`${roleName}:read/write`] !== true)
            initialValues[roleKey] = false;
          initialValues[fieldDataKey] =
            selectedFieldPermissionData[fieldDataKey];
        }
      }
    }
  }

  return userRoleLoader || fieldPermissionLoader ? (
    <ItemsLoader currentView="List" loadingItemCount={2} />
  ) : (
    <>
      <GenericFormModalContainer
        formHeading={`Edit Field Permission ${
          `- ${fieldData?.label?.en}` || `- ${fieldData?.name}` || ""
        }`}
        onOutsideClick={() =>
          setEditFieldPermission({ visible: false, data: null })
        }
        extendedWidth
        onCancel={() => setEditFieldPermission({ visible: false, data: null })}
      >
        <Formik initialValues={initialValues} onSubmit={(values) => {}}>
          {({
            values,
            setFieldValue,
          }: {
            values: FormikValues;
            setFieldValue: any;
          }) => (
            <>
              <GenericList
                data={userRoles}
                tableHeaders={[
                  {
                    columnName: "role",
                    label: "Role",
                    dataType: SupportedDataTypes.singleline,
                  },
                  {
                    columnName: "read/write",
                    label: "Read and Write",
                    dataType: SupportedDataTypes.singleline,
                    render: (item: IRole, index: number) => {
                      const name = item.key;
                      return (
                        <SwitchToggle
                          name={`${name}:read/write`}
                          onChange={() =>
                            handleSaveUpdateFieldPermission(
                              name,
                              "read/write",
                              setFieldValue
                            )
                          }
                          value={
                            values[`${name}:read/write`]
                              ? String(values[`${name}:read/write`])
                              : "false"
                          }
                          disabled={
                            values[`${name}:read/write`] === true
                              ? true
                              : dataSaving
                          }
                        />
                      );
                    },
                  },
                  {
                    columnName: "read",
                    label: "Read Only",
                    dataType: SupportedDataTypes.singleline,
                    render: (item: IRole, index: number) => {
                      const name = item.key;
                      return (
                        <SwitchToggle
                          name={`${name}:read`}
                          onChange={() =>
                            handleSaveUpdateFieldPermission(
                              name,
                              "read",
                              setFieldValue
                            )
                          }
                          value={
                            values[`${name}:read`]
                              ? String(values[`${name}:read`])
                              : "false"
                          }
                          disabled={
                            values[`${name}:read`] === true ? true : dataSaving
                          }
                        />
                      );
                    },
                  },
                  {
                    columnName: "hide",
                    label: "Hide",
                    dataType: SupportedDataTypes.singleline,
                    render: (item: IRole, index: number) => {
                      const name = item.key;
                      return (
                        <SwitchToggle
                          name={`${name}:hide`}
                          onChange={() =>
                            handleSaveUpdateFieldPermission(
                              name,
                              "hide",
                              setFieldValue
                            )
                          }
                          value={
                            values[`${name}:hide`]
                              ? String(values[`${name}:hide`])
                              : "false"
                          }
                          disabled={
                            values[`${name}:hide`] === true ? true : dataSaving
                          }
                        />
                      );
                    },
                  },
                ]}
                listSelector={false}
                oldGenericListUI={true}
              />
            </>
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => setEditFieldPermission({ visible: false, data: null })}
      />
    </>
  );
};
