import React from "react";
import { toast } from "react-toastify";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormCheckBox from "../../../../../../components/TailwindControls/Form/Checkbox/FormCheckBox";
import { BulkImportFieldsMappingTable } from "./BulkImportStepsComponent/BulkImportFieldsMappingTable";
import {
  BulkImportStepThreeProps,
  fieldToValueExtractor,
  valueToFieldExtractor,
} from "../bulkImportImportMappingHelpers";

export const HeadingHtml = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <span
      className="font-medium text-sm sm:text-md lg:text-lg ml-2 flex flex-col sm:justify-center sm:flex-row sm:items-center gap-x-2 whitespace-nowrap"
      data-testid={`${heading}-heading`}
    >
      {heading}
      <span
        className="text-xsm text-vryno-theme-light-blue"
        data-testid={`${subHeading}-subheading`}
      >{`(${subHeading})`}</span>
    </span>
  );
};

export const BulkImportStepThree = ({
  modelName,
  currentModuleLabel,
  importedFiles,
  fieldsList,
  fieldMappingData,
  handleBulkImportFieldMapping,
  setBulkImportStepTwo,
  setBulkImportStepThree,
  mappingInitialData,
  bulkImportFieldMappingSaving,
  triggerAutomation,
  onTriggerAutomation,
  mappingCount,
  handleChangeFilter,
  updateFieldsWithImportData,
  mappingFilterMode,
  resetValues,
  fileName,
  ui,
  userPreferences,
}: BulkImportStepThreeProps) => {
  const { t } = useTranslation(["common"]);
  const [updatedInitValues, setUpdatedInitValues] = React.useState({});
  const [preservedFormikValues, setPreservedFormikValues] = React.useState<
    Record<string, string | null>
  >({});

  React.useEffect(() => {
    // if (mappingFilterMode !== "all" && fieldMappingData) {
    if (fieldMappingData) {
      if (!Object.keys(preservedFormikValues).length) {
        let initValues = fieldToValueExtractor(fieldMappingData);
        setUpdatedInitValues(initValues);
        setPreservedFormikValues({ ...preservedFormikValues, ...initValues });
      } else {
        let dataValues = fieldMappingData;
        const preservedArray = valueToFieldExtractor(preservedFormikValues);
        for (let i = 0; i < dataValues.length; i++) {
          for (let j = 0; j < preservedArray.length; j++) {
            if (dataValues[i].fieldInFile == preservedArray[j].fieldInFile) {
              dataValues[i] = preservedArray[j];
              break;
            }
          }
        }
        setUpdatedInitValues(fieldToValueExtractor(dataValues));
      }
    }
  }, [fieldMappingData]);

  const handleValuesOnFilterChange = (values: FormikValues) => {
    let valuesArray = valueToFieldExtractor(values);
    let preservedArray = valueToFieldExtractor(preservedFormikValues);
    for (let i = 0; i < preservedArray.length; i++) {
      for (let j = 0; j < valuesArray.length; j++) {
        if (preservedArray[i].fieldInFile == valuesArray[j].fieldInFile) {
          preservedArray[i] = valuesArray[j];
          break;
        }
      }
    }
    return fieldToValueExtractor(preservedArray);
  };

  return (
    <div onSubmit={(e) => e.preventDefault()} className="w-full h-full">
      <Formik
        initialValues={updatedInitValues}
        enableReinitialize
        onSubmit={(values) => {
          const array = [];
          for (const key in preservedFormikValues) {
            if (key.includes("fieldInCrm") && preservedFormikValues[key]) {
              array.push(preservedFormikValues[key]);
            }
          }
          let containDuplicate = false;
          for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
              if (array[i] === array[j]) {
                containDuplicate = true;
                break;
              }
            }
            if (containDuplicate) break;
          }
          if (containDuplicate) {
            toast.error("Cannot have duplicate field in crm");
            return;
          }
          handleBulkImportFieldMapping({ ...preservedFormikValues, ...values });
        }}
      >
        {({ handleSubmit, resetForm, values }) => (
          <>
            <GenericBackHeader
              headingHtml={
                <HeadingHtml
                  heading={`Map Import Fields ${currentModuleLabel}`}
                  subHeading={`${
                    ui === "biedit"
                      ? fileName
                      : importedFiles &&
                        importedFiles.length > 0 &&
                        importedFiles[0].name
                  }`}
                />
              }
              onClick={() => {
                setBulkImportStepTwo(true);
                setBulkImportStepThree(false);
              }}
              addButtonInFlexCol={true}
            >
              <div className="grid grid-cols-6 sm:grid-cols-4 gap-x-4 mt-5 sm:mt-0 w-full sm:w-1/2 sm:max-w-xs items-center">
                <div className="col-span-3 sm:col-span-2">
                  <Button
                    id={"cancel-form"}
                    onClick={() => {
                      setBulkImportStepTwo(true);
                      setBulkImportStepThree(false);
                    }}
                    buttonType="thin"
                    loading={bulkImportFieldMappingSaving}
                    disabled={bulkImportFieldMappingSaving}
                    kind="back"
                    userEventName="bulkImport-mapping-step-three:cancel-click"
                  >
                    {t("common:cancel")}
                  </Button>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Button
                    id="bi-step-three"
                    onClick={() => handleSubmit()}
                    buttonType="thin"
                    loading={bulkImportFieldMappingSaving}
                    disabled={bulkImportFieldMappingSaving}
                    kind={"icon"}
                    userEventName="bulkImport-mapping-step-three:submit-click"
                  >
                    {t("common:save")}
                  </Button>
                </div>
              </div>
            </GenericBackHeader>
            <div className="px-10 pt-1 flex gap-x-10">
              <div className="flex justify-between w-full">
                <div className="pr-6">
                  <FormCheckBox
                    name={`triggerAutomation`}
                    value={triggerAutomation}
                    onChange={() => onTriggerAutomation(!triggerAutomation)}
                    label={
                      "Trigger configured automations and processes for new and updated records"
                    }
                    labelSize={"text-xsm"}
                  />
                </div>
                <Button
                  id="reset-field-mapping"
                  onClick={() => {
                    resetValues();
                    resetForm();
                    setPreservedFormikValues({});
                  }}
                  customStyle=""
                  userEventName="bulkImport-reset-field-mapping-click"
                >
                  <u className="text-xsm">Reset Field Mapping</u>
                </Button>
              </div>
            </div>
            <BulkImportFieldsMappingTable
              fieldMappingData={fieldMappingData}
              fieldsList={fieldsList}
              modelName={modelName}
              updateFieldsWithImportData={updateFieldsWithImportData}
              setPreservedFormikValues={(name: string, value: string | null) =>
                setPreservedFormikValues({
                  ...preservedFormikValues,
                  [name]: value,
                })
              }
              ui={ui}
              userPreferences={userPreferences}
            />
          </>
        )}
      </Formik>
    </div>
  );
};
