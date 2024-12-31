import React from "react";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../graphql/mutations/saveMutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { getSettingsPathParts } from "../../../crm/shared/utils/getSettingsPathParts";
import { snakeCase } from "change-case";
import { SupportedApps } from "../../../../../models/shared";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { IRolePermission } from "../../../../../models/Accounts";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { useTranslation } from "next-i18next";
import { ConnectedPermissionList } from "./ConnectedPermissionList";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import router from "next/router";

const emailPermissions = [
  "create-email_template",
  "update-email_template",
  "view-email_template",
  "delete-email_template",
];

export interface IModulePermissions {
  module: string;
  permissions: IRolePermission[];
  isVisible: boolean;
}

export interface IPermissionList {
  module: string;
  permissions: {
    key: string;
    label: string;
    value: string;
  }[];
}

const permissionFetchVariablesGenerator = (
  pageNumber: number,
  currentRoleKey: string,
  recordStatusType: "a" | "d",
  additionalFilterValue: Record<string, any>[] = []
) => {
  return {
    modelName: "RolePermission",
    pageNumber: pageNumber,
    fields: [
      "id",
      "modelName",
      "roleKey",
      "permissionKey",
      "createdBy",
      "createdAt",
      "recordStatus",
      "uniqueName",
    ],
    filters: [
      { name: "roleKey", operator: "eq", value: [currentRoleKey] },
      { name: "recordStatus", operator: "in", value: [recordStatusType] },
      ...additionalFilterValue,
    ],
  };
};

