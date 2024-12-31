import React, { useContext } from "react";
import { get } from "lodash";
import { useState } from "react";
import { camelCase } from "change-case";
import { LayoutFields } from "./LayoutFields";
import { useTranslation } from "next-i18next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ILayout } from "../../../../../../models/ILayout";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import { getSortedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { getSettingsPathParts } from "../../../../crm/shared/utils/getSettingsPathParts";
import {
  SaveData,
  SaveVars,
  SAVE_MUTATION,
} from "../../../../../../graphql/mutations/saveMutation";
import { IRole, SupportedApps } from "../../../../../../models/shared";
import { FIELD_PERMISSION_DATA_QUERY } from "../../../../../../graphql/queries/fieldPermissionQueries";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  generateModuleContext,
  generateModuleVariables,
} from "./HelperFunctions/moduleQueryGenerators";

interface ConnectedFieldsProps {
  moduleId: string;
}

export const ConnectedLayoutFields = observer(
  ({ moduleId }: ConnectedFieldsProps) => {
    const { appName } = getAppPathParts();
    const { t } = useTranslation(["common"]);
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allModulesFetched,
      allLayoutFetched,
      importModuleLayouts,
      importModuleInfo,
      importFields,
    } = generalModelStore;
    const [layoutFetchLoading, setLayoutFetchLoading] = useState(true);
    const [currentLayout, setCurrentLayout] = useState<ILayout | null>(null);
    const [fieldList, setFieldList] = useState<ICustomField[]>([]);
    const [savingProcess, setSavingProcess] = useState(false);
    const { additionalParts } = getSettingsPathParts();
    const moduleName = camelCase(additionalParts[1]);
    const [currentModule, setCurrentModule] = useState<IModuleMetadata | null>(
      null
    );
    const [tableDataProcessing, setTableDataProcessing] =
      React.useState<boolean>(false);
    const [itemsCount, setItemsCount] = React.useState<number>(0);
    const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    const [filterValue, setFilterValue] = React.useState<string>("");
    const moduleLabel = currentModule ? currentModule.label.en : "";
    const [viewPermission, setViewPermission] = React.useState(true);
    const [addEditField, setAddEditField] = useState<{
      visible: boolean;
      uniqueName: string | null;
    }>({
      visible: false,
      uniqueName: null,
    });
    const [userRoles, setRoleList] = React.useState<IRole[]>([]);
    const [fieldPermissionData, setFieldPermissionData] = React.useState<
      Record<string, Record<string, boolean>>
    >({});
    const [savedFieldPermissionData, setSavedFieldPermissionData] =
      React.useState<Record<string, string>>({});

    const [userRoleLoader, setUserRoleLoader] = React.useState(true);
    const [fieldPermissionLoader, setFieldPermissionLoader] =
      React.useState(true);

    const [getModule] = useLazyQuery<FetchData<IModuleMetadata>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
      }
    );

    const [getEditModeValues] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const [saveLayout] = useAppSaveMutation<ILayout>({
      appPath: appName,
    });

    const [getUsersListData] = useLazyQuery(FETCH_QUERY, {
      nextFetchPolicy: "standby",
      fetchPolicy: "cache-first",
      context: {
        headers: {
          vrynopath: "accounts",
        },
      },
    });

    const [getFieldPermissionData] = useLazyQuery(FIELD_PERMISSION_DATA_QUERY, {
      nextFetchPolicy: "no-cache",
      fetchPolicy: "cache-first",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    });

    const [updateField] = useMutation<
      SaveData<ICustomField>,
      SaveVars<ICustomField>
    >(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onError: (response) => {
        setTableDataProcessing(false);
      },
    });

    const handleNewFieldAddedCompletion = async (
      responseOnCompletion: SaveData<ICustomField>,
      refetchModuleDetails?: {
        modelName: string;
        serviceName: string;
      },
      updatedLayout?: ILayout
    ) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        if (
          refetchModuleDetails?.modelName &&
          refetchModuleDetails?.serviceName
        ) {
          await getModule({
            context: generateModuleContext(refetchModuleDetails?.serviceName),
            variables: generateModuleVariables([
              {
                name: "name",
                operator: "eq",
                value: [refetchModuleDetails?.modelName],
              },
            ]),
          }).then((response) => {
            if (response?.data?.fetch?.data?.length) {
              importModuleInfo(
                response?.data?.fetch?.data[0],
                refetchModuleDetails?.modelName
              );
            }
          });
        }
        if (currentLayout) {
          let updatedCurrentLayout = updatedLayout
            ? { ...updatedLayout }
            : { ...currentLayout };
          const updatedFieldIndex =
            updatedCurrentLayout.config.fields.findIndex(
              (field: ICustomField) =>
                field.uniqueName === responseOnCompletion.save.data.uniqueName
            );
          updatedCurrentLayout.config.fields[updatedFieldIndex] =
            responseOnCompletion.save.data;
          setCurrentLayout(updatedCurrentLayout);
          setFieldList(getSortedFieldList(updatedCurrentLayout.config.fields));
          importFields(
            getSortedFieldList(updatedCurrentLayout.config.fields),
            moduleName
          );
          setItemsCount(
            updatedCurrentLayout.config.fields
              .filter((field) => field.addInForm)
              .filter((field) => field.recordStatus !== "d")?.length
          );
        }
        Toast.success("Field updated successfully");
        setAddEditField({ uniqueName: null, visible: false });
      } else if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      } else {
        Toast.error(t("common:unknown-message"));
      }
      setTableDataProcessing(false);
      setSavingProcess(false);
    };

    const handleNewFieldAdd = async (
      value: {
        message: string;
        resetForm: { visible: boolean; uniqueName: string | null };
        setSavingProcess: boolean;
      },
      refetchModuleDetails: {
        modelName: string;
        serviceName: string;
      }
    ) => {
      await getEditModeValues({
        variables: {
          modelName: "Layout",
          fields: ["id", "name", "moduleName", "layout", "config", "type"],
          filters: [
            { name: "moduleName", operator: "eq", value: [moduleName] },
          ],
        },
      }).then(async (responseOnCompletion) => {
        if (responseOnCompletion?.data?.fetch.data) {
          if (
            refetchModuleDetails?.modelName &&
            refetchModuleDetails?.serviceName
          ) {
            await getModule({
              context: generateModuleContext(refetchModuleDetails?.serviceName),
              variables: generateModuleVariables([
                {
                  name: "name",
                  operator: "eq",
                  value: [refetchModuleDetails?.modelName],
                },
              ]),
            }).then((response) => {
              if (response?.data?.fetch?.data?.length) {
                importModuleInfo(
                  response?.data?.fetch?.data[0],
                  refetchModuleDetails?.modelName
                );
              }
            });
          }
          importModuleLayouts(
            responseOnCompletion?.data?.fetch.data,
            moduleName
          );
          importFields(
            getSortedFieldList(
              responseOnCompletion?.data?.fetch.data[0].config.fields
            ),
            moduleName
          );
          setCurrentLayout(responseOnCompletion?.data?.fetch.data[0]);
          setFieldList(
            getSortedFieldList(
              responseOnCompletion?.data?.fetch.data[0].config.fields
            )
          );
          setItemsCount(
            getSortedFieldList(
              responseOnCompletion?.data?.fetch.data[0].config.fields
            )
              ?.filter((field) => field.addInForm)
              .filter((field) => field.recordStatus !== "d")?.length
          );
          setViewPermission(true);
          setSavingProcess(value.setSavingProcess);
          setAddEditField(value.resetForm);
          Toast.success(value.message);
        } else if (
          responseOnCompletion?.data?.fetch.messageKey.includes("requires-view")
        ) {
          Toast.error(responseOnCompletion?.data?.fetch.message);
          setViewPermission(false);
        }
        setLayoutFetchLoading(false);
      });
    };

    const handleCustomFieldOrderUpdate = async (
      itemOne: ICustomField,
      itemTwo: ICustomField
    ) => {
      if (!currentLayout) {
        return;
      }
      const getSaveInput = (item: ICustomField) => {
        return {
          uniqueName: item.uniqueName,
          moduleUniqueName: item.moduleUniqueName,
          label: item.label,
          validations: item.validations,
          dataType: item.dataType,
          dataTypeMetadata: item.dataTypeMetadata,
          visible: item.visible,
          mandatory: item.mandatory,
          checkDuplicacy: item.checkDuplicacy,
          showInQuickCreate: item.showInQuickCreate,
          order: item.order,
          // readOnly: item.readOnly,
        };
      };
      if (currentLayout?.id) {
        try {
          setTableDataProcessing(true);
          await updateField({
            variables: {
              id: itemOne.id,
              modelName: "LayoutField",
              saveInput: {
                ...getSaveInput(itemOne),
                layoutId: currentLayout.id,
              },
            },
          }).then((responseOnCompletion) => {
            if (responseOnCompletion?.data) {
              handleNewFieldAddedCompletion(responseOnCompletion?.data);
            }
          });
          setTableDataProcessing(true);
          await updateField({
            variables: {
              id: itemTwo.id,
              modelName: "LayoutField",
              saveInput: {
                ...getSaveInput(itemTwo),
                layoutId: currentLayout.id,
              },
            },
          }).then((responseOnCompletion) => {
            if (responseOnCompletion?.data) {
              handleNewFieldAddedCompletion(responseOnCompletion?.data);
            }
          });
        } catch (error) {}
      } else {
        try {
          setTableDataProcessing(true);
          await saveLayout({
            variables: {
              id: currentLayout.id,
              modelName: "Layout",
              saveInput: {
                moduleName: currentLayout.moduleName,
                type: currentLayout.type,
                name: get(currentLayout, "name", "Custom"), // Todo : Need to add logic of adding name in layout
              },
            },
          }).then(async (response) => {
            setTableDataProcessing(false);
            if (response?.data?.save?.messageKey.includes("-success")) {
              setCurrentLayout(response.data.save.data);
              importModuleLayouts(
                [response.data.save.data],
                currentLayout.moduleName
              );
              try {
                setTableDataProcessing(true);
                await updateField({
                  variables: {
                    id: itemOne.id,
                    modelName: "LayoutField",
                    saveInput: {
                      ...getSaveInput(itemOne),
                      layoutId: response.data.save.data.id,
                    },
                  },
                }).then((responseOnCompletion) => {
                  if (responseOnCompletion?.data) {
                    handleNewFieldAddedCompletion(
                      responseOnCompletion?.data,
                      { modelName: "", serviceName: "" },
                      response?.data?.save.data
                    );
                  }
                });
                setTableDataProcessing(true);
                await updateField({
                  variables: {
                    id: itemTwo.id,
                    modelName: "LayoutField",
                    saveInput: {
                      ...getSaveInput(itemTwo),
                      layoutId: response.data.save.data.id,
                    },
                  },
                }).then((responseOnCompletion) => {
                  if (responseOnCompletion?.data) {
                    handleNewFieldAddedCompletion(
                      responseOnCompletion?.data,
                      { modelName: "", serviceName: "" },
                      response?.data?.save.data
                    );
                  }
                });
              } catch (error) {
                setTableDataProcessing(false);
              }
              setSavingProcess(false);
              setTableDataProcessing(false);
              setAddEditField({ visible: false, uniqueName: null });
              Toast.success(response.data.save.message);
              return;
            }
            setTableDataProcessing(false);
            setSavingProcess(false);
            if (response?.data?.save?.messageKey) {
              Toast.error(response.data.save.message);
              return;
            }
            Toast.error(t("common:unknown-message"));
          });
        } catch (error) {
          console.error(error);
          setTableDataProcessing(false);
        }
      }
    };

    async function mergeAndSaveLayout(
      values: any,
      refetchModuleDetails?: {
        modelName: string;
        serviceName: string;
      }
    ) {
      if (!currentLayout) {
        return;
      }
      const fieldIndex = fieldList?.findIndex(
        (field) => field.uniqueName === addEditField.uniqueName
      );
      const saveInput = {
        uniqueName: addEditField?.visible
          ? fieldList[fieldIndex].uniqueName
          : values.uniqueName,
        moduleUniqueName: addEditField?.visible
          ? fieldList[fieldIndex].moduleUniqueName
          : values.moduleUniqueName,
        label: values.label,
        validations: values.validations,
        dataTypeMetadata: values.dataTypeMetadata,
        dataType: values.dataType,
        visible: values.visible,
        mandatory: values.mandatory,
        checkDuplicacy: values.checkDuplicacy,
        order: values.order,
        showInQuickCreate: values.showInQuickCreate,
        isMasked: values.isMasked,
        maskedPattern: values.maskedPattern,
      };

      if (currentLayout?.id) {
        try {
          setTableDataProcessing(true);
          await updateField({
            variables: {
              id: addEditField?.visible ? fieldList[fieldIndex].id : values.id,
              modelName: "LayoutField",
              saveInput: {
                ...saveInput,
                layoutId: currentLayout.id,
              },
            },
          }).then((responseOnCompletion) => {
            if (responseOnCompletion?.data) {
              handleNewFieldAddedCompletion(
                responseOnCompletion?.data,
                refetchModuleDetails
              );
            }
          });
        } catch (error) {
          setTableDataProcessing(false);
        }
      } else {
        try {
          setTableDataProcessing(true);
          await saveLayout({
            variables: {
              id: currentLayout.id,
              modelName: "Layout",
              saveInput: {
                moduleName: currentLayout.moduleName,
                type: currentLayout.type,
                name: get(currentLayout, "name", "Custom"), // Todo : Need to add logic of adding name in layout
              },
            },
          }).then(async (response) => {
            setTableDataProcessing(false);
            if (response?.data?.save?.messageKey.includes("-success")) {
              setCurrentLayout(response.data.save.data);
              try {
                setTableDataProcessing(true);
                await updateField({
                  variables: {
                    id: addEditField?.visible
                      ? fieldList[fieldIndex].id
                      : values.id,
                    modelName: "LayoutField",
                    saveInput: {
                      ...saveInput,
                      layoutId: response.data.save.data.id,
                    },
                  },
                }).then((responseOnCompletion) => {
                  if (responseOnCompletion?.data) {
                    handleNewFieldAddedCompletion(
                      responseOnCompletion?.data,
                      refetchModuleDetails,
                      response?.data?.save.data
                    );
                  }
                });
              } catch (error) {
                setTableDataProcessing(false);
              }
              setTableDataProcessing(false);
              setSavingProcess(false);
              setAddEditField({ visible: false, uniqueName: null });
              Toast.success(response.data.save.message);
            } else if (response?.data?.save?.messageKey) {
              Toast.error(response.data.save.message);
            } else {
              Toast.error(t("common:unknown-message"));
            }
            setTableDataProcessing(false);
            setSavingProcess(false);
          });
        } catch (error) {
          console.error(error);
          setTableDataProcessing(false);
        }
      }
    }

    const fetchUserRolesInRecursion = async (
      pageNumber: number,
      userRolesList: IRole[]
    ) => {
      await getUsersListData({
        variables: {
          modelName: "Role",
          fields: ["role", "key", "createdBy", "createdAt", "updatedAt"],
          filters: [],
          pageNumber: pageNumber,
        },
      }).then(async (response) => {
        if (
          response?.data?.fetch?.messageKey.includes("-success") &&
          response?.data?.fetch?.data?.length
        ) {
          const responseData = response?.data?.fetch?.data;
          responseData?.forEach((data: any) => {
            userRolesList.push(data);
          });
          if (responseData?.length === 50) {
            await fetchUserRolesInRecursion(++pageNumber, userRolesList);
          }
        }
      });
      return { userRolesList };
    };

    const fetchFieldPermissionDataInRecursion = async (
      pageNumber: number,
      allFetchedData: Record<string, Record<string, boolean>>,
      idObject: Record<string, string>
    ) => {
      await getFieldPermissionData({
        variables: {
          filters: [
            { name: "moduleName", operator: "eq", value: [moduleName] },
          ],
          pageNumber: pageNumber,
        },
      }).then(async (response) => {
        if (
          response?.data?.fetchFieldPermission.messageKey.includes(
            "-success"
          ) &&
          response?.data?.fetchFieldPermission.data?.length
        ) {
          const responseData = response?.data?.fetchFieldPermission.data;
          responseData?.forEach((data: any) => {
            allFetchedData = {
              ...allFetchedData,
              [data.fieldName]: {
                ...allFetchedData[data.fieldName],
                [`${data.role}:${data.permission}`]: true,
              },
            };
            idObject = {
              ...idObject,
              [`${data.fieldName}:${data.role}`]: data.id,
            };
          });
          if (responseData?.length === 50) {
            await fetchFieldPermissionDataInRecursion(
              ++pageNumber,
              allFetchedData,
              idObject
            );
          }
        }
      });
      return { allFetchedData, idObject };
    };

    React.useEffect(() => {
      (async () => {
        const { allFetchedData, idObject } =
          await fetchFieldPermissionDataInRecursion(1, {}, {});
        setFieldPermissionData(allFetchedData);
        setSavedFieldPermissionData(idObject);
        setFieldPermissionLoader(false);
      })();
      (async () => {
        const { userRolesList } = await fetchUserRolesInRecursion(1, []);
        setRoleList(
          userRolesList.filter(
            (val: { key: string }) =>
              val.key !== "instance-owner" && val.key !== "instance-admin"
          )
        );
        setUserRoleLoader(false);
      })();
    }, []);

    React.useEffect(() => {
      if (allModulesFetched && allLayoutFetched) {
        setCurrentModule(genericModels[moduleName]?.moduleInfo);
        if (genericModels[moduleName]?.layouts?.length > 0) {
          setCurrentLayout(genericModels[moduleName]?.layouts[0]);
        }
        setFieldList(genericModels[moduleName]?.fieldsList ?? []);
        setItemsCount(
          genericModels[moduleName]?.fieldsList
            ?.filter((field) => field.addInForm)
            .filter((field) => field.recordStatus !== "d")?.length
        );
        setLayoutFetchLoading(false);
      }
    }, [allModulesFetched, allLayoutFetched]);

    const layoutFieldProps = {
      moduleLabel,
      currentLayout,
      layoutFetchLoading,
      fieldList,
      tableDataProcessing,
      addEditField,
      moduleName,
      viewPermission,
      user,
      setFieldList,
      setAddEditField,
      mergeAndSaveLayout,
      handleCustomFieldOrderUpdate,
      handleNewFieldAdd,
      userRoles,
      fieldPermissionData,
      setFieldPermissionData,
      savedFieldPermissionData,
      setSavedFieldPermissionData,
      userRoleLoader,
      fieldPermissionLoader,
      currentPageNumber,
      itemsCount,
      filterValue,
      genericModels,
      allModulesFetched,
      savingProcess,
      setSavingProcess,
      setFilterValue,
    };
    return <LayoutFields {...layoutFieldProps} />;
  }
);
