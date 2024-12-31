import React from "react";
import { useFormikContext } from "formik";
import { getAppPathParts } from "../../utils/getAppPathParts";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IDealPipelineStage } from "../../../../../../models/shared";
import { GetDetailsContainerFields } from "./FieldContainers/GetDetailsContainerFields";
import { GetRelatedToContainerFields } from "./FieldContainers/GetRelatedToContainerFields";
import _ from "lodash";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import {
  columnLayoutValues,
  FormFieldListProps,
} from "./FormFieldPerDataTypeProps";
import { handleDeleteSection } from "./FormCustomization/handleDeleteSection";
import { SectionDetailsType } from "../../../generic/GenericForms/Shared/genericFormProps";
import { SectionMove } from "./FormCustomization/SectionContainer/SectionMover";
import { SectionContainerWrapper } from "./FormCustomization/SectionContainer/SectionContainerWrapper";
import { CustomizableFormSection } from "./FormCustomization/SectionContainer/CustomizableFormSection";
import { useModuleDataAutoMapping } from "./useModuleDataAutoMapping";
import { useFormCustomization } from "./useFormCustomization";
import {
  handleDependencyLookupFiltering,
  useDealStagePipelineDependancyHandler,
} from "./useDealStagePipelineDependancyHandler";
import { useDefaultValueInFormSetter } from "./useDefaultValueInFormSetter";

