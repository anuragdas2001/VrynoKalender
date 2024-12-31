import React from "react";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { get, range } from "lodash";
import { SpecialSubFormWrapperProps } from "../Shared/genericFormProps";
import { getDataObject } from "../../../shared/utils/getDataObject";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import DeleteIcon from "remixicon-react/SubtractLineIcon";
import { getInitialValueForField } from "../../../shared/utils/getInitialValuesFromList";
import { ICustomField } from "../../../../../../models/ICustomField";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import {
  handleAddSubForm,
  handleSubtractSubForm,
} from "../SubForm/subFormHelperFunctions";
import { SpecialSubForm } from "./SpecialSubForm";
import { SpecialSubFormSummarySectionForm } from "./SpecialSubFormSummarySectionForm";

export type FieldType = {
  aggregation_method: string;
  expression: string;
  fieldsUsed: [string];
  displayAs: { en: string };
  module_name: string;
  name: string;
  value: string | number | null | undefined;
  format: {
    type: string;
    precision: number;
    ratio: string;
  };
};

export const SpecialSubFormWrapper = ({
  genericModels,
  modelName,
  editMode,
  data,
  currentModule,
  subFormData,
  isSample,
  currentFormLayer,
  countryCodeInUserPreference,
  totalSubForms,
  formCustomization,
  formResetted,
  subFormDataForId,
  values,
  dependingModuleFields,
  formDetails,
  resetComponentLoadIndex,
  setResetComponentLoadIndex,
  setCurrentFormLayer,
  setTotalSubForms,
  setFieldValue,
}: SpecialSubFormWrapperProps) => {
  React.useEffect(() => {
    if (subFormData && Object.keys(subFormData)?.length > 0) {
      let fieldsList = subFormData[Object.keys(subFormData)[0]]?.fieldsList;
      if (subFormDataForId?.length) {
        setTotalSubForms(subFormDataForId?.length);
        subFormDataForId?.forEach((data, index) => {
          fieldsList?.forEach((field) => {
            setFieldValue(
              `${field.name}SubForm${index}`,
              getDataObject(data)[field.name]
            );
          });
          setFieldValue(
            `discount-type-discountSubForm${index}`,
            get(data[`discount`], "format.ratio", "")
          );
          setFieldValue(
            `discount-input-discountSubForm${index}`,
            get(data[`discount`], "discount", "")
          );
          setFieldValue(`idSubForm${index}`, data["id"]);
        });
      } else {
        setTotalSubForms(1);
        fieldsList?.forEach((field) => {
          setFieldValue(`${field.name}SubForm${0}`, null);
        });
        setFieldValue(`discount-type-discountSubForm${0}`, null);
        setFieldValue(`discount-input-discountSubForm${0}`, null);
        setFieldValue(`idSubForm${0}`, null);
      }
    }
  }, [subFormDataForId, subFormData]);

  React.useEffect(() => {
    if (
      subFormDataForId &&
      subFormDataForId?.length > 0 &&
      subFormData &&
      Object.keys(subFormData)?.length > 0
    ) {
      const subFormModelName = Object.keys(subFormData)[0];
      if (
        ["quotedItem", "orderedItem", "invoicedItem", "purchaseItem"].includes(
          subFormModelName
        )
      ) {
        setFieldValue(`adjustmentSummarySection`, data[`adjustment`]);
        setFieldValue(`taxesSummarySection`, data["taxes"]);
        setFieldValue(
          `discount-type-discountSummarySection`,
          get(data["discount"], "format.ratio", "")
        );
        setFieldValue(
          `discount-input-discountSummarySection`,
          get(data[`discount`], "discount", "")
        );
        setFieldValue(`discountSummarySection`, data["discount"]);
      }
    }
  }, [subFormDataForId, subFormData, data]);

  React.useEffect(() => {
    if (formResetted) {
      {
        range(0, (totalSubForms ?? 1) + 1).forEach((num: number) => {
          subFormData &&
            Object.keys(subFormData)?.length > 0 &&
            Object.keys(subFormData)?.forEach((data) =>
              subFormData[data]?.fieldsList?.forEach((field: ICustomField) =>
                setFieldValue(
                  `${field.name}SubForm${num}`,
                  getInitialValueForField(field)
                )
              )
            );
        });
      }
      setTotalSubForms(1);
    }
  }, [formResetted]);

  return (
    <div
      className={`${
        subFormData && Object.keys(subFormData)?.length > 0 ? "" : "hidden"
      } ${
        formCustomization ? "col-span-11" : "col-span-12"
      } w-full flex items-center justify-center px-6`}
    >
      <GenericHeaderCardContainer
        cardHeading={
          currentModule?.reverseLookups?.find((revereseLookup) => {
            let subFormModelReverseLookupName =
              modelName === "quote"
                ? "quotedItem"
                : modelName === "invoice"
                ? "invoicedItem"
                : modelName === "salesOrder"
                ? "orderedItem"
                : modelName === "purchaseOrder"
                ? "purchaseItem"
                : "";
            if (revereseLookup?.moduleName === subFormModelReverseLookupName)
              return revereseLookup;
            else undefined;
          })?.displayedAs?.en ?? ""
        }
        extended={true}
      >
        <div className={`flex flex-col gap-y-4`}>
          {range(0, totalSubForms).map((num: number) => {
            return (
              <div
                key={num}
                className={`w-full grid grid-cols-12 pb-4 border-b-[2px] border-dotted border-gray-300`}
              >
                <div
                  className={`w-full h-full flex items-center justify-center`}
                >
                  <span className="border rounded-md px-2 text-lg bg-gray-100">
                    {num + 1}
                  </span>
                </div>
                {subFormData &&
                  Object.keys(subFormData)?.length > 0 &&
                  Object.keys(subFormData)?.map((data) => {
                    return (
                      <div
                        key={data}
                        className={`${
                          subFormData[data]?.fieldsList ? "" : "hidden"
                        } flex flex-wrap gap-x-6 w-full overflow-x-scroll px-6 col-span-10 rounded-lg bg-vryno-light-fade-blue`}
                      >
                        {subFormData[data]?.fieldsList?.flatMap(
                          (field: ICustomField, index) => {
                            if (
                              field.dataType === "relatedTo" ||
                              ((field.name === "quoteId" ||
                                field.name === "invoiceId" ||
                                field.name === "salesOrderId" ||
                                field.name === "purchaseId") &&
                                field.systemDefined)
                            )
                              return null;
                            if (
                              (field.visible &&
                                field.mandatory &&
                                field.addInForm &&
                                !field.readOnly) ||
                              (field.visible &&
                                field.addInForm &&
                                !field.readOnly &&
                                field.showInQuickCreate)
                            ) {
                              return (
                                <SpecialSubForm
                                  index={index}
                                  num={num}
                                  field={field}
                                  currentFormLayer={currentFormLayer}
                                  isSample={isSample}
                                  data={data}
                                  subFormData={subFormData}
                                  dependingModuleFields={dependingModuleFields}
                                  values={values}
                                  editMode={editMode}
                                  formResetted={formResetted}
                                  genericModels={genericModels}
                                  formDetails={formDetails}
                                  resetComponentLoadIndex={
                                    resetComponentLoadIndex
                                  }
                                  countryCodeInUserPreference={
                                    countryCodeInUserPreference
                                  }
                                  setCurrentFormLayer={setCurrentFormLayer}
                                  setFieldValue={setFieldValue}
                                  setResetComponentLoadIndex={
                                    setResetComponentLoadIndex
                                  }
                                />
                              );
                            }
                            return [];
                          }
                        )}
                      </div>
                    );
                  })}
                <div className="col-span-1 flex flex-col gap-y-3 items-center justify-center">
                  <Button
                    id="subform-delete"
                    customStyle={`border h-10 w-10 rounded-md flex items-center justify-center cursor-pointer bg-gray-100 ${
                      totalSubForms === 1 ? "hidden" : ""
                    }`}
                    onClick={() => {
                      handleSubtractSubForm({
                        num,
                        totalSubForms,
                        subFormData,
                        values,
                        setTotalSubForms,
                        setFieldValue,
                      });
                      setResetComponentLoadIndex(true);
                    }}
                    userEventName="conditions-form-delete"
                    renderChildrenOnly={true}
                  >
                    <DeleteIcon size={24} className="text-vryno-delete-icon" />
                  </Button>
                  <Button
                    id="subform-add"
                    customStyle="border h-10 w-10 rounded-md flex items-center justify-center cursor-pointer bg-gray-100"
                    onClick={() => {
                      handleAddSubForm({
                        num,
                        totalSubForms,
                        subFormData,
                        values,
                        setTotalSubForms,
                        setFieldValue,
                      });
                      setResetComponentLoadIndex(true);
                    }}
                    userEventName="conditions-form-add:action-click"
                    renderChildrenOnly={true}
                  >
                    <AddIcon
                      size={24}
                      className="text-vryno-theme-light-blue"
                    />
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="flex w-full items-center justify-end">
            {subFormData &&
              Object.keys(subFormData)?.length > 0 &&
              Object.keys(subFormData)?.map((data) => {
                return (
                  <div
                    key={data}
                    className={`${
                      subFormData[data]?.summarySection ? "" : "hidden"
                    } w-full sm:w-1/2 md:w-1/3 rounded-lg bg-vryno-light-fade-blue px-6`}
                  >
                    {subFormData[data]?.summarySection
                      ?.map(
                        (field: {
                          aggregation_method: string;
                          expression: string;
                          fieldsUsed: [string];
                          displayAs: { en: string };
                          module_name: string;
                          name: string;
                          value: string | number | null | undefined;
                          format: {
                            type: string;
                            precision: number;
                            ratio: string;
                          };
                        }) => {
                          return {
                            ...field,
                            expression:
                              field.name === "subTotal"
                                ? "quotedItem.total"
                                : field.name === "grandTotal"
                                ? "quotedItem.total"
                                : field.expression,
                          };
                        }
                      )
                      ?.flatMap((field: FieldType, index) => {
                        const variableRegex = /\b[a-zA-Z_.][a-zA-Z0-9_.]*\b/g;
                        return (
                          <SpecialSubFormSummarySectionForm
                            index={index}
                            values={values}
                            field={field}
                            dependingModuleFields={dependingModuleFields}
                            editMode={editMode}
                            totalSubForms={totalSubForms}
                            variableRegex={variableRegex}
                          />
                        );
                      })}
                  </div>
                );
              })}
          </div>
        </div>
      </GenericHeaderCardContainer>
    </div>
  );
};
