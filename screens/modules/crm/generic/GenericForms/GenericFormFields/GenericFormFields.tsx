import { useTranslation } from "next-i18next";
import { FormikValues, useFormikContext } from "formik";
import React from "react";
import FormFieldList from "../../../shared/components/Form/FormFieldList";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import getCustomFieldValue from "../../../shared/utils/getCustomFieldValue";
import _, { get } from "lodash";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { getNavigationLabel } from "../../../shared/utils/getNavigationLabel";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { GenericSubFormContainer } from "../SubForm/GenericSubFormContainer";
import { SupportedApps } from "../../../../../../models/shared";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { AccountModels } from "../../../../../../models/Accounts";
import {
  GenericFormFieldsProps,
  SectionDetailsType,
} from "../Shared/genericFormProps";
import { GenericFormFieldsFormWrapper } from "./GenericFormFieldsFormWrapper";
import { GenericFormFieldsHeaderChildren } from "./GenericFormFieldsHeaderChildren";
import { SpecialSubFormWrapper } from "../SpecialSubForm/SpecialSubFormWrapper";

export const GenericFormFields = ({
  id,
  data,
  currentUser,
  appName,
  modelName,
  fieldList,
  editMode = false,
  saveLoading,
  saveNext,
  formDetails,
  customFieldsData = {},
  isSample,
  currentModule,
  formResetted,
  updatePipeline,
  editData,
  formCustomization,
  subFormData,
  subFormDataForId,
  totalSubForms,
  dependingModuleFields,
  retainValueFields,
  userPreferences,
  countryCodeInUserPreference,
  subFormDataDict,
  subFormRefs,
  subFormFieldsListDict,
  subFormClear,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setTotalSubForms = () => {},
  setFormCustomization = () => {},
  handleSave,
  handleSaveNext,
  onCancel,
  setSubFormDataDict,
  importUserPreferences,
  setSubFormValidationErrors,
  subFormValidationErrors,
}: GenericFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const { navigations } = React.useContext(NavigationStoreContext);
  const currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: currentModule?.name,
    currentModuleLabel: currentModule ? currentModule?.label.en : "",
    defaultLabel: formDetails.modelName,
  });
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [currentFormLayer, setCurrentFormLayer] = React.useState<boolean>(true);
  const [addNewSection, setAddNewSection] = React.useState<boolean>(false);
  const [saveCustomizationFormError, setSaveCustomizationFormError] =
    React.useState<boolean>(false);
  const [saveFormCustomization, setSaveFormCustomization] =
    React.useState<boolean>(false);
  const [loadingCustomizationForm, setLoadingCustomizationForm] =
    React.useState<boolean>(false);
  const [resetComponentLoadIndex, setResetComponentLoadIndex] =
    React.useState<boolean>(false);

  const [saveUserPreference] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        setFormCustomization(false);
        setSaveFormCustomization(false);
        importUserPreferences([responseOnCompletion.save.data]);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error("Failed to save form customization");
        setFormCustomization(false);
        setSaveFormCustomization(false);
        return;
      }
      Toast.error("Failed to save form customization");
      setFormCustomization(false);
      setSaveFormCustomization(false);
      return;
    },
  });

  const handleCustomFieldsSave = () => {
    let customFieldValues: Record<string, any> = {};
    const customFieldList = fieldList.filter(
      (field) => field["systemDefined"] !== true
    );
    for (let i = 0; i < customFieldList.length; i++) {
      if (customFieldList[i]["visible"]) {
        customFieldValues[customFieldList[i]["name"]] = getCustomFieldValue(
          customFieldList[i].dataType,
          values[customFieldList[i]["name"]]
        );
      }
    }
    setFieldValue("fields", customFieldValues);
  };

  const handleSaveFormCustomization = async (
    sections: SectionDetailsType[]
  ) => {
    if (loadingCustomizationForm) {
      setSaveFormCustomization(false);
      return;
    }
    if (!modelName) {
      setFormCustomization(false);
      return Toast.error("Error while saving form customization");
    }

    const updatedUserPreferences =
      userPreferences && userPreferences.length > 0 ? userPreferences[0] : null;
    const defaultPreferences = updatedUserPreferences
      ? { ...updatedUserPreferences.defaultPreferences }
      : {};
    await saveUserPreference({
      variables: {
        id: updatedUserPreferences ? updatedUserPreferences.id : null,
        modelName: AccountModels.Preference,
        saveInput: {
          defaultPreferences: {
            ...defaultPreferences,
            [modelName]: get(defaultPreferences, modelName, null)
              ? {
                  ...get(defaultPreferences, modelName),
                  formCustomizationPerModule: [...sections],
                }
              : {
                  formCustomizationPerModule: [...sections],
                },
          },
          serviceName: SupportedApps.crm,
        },
      },
    });
  };

  return (
    <GenericFormFieldsFormWrapper
      currentFormLayer={currentFormLayer}
      formCustomization={formCustomization}
      saveLoading={saveLoading}
      saveFormCustomization={saveFormCustomization}
      loadingCustomizationForm={loadingCustomizationForm}
      saveCustomizationFormError={saveCustomizationFormError}
      handleSave={handleSave}
      handleCustomFieldsSave={handleCustomFieldsSave}
    >
      <GenericBackHeader
        heading={
          formDetails.type === "add"
            ? `${t("common:add-form")} ${currentModuleLabel}`
            : `${t("common:edit-form")} ${currentModuleLabel}`
        }
        addButtonInFlexCol={true}
      >
        <GenericFormFieldsHeaderChildren
          modelName={modelName}
          currentUser={currentUser}
          formCustomization={formCustomization}
          saveFormCustomization={saveFormCustomization}
          saveLoading={saveLoading}
          saveNext={saveNext}
          editMode={editMode}
          saveCustomizationFormError={saveCustomizationFormError}
          loadingCustomizationForm={loadingCustomizationForm}
          subFormValidationErrors={subFormValidationErrors}
          formDetails={formDetails}
          onCancel={onCancel}
          handleSave={handleSave}
          handleSaveNext={handleSaveNext}
          handleCustomFieldsSave={handleCustomFieldsSave}
          setAddNewSection={setAddNewSection}
          setFormCustomization={setFormCustomization}
          setSaveFormCustomization={setSaveFormCustomization}
        />
      </GenericBackHeader>
      <div className="flex flex-col gap-y-4 w-full h-full p-6">
        {fieldList && (
          <FormFieldList
            fieldList={fieldList}
            editMode={editMode}
            isSample={isSample}
            appName={formDetails.appName}
            customFieldsData={customFieldsData}
            formResetted={formResetted}
            moduleName={currentModule?.name || ""}
            updatePipeline={updatePipeline}
            setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
            editData={editData}
            formCustomization={formCustomization}
            addNewSection={addNewSection}
            saveFormCustomization={saveFormCustomization}
            loadingCustomizationForm={loadingCustomizationForm}
            retainValueFields={retainValueFields}
            userPreferences={userPreferences}
            countryCodeInUserPreference={countryCodeInUserPreference}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            setLoadingCustomizationForm={(value) =>
              setLoadingCustomizationForm(value)
            }
            saveCustomizationFormError={saveCustomizationFormError}
            setSaveCustomizationFormError={(value) =>
              setSaveCustomizationFormError(value)
            }
            setAddNewSection={(value) => setAddNewSection(value)}
            handleSaveFormCustomization={(sections) => {
              handleSaveFormCustomization(sections);
            }}
            setSaveFormCustomization={(value: boolean) =>
              setSaveFormCustomization(value)
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-y-4 w-full h-full p-6">
        <div className={`flex flex-col gap-y-4`}>
          <GenericSubFormContainer
            appName={appName}
            modelName={modelName}
            subFormDataDict={subFormDataDict}
            editMode={editMode}
            formDetails={formDetails}
            editData={editData}
            countryCodeInUserPreference={countryCodeInUserPreference}
            isSample={isSample}
            subFormRefs={subFormRefs}
            data={data}
            subFormFieldsListDict={subFormFieldsListDict}
            setSubFormDataDict={setSubFormDataDict}
            id={id}
            saveNext={saveNext}
            subFormClear={subFormClear}
            setSubFormValidationErrors={setSubFormValidationErrors}
            subFormValidationErrors={subFormValidationErrors}
          />
        </div>
      </div>
      <SpecialSubFormWrapper
        genericModels={genericModels}
        currentModule={currentModule}
        modelName={modelName}
        editMode={editMode}
        data={data}
        subFormData={subFormData}
        isSample={isSample}
        currentFormLayer={currentFormLayer}
        countryCodeInUserPreference={countryCodeInUserPreference}
        totalSubForms={totalSubForms}
        formCustomization={formCustomization}
        formResetted={formResetted}
        subFormDataForId={subFormDataForId}
        values={values}
        dependingModuleFields={dependingModuleFields}
        formDetails={formDetails}
        resetComponentLoadIndex={resetComponentLoadIndex}
        setResetComponentLoadIndex={setResetComponentLoadIndex}
        setCurrentFormLayer={setCurrentFormLayer}
        setTotalSubForms={setTotalSubForms}
        setFieldValue={setFieldValue}
      />
    </GenericFormFieldsFormWrapper>
  );
};
