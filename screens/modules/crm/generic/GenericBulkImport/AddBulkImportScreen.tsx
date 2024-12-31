import React, { useContext } from "react";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { getNavigationLabel } from "../../shared/utils/getNavigationLabel";
import { BulkImportStepOne } from "./BulkImportSteps/BulkImportStepOne";
import { BulkImportStepTwo } from "./BulkImportSteps/BulkImportStepTwo";
import { BulkImportStepThree } from "./BulkImportSteps/BulkImportStepThree";
import { AddBulkImportScreenProps } from "./bulkImportImportMappingHelpers";

export const AddBulkImportScreen = ({
  modelName,
  ui,
  fieldsList,
  sampleListHeaders,
  savingProcess,
  bulkImportStepOne,
  bulkImportStepTwo,
  bulkImportStepThree,
  bulkImportCriteriaValues,
  fieldMappingData,
  setBulkImportStepOne,
  setBulkImportStepTwo,
  setBulkImportStepThree,
  handleBulkImportCreation,
  handleBulkImportCriteria,
  handleBulkImportFieldMapping,
  useDefaultMapping,
  handleUseDefaultMapping,
  gotoStepTwo,
  bulkImportMappingData,
  mappingInitialData,
  bulkImportMappingProcessing,
  bulkImportFieldMappingSaving,
  importedFiles,
  setImportedFiles,
  handleBICriteriaUpdate,
  triggerAutomation,
  onTriggerAutomation,
  mappingCount,
  handleChangeFilter,
  updateFieldsWithImportData,
  mappingFilterMode,
  resetValues,
  fileName,
  userPreferences,
}: AddBulkImportScreenProps) => {
  const { navigations } = useContext(NavigationStoreContext);
  const currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: modelName,
    currentModuleLabel: modelName,
    defaultLabel: modelName,
  });

  if (bulkImportStepOne) {
    return (
      <BulkImportStepOne
        ui={ui}
        currentModuleLabel={currentModuleLabel}
        sampleListHeaders={sampleListHeaders}
        savingProcess={savingProcess}
        importedFiles={importedFiles}
        fieldsList={fieldsList}
        setImportedFiles={(files) => setImportedFiles(files)}
        handleBulkImportCreation={(values) => handleBulkImportCreation(values)}
        useDefaultMapping={useDefaultMapping}
        handleUseDefaultMapping={handleUseDefaultMapping}
        gotoStepTwo={gotoStepTwo}
      />
    );
  } else if (bulkImportStepTwo) {
    return (
      <BulkImportStepTwo
        ui={ui}
        currentModuleLabel={currentModuleLabel}
        importedFiles={importedFiles}
        fieldsList={fieldsList.filter(
          (field) =>
            !["multiSelectRecordLookup", "multiSelectLookup"].includes(
              field.dataType
            )
        )}
        bulkImportCriteriaValues={bulkImportCriteriaValues}
        handleBulkImportCriteria={(values) => handleBulkImportCriteria(values)}
        setBulkImportStepOne={(value) => setBulkImportStepOne(value)}
        setBulkImportStepTwo={(value) => setBulkImportStepTwo(value)}
        setBulkImportStepThree={(value) => setBulkImportStepThree(value)}
        bulkImportMappingData={bulkImportMappingData}
        bulkImportMappingProcessing={bulkImportMappingProcessing}
        handleBICriteriaUpdate={handleBICriteriaUpdate}
        fileName={fileName}
      />
    );
  } else if (bulkImportStepThree) {
    return (
      <BulkImportStepThree
        modelName={modelName}
        currentModuleLabel={currentModuleLabel}
        importedFiles={importedFiles}
        fieldsList={fieldsList.filter((field) => !field.readOnly)}
        fieldMappingData={fieldMappingData}
        handleBulkImportFieldMapping={(values) =>
          handleBulkImportFieldMapping(values)
        }
        setBulkImportStepTwo={(value) => setBulkImportStepTwo(value)}
        setBulkImportStepThree={(value) => setBulkImportStepThree(value)}
        mappingInitialData={mappingInitialData}
        bulkImportFieldMappingSaving={bulkImportFieldMappingSaving}
        triggerAutomation={triggerAutomation}
        onTriggerAutomation={onTriggerAutomation}
        mappingCount={mappingCount}
        handleChangeFilter={handleChangeFilter}
        updateFieldsWithImportData={updateFieldsWithImportData}
        mappingFilterMode={mappingFilterMode}
        resetValues={resetValues}
        fileName={fileName}
        ui={ui}
        userPreferences={userPreferences}
      />
    );
  } else return null;
};
