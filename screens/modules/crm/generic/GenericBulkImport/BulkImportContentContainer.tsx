import React from "react";
import { FormikValues } from "formik";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import router, { useRouter } from "next/router";
import { AddBulkImportScreen } from "./AddBulkImportScreen";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { InstanceStoreContext } from "../../../../../stores/InstanceStore";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { generateNavigableModule } from "../../shared/utils/generateNavigableModule";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { geCurrentViewPerModulePerInstancePerUser } from "../../shared/utils/getCurrentViewPerModulePerInstancePerUser";
import {
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import {
  bulkImportJobUploadHandler,
  bulkImportMappingUploadHandler,
} from "../../shared/utils/bulkImportHandler";
import {
  IBulkImportContentContainer,
  IBulkImportData,
  TypeMappingFilterMode,
  bulkImportFieldMappingDataMutation,
  fieldMappingDataExtractor,
} from "./bulkImportImportMappingHelpers";

export const BulkImportContentContainer = ({
  appName,
  modelName,
  ui,
  id,
  fieldsList,
  sampleListHeaders,
  moduleData,
  bulkImportStepOne,
  bulkImportStepTwo,
  bulkImportStepThree,
  setBulkImportStepOne,
  setBulkImportStepTwo,
  setBulkImportStepThree,
  bulkImportMappingData,
  bulkImportFieldMappingData,
  setBulkImportMappingData,
  bulkImportMappingProcessing,
  setBulkImportMappingProcessing,
  bulkImportCriteriaValues,
  setBulkImportCriteriaValues,
  triggerAutomation,
  onTriggerAutomation,
  fileName,
  importedFiles,
  userPreferences,
  navigations,
  setImportedFiles,
}: IBulkImportContentContainer) => {
  const { route } = useRouter();
  const cookieUser = cookieUserStore.getUserDetails();
  const { instances } = React.useContext(InstanceStoreContext);
  const subDomain = window.location.hostname.split(".")[0];
  const findInstanceIndex = instances?.findIndex(
    (instance) => instance?.subdomain === subDomain
  );
  const [useDefaultMapping, setUseDefaultMapping] = React.useState(true);

  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [bulkImportFieldMappingSaving, setBulkImportFieldMappingSaving] =
    React.useState(false);
  const [mappingInitialData, setMappingInitialData] = React.useState({});

  const [initMappingData, setInitMappingData] = React.useState<
    IBulkImportData[] | null
  >(null);
  const [originalFieldMappingData, setOriginalFieldMappingData] =
    React.useState<IBulkImportData[] | null>(null);
  const [fieldMappingData, setFieldMappingData] = React.useState<
    IBulkImportData[] | null
  >(null);

  const gotoStepTwo = () => {
    setBulkImportStepOne(false);
    setBulkImportStepTwo(true);
  };

  const exitImportMapping = () => {
    let shortPathName = "";
    "bulk-import".split("-").forEach((name) => {
      shortPathName = shortPathName + name[0];
    });
    if (route.split("/")?.[1] === "app" && moduleData) {
      if (findInstanceIndex === -1 || !cookieUser?.id || !modelName) {
        router.push(
          `/app/${appName ? appName : SupportedApps.crm}/${
            moduleData.name
          }/view/${SupportedDashboardViews.Card.toLocaleLowerCase()}`
        );
      } else {
        let updatedcurrentDashboardView =
          geCurrentViewPerModulePerInstancePerUser(
            cookieUser.id,
            instances[findInstanceIndex].id
          );
        let currentView =
          updatedcurrentDashboardView[cookieUser?.id as string][
            instances[findInstanceIndex].id as string
          ][modelName];
        router.push(
          `/app/${appName ? appName : SupportedApps.crm}/${
            moduleData.name
          }/view/${
            currentView
              ? currentView.toLocaleLowerCase()
              : SupportedDashboardViews.Card.toLocaleLowerCase()
          }`
        );
      }
    } else {
      router.push(
        `/bulk-import/${appName ? appName : SupportedApps.crm}/${
          moduleData
            ? `${shortPathName}-${moduleData.name}`
            : navigations.length > 0 &&
              generateNavigableModule({
                navigations,
                groupKey: "default-navigation",
                pathName: "bulk-import",
              })
        }/jobs`
      );
    }
  };

  // -------------------------------- BI Job Save - start--------------------------------
  const handleBulkImportCreation = async (values: FormikValues) => {
    setSavingProcess(true);
    const fileId = await bulkImportJobUploadHandler(values.fileId[0]);
    if (!fileId) {
      toast.error("Unable to upload file");
      setSavingProcess(false);
      return;
    }
    handleBulkImportJobSave(fileId, values.fileId[0]?.name);
  };

  const [bulkImportJobMutation] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const handleBulkImportJobSave = async (fileId: string, fileName: string) => {
    try {
      await bulkImportJobMutation({
        variables: {
          id: null,
          modelName: "BulkImportJob",
          saveInput: {
            fileKey: fileId,
            fileName: fileName,
            moduleName: modelName,
            mappingId:
              ui === "biimport"
                ? id
                : bulkImportMappingData?.id
                ? bulkImportMappingData.id
                : null,
          },
        },
      }).then((response) => {
        if (
          response.data?.save?.data &&
          response.data?.save?.messageKey.includes("-success")
        ) {
          // toast.success(`${t("File uploaded successfully")}`);
          toast.success(
            `Bulk Import Job ${
              response.data?.save?.message.includes("create")
                ? "Created"
                : "Updated"
            } Successfully`
          );
          exitImportMapping();
        } else {
          toast.error(response.data?.save?.message);
          setSavingProcess(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------------- BI Job Save - end --------------------------------

  const [bulkImportMappingMutation] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [bulkImportFieldMappingMutation] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const handleBulkImportCriteria = async (values: FormikValues) => {
    setBulkImportMappingProcessing(true);
    const fileKey = await bulkImportMappingUploadHandler(values?.fileData[0]);
    if (!fileKey) {
      toast.error("Unable to upload file");
      setBulkImportMappingProcessing(false);
      return;
    }
    bulkImportMappingMutation({
      variables: {
        id: null,
        modelName: "BulkImportMapping",
        saveInput: {
          name: values.name,
          fileKey: fileKey,
          fileName: values.fileData[0]?.name,
          moduleUniqueName: moduleData?.uniqueName,
          mode: values["mappingMode"],
          updateOn:
            values["mappingMode"] === "create" ? null : values["updateOn"],
          skipOn: values["skipOn"],
          triggerAutomation: triggerAutomation,
          updateEmptyValues: values.updateEmptyValues,
        },
      },
    }).then((response) => {
      if (
        response.data?.save?.messageKey.includes("success") &&
        response.data?.save?.data
      ) {
        const responseData = response.data?.save?.data;
        setBulkImportMappingData({
          id: responseData.id,
          fileName: responseData.fileName,
          headers: responseData.headers,
          fileKey: responseData.fileKey,
          name: responseData.name,
          mappingMode: responseData.mode,
          updateOn: responseData.updateOn,
          skipOn: responseData.skipOn,
          rowData: responseData.head,
          updateEmptyValues: responseData.updateEmptyValues,
        });
        setBulkImportCriteriaValues({
          ...bulkImportCriteriaValues,
          name: responseData.name,
          triggerAutomation: responseData.triggerAutomation,
          updateEmptyValues: responseData.updateEmptyValues,
        });
        onTriggerAutomation(responseData.triggerAutomation);
        toast.success(
          `Bulk Import Mapping ${
            response.data?.save?.message.includes("create")
              ? "Created"
              : "Updated"
          } Successfully`
        );
      } else {
        toast.error(response.data?.save?.message);
        setBulkImportMappingProcessing(false);
      }
    });
  };

  const handleBICriteriaUpdate = (
    fieldName: string,
    value: null | string | boolean
  ) => {
    setBulkImportCriteriaValues({
      ...bulkImportCriteriaValues,
      [fieldName]: value,
    });
  };

  const initiateBulkImportJobSave = async () => {
    if (bulkImportMappingData && (ui == "mapping" || ui == "bulkimport")) {
      if (!importedFiles) {
        toast.error("File not found");
        return;
      }
      const fileId = await bulkImportJobUploadHandler(importedFiles[0]);
      if (!fileId) {
        toast.error("Unable to upload file");
        setBulkImportFieldMappingSaving(false);
        return;
      }
      handleBulkImportJobSave(fileId, bulkImportMappingData?.fileName);
    }
    if (ui === "biedit") {
      exitImportMapping();
    }
  };

  const handleBulkImportFieldMapping = async (values: FormikValues) => {
    setBulkImportFieldMappingSaving(true);
    let processedMapping = false;
    let gotError = false;
    if (bulkImportMappingData) {
      if (
        bulkImportMappingData.mappingMode !==
          bulkImportCriteriaValues.mappingMode ||
        bulkImportMappingData.updateOn !== bulkImportCriteriaValues.updateOn ||
        bulkImportMappingData.skipOn !== bulkImportCriteriaValues.skipOn ||
        triggerAutomation !== bulkImportCriteriaValues.triggerAutomation ||
        bulkImportMappingData.updateEmptyValues !==
          bulkImportCriteriaValues.updateEmptyValues
      ) {
        await bulkImportMappingMutation({
          variables: {
            id: bulkImportMappingData.id,
            modelName: "BulkImportMapping",
            saveInput: {
              mode: bulkImportCriteriaValues.mappingMode,
              updateOn:
                bulkImportCriteriaValues.mappingMode === "create"
                  ? null
                  : bulkImportCriteriaValues.updateOn,
              skipOn: bulkImportCriteriaValues.skipOn,
              triggerAutomation: triggerAutomation,
              updateEmptyValues: bulkImportCriteriaValues.updateEmptyValues,
            },
          },
        }).then((response) => {
          if (
            response.data?.save?.messageKey.includes("success") &&
            response.data?.save?.data
          ) {
            toast.success(
              `Bulk Import Mapping ${
                response.data?.save?.message.includes("create")
                  ? "Created"
                  : "Updated"
              } Successfully`
            );
            processedMapping = true;
          } else {
            toast.error(response.data?.save?.message);
            gotError = true;
          }
        });
      }
    }
    if (gotError) {
      setBulkImportFieldMappingSaving(false);
      return;
    }
    const requestArray = bulkImportFieldMappingDataMutation(
      fieldMappingData,
      values,
      initMappingData
    );

    if (requestArray.length === 0 && processedMapping) {
      await initiateBulkImportJobSave();
      return;
    }
    let makeSaveRequest = false;
    let nullPermissionError = "";

    await (async function () {
      if (bulkImportFieldMappingData) {
        const requestVariables = [];
        for (let i = 0; i < requestArray.length; i++) {
          const requestData = requestArray[i];
          for (let j = 0; j < bulkImportFieldMappingData.length; j++) {
            const fieldData = bulkImportFieldMappingData[j];
            if (
              requestData.fieldInFile === fieldData.sourceFieldLabel &&
              fieldData.destinationFieldUniqueName
            ) {
              requestVariables.push({
                id: requestData.id,
                modelName: "BulkImportFieldMapping",
                saveInput: {
                  mappingId: bulkImportMappingData?.id,
                  sourceFieldLabel: requestData.fieldInFile,
                  destinationFieldUniqueName: null,
                  options: {
                    ...requestData.options,
                    defaultValue: requestData.replaceValue,
                  },
                },
              });
              break;
            }
          }
        }
        if (requestVariables.length === 0) {
          makeSaveRequest = true;
        } else {
          const promiseNullArray = requestVariables.map(async (variables) => {
            const responseData = await bulkImportFieldMappingMutation({
              variables: variables,
            });
            return responseData;
          });
          await Promise.all(promiseNullArray).then((response) => {
            let successCount = 0;
            response.forEach((result) => {
              if (result?.data?.save?.messageKey.includes("-success"))
                ++successCount;
              if (result?.data?.save?.messageKey.includes("-permission"))
                nullPermissionError = result?.data?.save?.message;
            });
            if (successCount === requestVariables.length) {
              makeSaveRequest = true;
            } else if (nullPermissionError.length) {
              toast.error(nullPermissionError);
              setBulkImportFieldMappingSaving(false);
            } else {
              toast.error("Error Saving Bulk Import Field Mapping");
              setBulkImportFieldMappingSaving(false);
              router.reload();
            }
          });
        }
      } else {
        makeSaveRequest = true;
      }
    })();

    if (!nullPermissionError.length && makeSaveRequest) {
      const promiseArray = requestArray.map(async (requestData) => {
        const responseData = await bulkImportFieldMappingMutation({
          variables: {
            id: requestData.id,
            modelName: "BulkImportFieldMapping",
            saveInput: {
              mappingId: bulkImportMappingData?.id,
              sourceFieldLabel: requestData.fieldInFile,
              destinationFieldUniqueName: requestData.fieldInCrm,
              options: {
                ...requestData.options,
                defaultValue: requestData.replaceValue,
              },
            },
          },
        });
        return responseData;
      });
      Promise.all(promiseArray).then(async (response) => {
        let successCount = 0;
        let permissionError = "";
        response.forEach((result) => {
          if (result?.data?.save?.messageKey.includes("-success"))
            ++successCount;
          if (result?.data?.save?.messageKey.includes("-permission"))
            permissionError = result?.data?.save?.message;
        });
        if (successCount === requestArray.length) {
          toast.success("Bulk Import Field Mapping Saved Successfully");
          await initiateBulkImportJobSave();
        } else if (permissionError.length) {
          toast.error(permissionError);
          setBulkImportFieldMappingSaving(false);
        } else {
          toast.error("Error Saving Bulk Import Field Mapping");
          setBulkImportFieldMappingSaving(false);
        }
      });
    }
  };

  const [mappingCount, setMappingCount] = React.useState({
    mapped: 0,
    unmapped: 0,
  });
  const [mappingFilterMode, setMappingFilterMode] =
    React.useState<TypeMappingFilterMode>("all");

  React.useEffect(() => {
    if (bulkImportMappingData && bulkImportFieldMappingData) {
      const mutatedData = fieldMappingDataExtractor(
        bulkImportMappingData,
        bulkImportFieldMappingData
      );
      let initialData = {},
        mappedCount = 0,
        unmappedCount = 0;
      mutatedData.forEach((data, index) => {
        initialData = {
          ...initialData,
          [`fieldInFile:${index}`]: data.fieldInFile,
          [`fieldInCrm:${index}`]: data.fieldInCrm,
          [`replaceValue:${index}`]: data.replaceValue,
          [`merge:${index}`]: data.merge,
        };
        if (data.fieldInCrm) {
          ++mappedCount;
        } else {
          ++unmappedCount;
        }
      });
      setMappingCount({ mapped: mappedCount, unmapped: unmappedCount });
      setMappingInitialData(initialData);
      if (!initMappingData) {
        setInitMappingData(mutatedData);
      }
      if (!originalFieldMappingData) {
        setOriginalFieldMappingData(mutatedData);
      }
      setFieldMappingData(mutatedData);
    }
  }, [bulkImportMappingData, bulkImportFieldMappingData]);

  const updateMappingData = (
    originalData: IBulkImportData[],
    mappingFilterMode: TypeMappingFilterMode
  ) => {
    if (mappingFilterMode === "all") {
      setFieldMappingData(originalData || []);
    } else if (mappingFilterMode === "mapped") {
      setFieldMappingData(
        originalData?.filter((data) => data.fieldInCrm) || []
      );
    } else if (mappingFilterMode === "unmapped") {
      const updatedOriginalData = [...originalData];
      const dataArray: IBulkImportData[] = [];
      for (let i = 0; i < updatedOriginalData.length; i++) {
        if (!updatedOriginalData[i].fieldInCrm) {
          dataArray.push(updatedOriginalData[i]);
        }
      }
      setFieldMappingData(dataArray);
    }
  };

  const handleChangeFilter = (type: TypeMappingFilterMode) => {
    setMappingFilterMode(type);
    originalFieldMappingData &&
      updateMappingData(originalFieldMappingData, type);
  };

  const updateFieldsWithImportData = (record: IBulkImportData) => {
    let originalData: IBulkImportData[] = [];

    if (originalFieldMappingData)
      for (let i = 0; i < originalFieldMappingData.length; i++) {
        const data = originalFieldMappingData[i];
        if (data.fieldInFile === record.fieldInFile) {
          originalData[i] = {
            ...record,
            id: data.id,
            rowDataOne: data.rowDataOne,
            rowDataTwo: data.rowDataTwo,
          };
        } else {
          originalData[i] = data;
        }
      }
    setFieldMappingData(originalData);
    setOriginalFieldMappingData(originalData);
  };

  const resetValues = () => {
    handleChangeFilter("all");
    setOriginalFieldMappingData(initMappingData);
    setFieldMappingData(initMappingData ? [...initMappingData] : null);
  };

  return (
    <AddBulkImportScreen
      modelName={modelName}
      ui={ui}
      fieldsList={fieldsList}
      sampleListHeaders={sampleListHeaders}
      savingProcess={savingProcess}
      bulkImportStepOne={bulkImportStepOne}
      bulkImportStepTwo={bulkImportStepTwo}
      bulkImportStepThree={bulkImportStepThree}
      bulkImportCriteriaValues={bulkImportCriteriaValues}
      fieldMappingData={fieldMappingData}
      setBulkImportStepOne={setBulkImportStepOne}
      setBulkImportStepTwo={setBulkImportStepTwo}
      setBulkImportStepThree={setBulkImportStepThree}
      gotoStepTwo={gotoStepTwo}
      handleBulkImportCreation={handleBulkImportCreation}
      handleBulkImportCriteria={handleBulkImportCriteria}
      handleBulkImportFieldMapping={handleBulkImportFieldMapping}
      useDefaultMapping={useDefaultMapping}
      handleUseDefaultMapping={(value) => setUseDefaultMapping(value)}
      bulkImportMappingData={bulkImportMappingData}
      mappingInitialData={mappingInitialData}
      bulkImportMappingProcessing={bulkImportMappingProcessing}
      bulkImportFieldMappingSaving={bulkImportFieldMappingSaving}
      importedFiles={importedFiles}
      setImportedFiles={setImportedFiles}
      handleBICriteriaUpdate={handleBICriteriaUpdate}
      triggerAutomation={triggerAutomation}
      onTriggerAutomation={onTriggerAutomation}
      mappingCount={mappingCount}
      handleChangeFilter={handleChangeFilter}
      updateFieldsWithImportData={updateFieldsWithImportData}
      mappingFilterMode={mappingFilterMode}
      resetValues={resetValues}
      fileName={fileName}
      userPreferences={userPreferences}
    />
  );
};