export default function FormFieldList({
  fieldList,
  editMode,
  appName,
  customFieldsData,
  type = "WebPage",
  quickCreate = false,
  isSample = false,
  formResetted,
  moduleName = "",
  allowToggle = true,
  applyBorder = false,
  formDetails,
  rejectRequired = false,
  addClear = false,
  disabled = undefined,
  currentFormLayer,
  updatePipeline = false,
  formCustomization = false,
  editData,
  addNewSection,
  saveFormCustomization,
  loadingCustomizationForm,
  retainValueFields,
  userPreferences,
  countryCodeInUserPreference,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setLoadingCustomizationForm = () => {},
  setSaveCustomizationFormError = () => {},
  setAddNewSection = () => {},
  handleSaveFormCustomization = () => {},
  setCurrentFormLayer = () => {},
  detailHeading,
  setSaveFormCustomization,
  setDefaultCurrency,
  setDefaultStageAndPipeline = true,
  disableAutoSelectOfSystemDefinedValues,
}: FormFieldListProps) {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const { modelName, id } = getAppPathParts();
  const [dealPipelineStages, setDealPipelineStages] = React.useState<
    IDealPipelineStage[]
  >([]);
  const [hasRelatedTo, setHasRelatedTo] = React.useState(false);
  const [hasFieldPreferences, setHasFieldPreferences] =
    React.useState<boolean>(false);
  const [isDefaultStagePipelineResetted, setIsDefaultStagePipelineResetted] =
    React.useState(false);
  const [formFieldsList, setFormFieldsList] = React.useState<
    Array<ICustomField>
  >([]);
  const [stagesLookupOptions, setStagesLookupOptions] = React.useState<any[]>(
    []
  );
  const [deleteSectionModal, setDeleteSectionModal] = React.useState<{
    visible: boolean;
    section: SectionDetailsType | null;
  }>({ visible: false, section: null });

  const [sections, setSections] = React.useState<SectionDetailsType[]>([
    {
      sectionOrder: 0,
      sectionName: "details",
      sectionLabel: detailHeading || "Details",
      sectionFields: formFieldsList,
      sectionFieldsWithOrder: [],
      columnLayout: "4",
      systemDefined: true,
    },
  ]);
  const [lookupDependencyFields, setLookupDependencyFields] = React.useState<
    Record<string, Record<string, any>>
  >({});

  // Form Default Value Handler eg : auto pick owner from user store
  useDefaultValueInFormSetter(
    editMode,
    formResetted,
    fieldList,
    formFieldsList,
    customFieldsData,
    setHasRelatedTo,
    setFieldValue
  );
  // Form Default Value Handler ends here

  // Form Dependancy Fields handlers eg : Deal Stage and Deal Pipeline
  useDealStagePipelineDependancyHandler(
    appName,
    moduleName,
    fieldList,
    formFieldsList,
    editMode,
    values,
    editData,
    customFieldsData,
    isDefaultStagePipelineResetted,
    setDefaultStageAndPipeline,
    dealPipelineStages,
    lookupDependencyFields,
    updatePipeline,
    stagesLookupOptions,
    setFieldValue,
    setFormFieldsList,
    setIsDefaultStagePipelineResetted,
    setDealPipelineStages,
    setLookupDependencyFields,
    setStagesLookupOptions
  );
  //Form Dependancy Fields handlers Ends Here

  // Form Customization functions starts here
  useFormCustomization(
    modelName,
    moduleName,
    userPreferences,
    formFieldsList,
    sections,
    addNewSection,
    setAddNewSection,
    setHasFieldPreferences,
    setSaveCustomizationFormError,
    setSections
  );

  React.useEffect(() => {
    if (saveFormCustomization) {
      handleSaveFormCustomization(sections);
    }
  }, [saveFormCustomization]);

  // Field Customization Ends here

  // Auto Mapping - start
  useModuleDataAutoMapping(
    appName,
    modelName,
    values,
    formFieldsList,
    formDetails,
    setFieldValue
  );
  // Auto Mapping - end

  const elementObject: { [name: string]: React.ReactNode } = {
    fieldElement: (
      <GetDetailsContainerFields
        id={id}
        type={type}
        fieldList={formFieldsList}
        isSample={isSample}
        appName={appName}
        modelName={modelName}
        editMode={editMode}
        formResetted={formResetted}
        quickCreate={quickCreate}
        formDetails={formDetails}
        rejectRequired={rejectRequired}
        addClear={addClear}
        disabled={disabled}
        retainValueFields={retainValueFields}
        currentFormLayer={currentFormLayer}
        countryCodeInUserPreference={countryCodeInUserPreference}
        setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
        lookupDependencyFields={lookupDependencyFields}
        handleDependencyLookupFiltering={(
          parentField: string,
          parentLookup: string,
          childField: string
        ) =>
          handleDependencyLookupFiltering(
            parentField,
            parentLookup,
            childField,
            false,
            lookupDependencyFields,
            formFieldsList,
            setFormFieldsList,
            setFieldValue
          )
        }
      />
    ),
    relatedTo: (
      <GetRelatedToContainerFields
        fieldList={formFieldsList}
        editMode={editMode}
        formResetted={formResetted}
        rejectRequired={rejectRequired}
        addClear={addClear}
        disabled={disabled}
        formDetails={formDetails}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      />
    ),
  };

  return (
    <>
      {quickCreate ? (
        <>
          {elementObject.fieldElement}
          {elementObject.relatedTo}
        </>
      ) : (
        <div className={`w-full h-full flex flex-col items-center gap-y-6`}>
          {sections && sections?.length > 0
            ? sections
                ?.filter((section) => {
                  if (hasRelatedTo) return section;
                  else if (section.sectionName === "relatedTo") return null;
                  else return section;
                })
                ?.map((section) => section)
                ?.map((section, index) => (
                  <div className="grid grid-cols-12 w-full gap-x-4" key={index}>
                    <SectionMove
                      index={index}
                      formCustomization={formCustomization}
                      sections={sections}
                      section={section}
                      setSections={setSections}
                    />
                    <div
                      className={`${
                        formCustomization ? "col-span-11" : "col-span-12"
                      } w-full flex items-center justify-center`}
                    >
                      <SectionContainerWrapper
                        index={index}
                        allowToggle={allowToggle}
                        applyBorder={applyBorder}
                        loadingCustomizationForm={loadingCustomizationForm}
                        formCustomization={formCustomization}
                        section={section}
                        sections={sections}
                        setSections={setSections}
                        setDeleteSectionModal={setDeleteSectionModal}
                        setFieldValue={setFieldValue}
                        setLoadingCustomizationForm={
                          setLoadingCustomizationForm
                        }
                        setSaveFormCustomization={setSaveCustomizationFormError}
                      >
                        <>
                          {section.sectionName !== "relatedTo" ? (
                            <CustomizableFormSection
                              id={id}
                              type={type}
                              setDefaultCurrency={setDefaultCurrency}
                              formFieldsList={formFieldsList}
                              columnLayoutValues={columnLayoutValues}
                              isSample={isSample}
                              appName={appName}
                              modelName={modelName}
                              editMode={editMode}
                              formResetted={formResetted}
                              quickCreate={quickCreate}
                              formDetails={formDetails}
                              rejectRequired={rejectRequired}
                              addClear={addClear}
                              disabled={disabled}
                              countryCodeInUserPreference={
                                countryCodeInUserPreference
                              }
                              currentFormLayer={currentFormLayer}
                              retainValueFields={retainValueFields}
                              lookupDependencyFields={lookupDependencyFields}
                              formCustomization={formCustomization}
                              sections={sections}
                              section={section}
                              hasRelatedTo={hasRelatedTo}
                              setCurrentFormLayer={(value) =>
                                setCurrentFormLayer(value)
                              }
                              handleDependencyLookupFiltering={(
                                parentField: string,
                                parentLookup: string,
                                childField: string
                              ) =>
                                handleDependencyLookupFiltering(
                                  parentField,
                                  parentLookup,
                                  childField,
                                  false,
                                  lookupDependencyFields,
                                  formFieldsList,
                                  setFormFieldsList,
                                  setFieldValue
                                )
                              }
                              disableAutoSelectOfSystemDefinedValues={
                                disableAutoSelectOfSystemDefinedValues
                              }
                              setSections={setSections}
                            />
                          ) : (
                            <GetRelatedToContainerFields
                              fieldList={formFieldsList}
                              editMode={editMode}
                              formResetted={formResetted}
                              rejectRequired={rejectRequired}
                              addClear={addClear}
                              disabled={disabled}
                              formDetails={formDetails}
                              fieldCustomization={formCustomization}
                              setCurrentFormLayer={(value) =>
                                setCurrentFormLayer(value)
                              }
                              sectionDetails={section}
                              genericModels={genericModels}
                              allLayoutFetched={allLayoutFetched}
                              allModulesFetched={allModulesFetched}
                            />
                          )}
                        </>
                      </SectionContainerWrapper>
                    </div>
                  </div>
                ))
            : null}
        </div>
      )}
      {deleteSectionModal.visible && (
        <>
          <DeleteModal
            id={`delete-${deleteSectionModal.section}`}
            modalHeader={`Delete Section`}
            modalMessage={`Are you sure you want to delete this section?`}
            leftButton="Cancel"
            rightButton="Delete"
            loading={false}
            onCancel={() =>
              setDeleteSectionModal({ visible: false, section: null })
            }
            onDelete={() => {
              if (!deleteSectionModal.section) {
                setDeleteSectionModal({ visible: false, section: null });
              }
              setSections(
                handleDeleteSection(sections, deleteSectionModal.section)
              );
              setDeleteSectionModal({ visible: false, section: null });
            }}
            onOutsideClick={() =>
              setDeleteSectionModal({ visible: false, section: null })
            }
          />
          <Backdrop
            onClick={() =>
              setDeleteSectionModal({ visible: false, section: null })
            }
          />
        </>
      )}
    </>
  );
}