export const Permissions = ({ currentRoleKey }: { currentRoleKey: string }) => {
  const { t } = useTranslation();
  const { menuItem, additionalParts } = getSettingsPathParts();

  const [moduleList, setModuleList] = React.useState<IModuleMetadata[]>([]); //moduleList containing root data
  const [modulePermissions, setModulePermissions] = React.useState<
    IModulePermissions[] | null
  >(null); //master permission dict
  const [userRolesPermissions, setRolePermissionList] = React.useState<
    IRolePermission[]
  >([]); //used in setting modulePermissions
  const [permissionList, setPermissionList] = React.useState<IPermissionList[]>(
    []
  ); //dict containing module with permissions
  const [fetchedAllPermission, setFetchAllPermission] = React.useState(0);

  const handleToast = (response: any) => {
    if (response?.data?.save.messageKey.includes("success")) {
      return Toast.success(response.data.save.message);
    } else if (response?.data?.save.messageKey) {
      return Toast.error(response.data.save.messageKey);
    } else return Toast.error(t("common:unknown-message"));
  };

  const [crmModules, setCrmModules] = React.useState<IModuleMetadata[]>([]);
  const [notifyModules, setNotifyModules] = React.useState<IModuleMetadata[]>(
    []
  );

  const [crmModuleFetchRequest] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.crm,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data)
        setCrmModules(
          responseOnCompletion.fetch.data?.filter(
            (module: IModuleMetadata) =>
              module.name !== "quotedItem" &&
              module.name !== "orderedItem" &&
              module.name !== "invoicedItem" &&
              module.name !== "purchaseItem" &&
              module.name !== "quotedItemConversionOrderedItemMapping" &&
              module.name !== "orderedItemConversionInvoicedItemMapping" &&
              module.name !== "quotedItemConversionInvoicedItemMapping"
          )
        );
    },
  });

  const [notifyModuleFetchRequest] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.notify,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data)
        setNotifyModules(
          responseOnCompletion.fetch.data.filter(
            (module: IModuleMetadata) => module.name === "emailTemplate"
          )
        );
    },
  });

  React.useEffect(() => {
    setModuleList([...crmModules, ...notifyModules]);
  }, [crmModules, notifyModules]);

  const [fetchNotifyActivePermissions] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.notify,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setRolePermissionList([
          ...userRolesPermissions,
          ...responseOnCompletion.fetch.data,
        ]);
      }
    },
  });

  const [fetchNotifyDeletedPermissions] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: SupportedApps.notify,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setRolePermissionList([
          ...userRolesPermissions,
          ...responseOnCompletion.fetch.data,
        ]);
      }
    },
  });

  React.useEffect(() => {
    fetchNotifyActivePermissions({
      variables: permissionFetchVariablesGenerator(1, currentRoleKey, "a", [
        {
          name: "permissionKey",
          operator: "in",
          value: emailPermissions,
        },
      ]),
    });

    fetchNotifyDeletedPermissions({
      variables: permissionFetchVariablesGenerator(1, currentRoleKey, "d", [
        {
          name: "permissionKey",
          operator: "in",
          value: emailPermissions,
        },
      ]),
    });
  }, []);

  //----------Fetching Permissions - start----------
  let [pageNoActive, setPageNoActive] = React.useState(1);
  let [pageNoDeleted, setPageNoDeleted] = React.useState(1);

  //Fetch for active permissions - start
  const [fetchActivePermissions] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath:
          additionalParts?.length >= 1 ? additionalParts[1] : SupportedApps.crm,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setRolePermissionList([
          ...userRolesPermissions,
          ...responseOnCompletion.fetch.data,
        ]);
        setPageNoActive(++pageNoActive);
        recursionFetchActiveCall(pageNoActive);
        return;
      }
      setFetchAllPermission(fetchedAllPermission + 1);
    },
  });

  const recursionFetchActiveCall = (pageNoActive: number) => {
    fetchActivePermissions({
      variables: permissionFetchVariablesGenerator(
        pageNoActive,
        currentRoleKey,
        "a"
      ),
    });
  };
  //Fetch for active permissions - end

  //Fetch for deleted permissions - start
  const [fetchDeletedPermissions] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath:
          additionalParts?.length >= 1 ? additionalParts[1] : SupportedApps.crm,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setRolePermissionList([
          ...userRolesPermissions,
          ...responseOnCompletion.fetch.data,
        ]);
        setPageNoDeleted(++pageNoDeleted);
        recursionFetchDeletedCall(pageNoDeleted);
        return;
      }
      setFetchAllPermission(fetchedAllPermission + 1);
    },
  });

  const recursionFetchDeletedCall = (pageNoDeleted: number) => {
    fetchDeletedPermissions({
      variables: permissionFetchVariablesGenerator(
        pageNoDeleted,
        currentRoleKey,
        "d"
      ),
    });
  };
  //Fetch for deleted permissions - end

  //----------Fetching Permissions - end----------

  const [updateCRMPermission] = useMutation<
    SaveData<IRolePermission>,
    SaveVars<IRolePermission>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  const [updateNotifyPermission] = useMutation<
    SaveData<IRolePermission>,
    SaveVars<IRolePermission>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
  });

  const [toggleLoader, setToggleLoader] = React.useState(false);

  const handleToggle = (action: boolean, record: IModuleMetadata) => {
    setToggleLoader(true);
    const actionList = !modulePermissions?.length
      ? []
      : modulePermissions?.filter(
          (val: { module: string }) => val.module === record.name
        );
    let hasViewPermission = false;
    if (actionList.length)
      for (const permission of actionList[0].permissions) {
        if (permission.permissionKey?.includes("view")) {
          hasViewPermission = true;
          break;
        }
      }
    try {
      let resolvedItems: any[] = [];
      if (!hasViewPermission) {
        if (record.uniqueName.split(".")[1] === "email_template") {
          resolvedItems.push(
            updateNotifyPermission({
              variables: {
                id: null,
                modelName: "RolePermission",
                saveInput: {
                  roleKey: currentRoleKey,
                  permissionKey: `view-${record.uniqueName.split(".")[1]}`,
                  recordStatus: "a",
                },
              },
            })
          );
        } else {
          resolvedItems.push(
            updateCRMPermission({
              variables: {
                id: null,
                modelName: "RolePermission",
                saveInput: {
                  roleKey: currentRoleKey,
                  permissionKey: `view-${record.uniqueName.split(".")[1]}`,
                  recordStatus: "a",
                },
              },
            })
          );
        }
      } else {
        resolvedItems = actionList[0].permissions.map(
          (permission: { permissionKey: string; id: string }) => {
            if (action === false) {
              if (record.uniqueName.split(".")[1] === "email_template") {
                const promise = updateNotifyPermission({
                  variables: {
                    id: permission.id,
                    modelName: "RolePermission",
                    saveInput: {
                      recordStatus: "d",
                    },
                  },
                });
                return promise;
              } else {
                const promise = updateCRMPermission({
                  variables: {
                    id: permission.id,
                    modelName: "RolePermission",
                    saveInput: {
                      recordStatus: "d",
                    },
                  },
                });
                return promise;
              }
            } else {
              if (permission.permissionKey.split("-")[0] === "view") {
                if (record.uniqueName.split(".")[1] === "email_template") {
                  const promise = updateNotifyPermission({
                    variables: {
                      id: permission.id,
                      modelName: "RolePermission",
                      saveInput: {
                        recordStatus: "a",
                      },
                    },
                  });
                  return promise;
                } else {
                  const promise = updateCRMPermission({
                    variables: {
                      id: permission.id,
                      modelName: "RolePermission",
                      saveInput: {
                        recordStatus: "a",
                      },
                    },
                  });
                  return promise;
                }
              }
            }
          }
        );
      }

      Promise.all(resolvedItems).then((fulfilledData) => {
        fulfilledData = fulfilledData.filter((resolvedData) => resolvedData);
        fulfilledData.filter((resolvedData) =>
          resolvedData?.data?.save.messageKey.includes("success")
        ).length === fulfilledData.length
          ? handleToast(fulfilledData[0])
          : Toast.error(t("common:unknown-message"));

        const modifiedModulePermissions: IModulePermissions[] | null =
          modulePermissions?.length
            ? modulePermissions.map((val) => {
                if (val.module === record.name) {
                  return {
                    module: val.module,
                    permissions: hasViewPermission
                      ? val.permissions.map(
                          (permission: { permissionKey: string }) => {
                            let result: any = null;
                            for (const data of fulfilledData) {
                              if (
                                data?.data?.save?.data?.permissionKey ===
                                permission.permissionKey
                              ) {
                                result = {
                                  ...permission,
                                  recordStatus:
                                    data.data.save.data.recordStatus,
                                };
                              }
                            }
                            if (result) {
                              return result;
                            } else {
                              return permission;
                            }
                          }
                        )
                      : [{ ...fulfilledData?.[0]?.data?.save.data }],
                    isVisible:
                      val.isVisible == false
                        ? fulfilledData?.[0]?.data?.save.data
                          ? true
                          : false
                        : !val.isVisible,
                  };
                } else {
                  return val;
                }
              })
            : null;
        setModulePermissions(modifiedModulePermissions);
        setToggleLoader(false);
      });
    } catch (error) {
      console.error(error);
      setToggleLoader(false);
    }
  };

  const handleChecked = (
    id: string | null,
    checked: boolean,
    modelName: string,
    action: string,
    permissionKey: string,
    record: IModuleMetadata
  ) => {
    if (action == "view") {
      handleToggle(false, record);
    } else {
      setToggleLoader(true);
      let resolvedItems: any[] = [];
      const requestObj: any = {
        "update-layout_field": {},
        "create-layout_field": {},
      };
      if (
        permissionKey === "update-layout_field" ||
        permissionKey == "create-layout_field"
      ) {
        modulePermissions
          ?.filter((val) => val.module === record.name)[0]
          .permissions.map((permission: { permissionKey: string }) => {
            if (requestObj[permission.permissionKey]) {
              requestObj[permission.permissionKey] = permission;
            }
          });
        for (const key in requestObj) {
          resolvedItems.push(
            updateCRMPermission({
              variables: {
                id: requestObj[key]?.id || "",
                modelName: "RolePermission",
                saveInput: {
                  roleKey: currentRoleKey,
                  permissionKey: key,
                  recordStatus: checked === true ? "d" : "a",
                },
              },
            })
          );
        }
      } else {
        if (emailPermissions.includes(permissionKey)) {
          resolvedItems.push(
            updateNotifyPermission({
              variables: {
                id: id || "",
                modelName: "RolePermission",
                saveInput: {
                  roleKey: currentRoleKey,
                  permissionKey: permissionKey,
                  recordStatus: checked === true ? "d" : "a",
                },
              },
            })
          );
        } else {
          resolvedItems.push(
            updateCRMPermission({
              variables: {
                id: id || "",
                modelName: "RolePermission",
                saveInput: {
                  roleKey: currentRoleKey,
                  permissionKey: permissionKey,
                  recordStatus: checked === true ? "d" : "a",
                },
              },
            })
          );
        }
      }

      Promise.all(resolvedItems).then((fulfilledData) => {
        fulfilledData = fulfilledData.filter((resolvedData) => resolvedData);
        fulfilledData.filter((resolvedData) =>
          resolvedData?.data?.save.messageKey.includes("success")
        ).length === fulfilledData.length
          ? handleToast(fulfilledData[0])
          : Toast.error(t("common:unknown-message"));

        const permissionArray: IRolePermission[] = [];
        let resultObj: Record<string, any> = {};
        let permissionObj: any = {};

        for (const response of fulfilledData) {
          resultObj[response.data.save.data.id] = response.data.save.data;
        }
        if (modulePermissions?.length)
          for (const val of modulePermissions) {
            if (val.module === modelName) {
              for (const permission of val.permissions) {
                permissionObj = {
                  ...permissionObj,
                  [permission.id]: permission,
                };
              }
              break;
            }
          }

        for (const permission in permissionObj) {
          if (permission in resultObj) {
            permissionObj[permission] = null;
          } else {
            permissionArray.push(permissionObj[permission]);
          }
        }

        for (const result in resultObj) {
          permissionArray.push(resultObj[result]);
        }

        const modifiedModulePermissions: IModulePermissions[] | null =
          modulePermissions?.length
            ? modulePermissions.map((val) => {
                if (val.module === record.name) {
                  return {
                    module: val.module,
                    permissions: permissionArray,
                    isVisible:
                      action === "view" && checked === true ? false : true,
                  };
                } else {
                  return val;
                }
              })
            : null;
        setModulePermissions(modifiedModulePermissions);
        setToggleLoader(false);
      });
    }
  };

  React.useEffect(() => {
    // Need to remove request caching and implement service level caching
    const handleModulesDataFetchPerService = async () => {
      try {
        await crmModuleFetchRequest({
          variables: {
            modelName: "Module",
            fields: [
              "id",
              "name",
              "label",
              "uniqueKey",
              "customizationAllowed",
            ],
            filters: [],
          },
        });
      } catch (error) {}
      try {
        await notifyModuleFetchRequest({
          variables: {
            modelName: "Module",
            fields: ["id", "name", "label", "uniqueKey"],
            filters: [],
          },
        });
      } catch (error) {}
    };
    handleModulesDataFetchPerService();
    if (!userRolesPermissions.length) {
      recursionFetchActiveCall(1);
      recursionFetchDeletedCall(1);
    }
  }, [additionalParts[1]]);

  React.useEffect(() => {
    if (moduleList.length) {
      const rolePermissionSet = moduleList.map((obj) => {
        const uniqueName = obj.uniqueName?.split(".")[1];
        const permissionList = [];
        for (const permission of obj.supportedPermissions) {
          const [action, name] = permission.split("-");
          if (name == snakeCase(uniqueName)) {
            permissionList.push({
              key: permission,
              label: `${action[0].toUpperCase()}${action.slice(1)}`,
              value: action,
            });
          }
        }
        return {
          module: obj.name,
          permissions: permissionList,
        };
      });
      setPermissionList(rolePermissionSet);
    }
  }, [moduleList]);

  React.useEffect(() => {
    if (
      moduleList.length &&
      userRolesPermissions.length &&
      fetchedAllPermission === 2
    ) {
      const rolePermissionSet = moduleList.map((obj) => {
        const uniqueName = obj.uniqueName.split(".")[1];
        let visible = false;
        for (const perObj of userRolesPermissions) {
          const [action, name] = perObj.permissionKey?.split("-");
          if (
            name == uniqueName &&
            action == "view" &&
            perObj.recordStatus !== "d"
          ) {
            visible = true;
          }
        }
        const permissionList = userRolesPermissions.filter((perObj) => {
          return perObj.permissionKey?.split("-")?.[1] === uniqueName;
        });
        return {
          module: obj.name,
          permissions: permissionList,
          isVisible: visible,
        };
      });
      setModulePermissions(rolePermissionSet);
      setPageNoActive(1);
      setPageNoDeleted(1);
    }
  }, [userRolesPermissions, moduleList, fetchedAllPermission]);

  const onServiceChange = (serviceName: string) => {
    if (additionalParts?.length >= 1 && additionalParts[1] == serviceName)
      return;
    // setPageNoActive(1);
    // setPageNoDeleted(1);
    setFetchAllPermission(0);
    setModuleList([]);
    setRolePermissionList([]);
    setModulePermissions(null);
    router.push(
      settingsUrlGenerator(SupportedApps.crm, menuItem, currentRoleKey, [
        "permissions",
        serviceName,
      ])
    );
  };

  return (
    <ConnectedPermissionList
      moduleList={moduleList}
      modulePermissions={modulePermissions}
      handleToggle={handleToggle}
      permissionList={permissionList}
      handleChecked={handleChecked}
      toggleLoader={toggleLoader}
      onServiceChange={onServiceChange}
      currentRoleKey={currentRoleKey}
      additionalParts={additionalParts}
      fetchedAllPermission={fetchedAllPermission}
    />
  );
};
