import React from "react";
import { useFormikContext } from "formik";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../../models/ICustomField";
import { FormFieldPerDataType } from "../FormFieldPerDataType";
import { get } from "lodash";
import { BtwSectionControl } from "../../../../../../../components/TailwindControls/Form/Shared/BtwSectionControl";
import { InlineSectionControl } from "../../../../../../../components/TailwindControls/Form/Shared/InlineSectionControl";
import { GetDetailsContainerFieldsProps } from "./GetDetailsContainerFieldsProps";
import { getSortedFieldList } from "../../../utils/getOrderedFieldsList";

export const containerWidth: Record<string, string> = {
  "1": "w-1/2",
  "2": "w-1/2",
  "3": "w-3/4",
  "4": "w-full",
};

export const GetDetailsContainerFields = ({
  id,
  type,
  fieldList,
  quickCreate,
  isSample,
  appName,
  modelName,
  editMode,
  sections,
  formResetted,
  formDetails,
  rejectRequired = false,
  addClear,
  currentFormLayer,
  disabled,
  sectionDetails,
  sectionsLength,
  sectionFieldList = [],
  columnLayoutValues,
  lookupDependencyFields,
  fieldCustomization = false,
  retainValueFields,
  countryCodeInUserPreference,
  setCurrentFormLayer = () => {},
  handleDependencyLookupFiltering,
  handleDownSectionOrder = () => {},
  handleUpSectionOrder = () => {},
  handleRightFieldOrderUpdateInsideSection = () => {},
  handleLeftFieldOrderUpdateInsideSection = () => {},
  handleUpFieldOrderUpdateInsideSection = () => {},
  handleDownFieldOrderUpdateInsideSection = () => {},
  setDefaultCurrency,
  disableAutoSelectOfSystemDefinedValues,
}: GetDetailsContainerFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [activeField, setActiveField] = React.useState<string | null>(null);

  let quickCreateFields: ICustomField[] = getSortedFieldList(fieldList)
    ?.filter((field) => field.dataType !== "relatedTo")
    .filter(
      (field) =>
        (field.visible &&
          field.mandatory &&
          field.addInForm &&
          (field.dataType === SupportedDataTypes.expression
            ? true
            : !field.readOnly)) ||
        (field.visible &&
          field.addInForm &&
          (field.dataType === SupportedDataTypes.expression
            ? true
            : !field.readOnly) &&
          field.showInQuickCreate)
    );

  return (
    <div
      className={`${
        type === "WebPage"
          ? `w-full h-full px-6 sm:py-9 sm:px-8 ${
              columnLayoutValues
                ? columnLayoutValues[get(sectionDetails, "columnLayout", "4")]
                : "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            } gap-x-6 gap-y-4`
          : "w-full h-full grid sm:grid-cols-2 gap-x-6"
      }`}
    >
      {fieldCustomization
        ? get(sectionDetails, "sectionFieldsWithOrder", []) &&
          get(sectionDetails, "sectionFieldsWithOrder", [])?.length > 0 &&
          get(sectionDetails, "sectionFieldsWithOrder", []).map(
            (field, index) => {
              let findFieldIndex = sectionFieldList?.findIndex(
                (sectionField) => sectionField.name === field.fieldName
              );
              if (findFieldIndex !== -1) {
                if (
                  sectionFieldList[findFieldIndex].visible &&
                  sectionFieldList[findFieldIndex].addInForm &&
                  (sectionFieldList[findFieldIndex].dataType ===
                  SupportedDataTypes.expression
                    ? true
                    : !sectionFieldList[findFieldIndex].readOnly)
                ) {
                  return (
                    <div
                      key={`field_${index}`}
                      className={`${
                        fieldCustomization
                          ? "border rounded-lg border-dashed bg-gray-100 border-gray-400 px-2 flex items-center justify-center gap-x-4"
                          : ""
                      }  ${
                        sectionFieldList[findFieldIndex].dataType ===
                        "recordImage"
                          ? "sm:col-span-full"
                          : sectionFieldList[findFieldIndex].dataType === "json"
                          ? `${
                              sectionDetails &&
                              sectionDetails?.columnLayout <= "2"
                                ? "col-span-full"
                                : "col-span-2"
                            }`
                          : ""
                      }`}
                      onMouseEnter={() => setActiveField(field.fieldName)}
                      onMouseLeave={() => setActiveField(null)}
                    >
                      <div
                        className={`w-full ${
                          fieldCustomization ? "z-10 opacity-60 relative" : ""
                        }`}
                      >
                        <FormFieldPerDataType
                          field={sectionFieldList[findFieldIndex]}
                          fieldList={sectionFieldList}
                          isSample={isSample}
                          setFieldValue={setFieldValue}
                          appName={appName}
                          modelName={modelName}
                          editMode={editMode}
                          id={id}
                          index={index}
                          values={values}
                          formResetted={formResetted}
                          formDetails={formDetails}
                          retainDefaultValue={retainValueFields?.includes(
                            sectionFieldList[findFieldIndex].name
                          )}
                          countryCodeInUserPreference={
                            countryCodeInUserPreference
                          }
                          rejectRequired={rejectRequired}
                          addClear={addClear}
                          disabled={disabled}
                          currentFormLayer={currentFormLayer}
                          setCurrentFormLayer={(value) =>
                            setCurrentFormLayer(value)
                          }
                          lookupDependencyFields={lookupDependencyFields}
                          fieldCustomization={fieldCustomization}
                          handleDependencyLookupFiltering={
                            handleDependencyLookupFiltering
                          }
                          setDefaultCurrency={setDefaultCurrency}
                          disableAutoSelectOfSystemDefinedValues={
                            disableAutoSelectOfSystemDefinedValues
                          }
                        />
                      </div>
                      {!fieldCustomization ? null : (
                        <div
                          className={`${
                            fieldCustomization
                              ? `${
                                  activeField === field.fieldName
                                    ? "flex items-center justify-end"
                                    : "hidden"
                                }`
                              : "hidden"
                          }`}
                        >
                          <BtwSectionControl
                            sections={sections}
                            sectionDetails={sectionDetails}
                            allSectionsLength={sectionsLength}
                            field={sectionFieldList[findFieldIndex]}
                            handleUpSectionOrder={(upSection) =>
                              handleUpSectionOrder(
                                sectionDetails,
                                sectionFieldList[findFieldIndex],
                                sectionDetails?.sectionName,
                                upSection
                              )
                            }
                            handleDownSectionOrder={(downSection) =>
                              handleDownSectionOrder(
                                sectionDetails,
                                sectionFieldList[findFieldIndex],
                                sectionDetails?.sectionName,
                                downSection
                              )
                            }
                          />
                          <div
                            className={`${
                              sectionFieldList[findFieldIndex].dataType ===
                              "recordImage"
                                ? "hidden"
                                : ""
                            }`}
                          >
                            <InlineSectionControl
                              sectionFieldList={sectionFieldList}
                              sectionFieldListWithOrder={
                                sectionDetails?.sectionFieldsWithOrder
                              }
                              field={sectionFieldList[findFieldIndex]}
                              fieldIndex={findFieldIndex}
                              sectionDetails={sectionDetails}
                              handleDownFieldOrderUpdateInsideSection={() =>
                                handleDownFieldOrderUpdateInsideSection(
                                  sectionDetails,
                                  sectionFieldList[findFieldIndex],
                                  sectionDetails?.sectionName
                                )
                              }
                              handleUpFieldOrderUpdateInsideSection={() =>
                                handleUpFieldOrderUpdateInsideSection(
                                  sectionDetails,
                                  sectionFieldList[findFieldIndex],
                                  sectionDetails?.sectionName
                                )
                              }
                              handleLeftFieldOrderUpdateInsideSection={() =>
                                handleLeftFieldOrderUpdateInsideSection(
                                  sectionDetails,
                                  sectionFieldList[findFieldIndex],
                                  sectionDetails?.sectionName
                                )
                              }
                              handleRightFieldOrderUpdateInsideSection={() =>
                                handleRightFieldOrderUpdateInsideSection(
                                  sectionDetails,
                                  sectionFieldList[findFieldIndex],
                                  sectionDetails?.sectionName
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else return null;
              } else return null;
            }
          )
        : quickCreate
        ? quickCreateFields.flatMap((field: ICustomField, index) => {
            return (
              <div
                key={`field_${index}`}
                className={`${
                  quickCreateFields[index + 1]?.dataType === "jsonDateTime"
                    ? "col-span-full"
                    : field.dataType === "jsonDateTime"
                    ? "col-span-full"
                    : field.dataType === "recordImage"
                    ? "sm:col-span-full"
                    : field.dataType === "json"
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                <FormFieldPerDataType
                  field={field}
                  fieldList={fieldList}
                  isSample={isSample}
                  setFieldValue={setFieldValue}
                  appName={appName}
                  modelName={modelName}
                  editMode={editMode}
                  id={id}
                  index={index}
                  values={values}
                  formResetted={formResetted}
                  formDetails={formDetails}
                  rejectRequired={rejectRequired}
                  addClear={addClear}
                  disabled={disabled}
                  countryCodeInUserPreference={countryCodeInUserPreference}
                  currentFormLayer={currentFormLayer}
                  retainDefaultValue={retainValueFields?.includes(field.name)}
                  setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
                  lookupDependencyFields={lookupDependencyFields}
                  handleDependencyLookupFiltering={
                    handleDependencyLookupFiltering
                  }
                  disableAutoSelectOfSystemDefinedValues={
                    disableAutoSelectOfSystemDefinedValues
                  }
                />
              </div>
            );
          })
        : get(sectionDetails, "sectionFieldsWithOrder", []) &&
          get(sectionDetails, "sectionFieldsWithOrder", [])?.length > 0 &&
          get(sectionDetails, "sectionFieldsWithOrder", [])
            .filter(
              (field) =>
                field.visible &&
                field.addInForm &&
                (field.dataType === SupportedDataTypes.expression
                  ? true
                  : !field.readOnly)
            )
            .map((field, index) => {
              let findFieldIndex = sectionFieldList?.findIndex(
                (sectionField) => sectionField.name === field.fieldName
              );

              if (findFieldIndex !== -1) {
                if (
                  sectionFieldList[findFieldIndex].visible &&
                  sectionFieldList[findFieldIndex].addInForm &&
                  (sectionFieldList[findFieldIndex].dataType ===
                  SupportedDataTypes.expression
                    ? true
                    : !sectionFieldList[findFieldIndex].readOnly)
                ) {
                  return (
                    <div
                      key={`field_${index}`}
                      className={`${
                        sectionFieldList[findFieldIndex].dataType ===
                        "recordImage"
                          ? "sm:col-span-full"
                          : sectionFieldList[findFieldIndex].dataType === "json"
                          ? "sm:col-span-2"
                          : ""
                      }`}
                    >
                      <FormFieldPerDataType
                        field={sectionFieldList[findFieldIndex]}
                        fieldList={sectionFieldList}
                        overflow={false}
                        isSample={isSample}
                        setFieldValue={setFieldValue}
                        appName={appName}
                        modelName={modelName}
                        editMode={editMode}
                        id={id}
                        index={index}
                        values={values}
                        formResetted={formResetted}
                        formDetails={formDetails}
                        rejectRequired={rejectRequired}
                        addClear={addClear}
                        disabled={disabled}
                        countryCodeInUserPreference={
                          countryCodeInUserPreference
                        }
                        currentFormLayer={currentFormLayer}
                        retainDefaultValue={retainValueFields?.includes(
                          sectionFieldList[findFieldIndex].name
                        )}
                        setCurrentFormLayer={(value) =>
                          setCurrentFormLayer(value)
                        }
                        lookupDependencyFields={lookupDependencyFields}
                        fieldCustomization={fieldCustomization}
                        handleDependencyLookupFiltering={
                          handleDependencyLookupFiltering
                        }
                        setDefaultCurrency={setDefaultCurrency}
                        disableAutoSelectOfSystemDefinedValues={
                          disableAutoSelectOfSystemDefinedValues
                        }
                      />
                    </div>
                  );
                } else return null;
              } else return null;
            })}
    </div>
  );
};
