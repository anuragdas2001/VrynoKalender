import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import router from "next/router";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { BulkImportStepTwoContent } from "./BulkImportStepTwoContent";
import { BulkImportStepTwoProps } from "../bulkImportImportMappingHelpers";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Toast } from "../../../../../../components/TailwindControls/Toast";

export const HeadingHtml = ({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) => {
  return (
    <span className="font-medium text-sm sm:text-md lg:text-lg ml-2 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-x-2 whitespace-nowrap">
      {heading}
      <span className="text-xsm text-vryno-theme-light-blue">{`(${subHeading})`}</span>
    </span>
  );
};

export const BulkImportStepTwo = ({
  ui,
  currentModuleLabel,
  importedFiles,
  fieldsList,
  bulkImportCriteriaValues,
  handleBulkImportCriteria,
  setBulkImportStepOne,
  setBulkImportStepTwo,
  setBulkImportStepThree,
  bulkImportMappingData,
  bulkImportMappingProcessing,
  handleBICriteriaUpdate,
  fileName,
}: BulkImportStepTwoProps) => {
  const { t } = useTranslation(["common"]);
  const validationSchema = Yup.object().shape({
    mappingMode: Yup.string().required("Please choose any one option"),
    updateEmptyValues: Yup.boolean().nullable(),
  });

  const [showBIMappingModal, setShowBIMappingModal] = React.useState({
    visible: false,
    values: {},
  });

  return (
    <div onSubmit={(e) => e.preventDefault()} className="w-full h-full">
      <Formik
        initialValues={{
          ...bulkImportCriteriaValues,
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (values["mappingMode"] === "update" && !values["updateOn"]) {
            toast.error("Please select based on for update mode");
            return;
          }
          const selectedHiddenFields: string[] = [];
          const requestArray: string[] = [];
          values.skipOn && requestArray.push(values.skipOn);
          values.mappingMode === "update" &&
            values.updateOn &&
            requestArray.push(values.updateOn);
          requestArray.forEach((field) => {
            const fieldObj = fieldsList.find((f) => f.name === field);
            if (fieldObj && !fieldObj.visible) {
              selectedHiddenFields.push(fieldObj.label.en);
            }
          });
          if (selectedHiddenFields.length) {
            toast.error(
              `Selected fields "${selectedHiddenFields.join(
                ", "
              )}" are hidden. Please select visible fields.`
            );
            return;
          }
          if (
            values["mappingMode"] === "update" &&
            values["updateOn"] &&
            values["skipOn"] &&
            values["updateOn"] == values["skipOn"]
          ) {
            toast.error("Update on and Skip on cannot be same");
            return;
          }
          if (bulkImportMappingData) {
            setBulkImportStepTwo(false);
            setBulkImportStepThree(true);
            return;
          }
          if (ui === "mapping" || ui == "bulkimport")
            setShowBIMappingModal({ visible: true, values: { ...values } });
          if (ui === "biedit") {
            //TO DO: need ui to show loader
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <GenericBackHeader
              headingHtml={
                <HeadingHtml
                  heading={`Import ${currentModuleLabel}`}
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
                if (ui === "biedit") {
                  router.back();
                  return;
                }
                setBulkImportStepOne(true);
                setBulkImportStepTwo(false);
              }}
            >
              <div className="w-32">
                <Button
                  id="bi-step-two"
                  onClick={() => handleSubmit()}
                  buttonType="thin"
                  loading={bulkImportMappingProcessing}
                  disabled={bulkImportMappingProcessing}
                  kind={"primary"}
                  userEventName={`${
                    bulkImportMappingData
                      ? "bulkImport-mapping-step-two-next"
                      : "open-bulkImport-mapping-create-form"
                  }-click`}
                >
                  {t("common:Next")}
                </Button>
              </div>
            </GenericBackHeader>

            <BulkImportStepTwoContent
              currentModuleLabel={currentModuleLabel}
              handleBICriteriaUpdate={handleBICriteriaUpdate}
              fieldsList={fieldsList}
            />

            {showBIMappingModal.visible ? (
              <>
                <GenericFormModalContainer
                  formHeading={"Bulk Import Mapping"}
                  onOutsideClick={() =>
                    setShowBIMappingModal({ visible: false, values: {} })
                  }
                  limitWidth={true}
                  onCancel={() =>
                    setShowBIMappingModal({ visible: false, values: {} })
                  }
                >
                  <div className="w-full">
                    <div className={"w-full grid gap-x-6 mt-4"}>
                      <FormInputBox
                        name="name"
                        label="Bulk Import Mapping Name"
                        type="text"
                        required={true}
                      />
                    </div>
                    <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
                      <Button
                        id="cancel-form"
                        onClick={() =>
                          setShowBIMappingModal({ visible: false, values: {} })
                        }
                        kind="back"
                        loading={bulkImportMappingProcessing}
                        disabled={bulkImportMappingProcessing}
                        userEventName="bulkImport-mapping-save:cancel-click"
                      >
                        {t("common:cancel")}
                      </Button>
                      <Button
                        id="save-form"
                        onClick={() => {
                          if (!values["name"]) {
                            toast.error(
                              "Please enter Bulk Import Mapping Name"
                            );
                            return;
                          }
                          if (values["name"].length > 50) {
                            Toast.error(
                              "Bulk import mapping name should not be more than 50 characters"
                            );
                            return;
                          }
                          handleBulkImportCriteria({
                            ...values,
                            fileData: importedFiles,
                          });
                        }}
                        kind="primary"
                        loading={bulkImportMappingProcessing}
                        disabled={bulkImportMappingProcessing}
                        userEventName="bulkImport-mapping-save:submit-click"
                      >
                        {t("common:save")}
                      </Button>
                    </div>
                  </div>
                </GenericFormModalContainer>
                <Backdrop
                  onClick={() =>
                    setShowBIMappingModal({ visible: false, values: {} })
                  }
                />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </Formik>
    </div>
  );
};
