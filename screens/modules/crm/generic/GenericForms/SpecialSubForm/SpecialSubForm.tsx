import React from "react";
import FormQuoteTax from "../../../../../../components/TailwindControls/Form/QuoteTax/FormQuoteTax";
import FormQuoteDiscount from "../../../../../../components/TailwindControls/Form/QuoteDiscount/FormQuoteDiscount";
import FormSearchBox from "../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import {
  defaultOnSearchIconClick,
  fieldSpecificAppAndModel,
  retainDefaultValues,
  searchByDisplayExpression,
  searchByHelper,
} from "../../../shared/components/Form/FormFields/recordLookupHelpers";
import { get } from "lodash";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";
import { calculateTaxValue } from "../../../../../../components/TailwindControls/Form/QuoteTax/QuoteTax";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FormikErrors, FormikValues } from "formik";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SubformDataType } from "../Shared/genericFormProps";

export type SpecialSubFormProps = {
  index: number;
  num: number;
  field: ICustomField;
  dependingModuleFields?: ICustomField[];
  values: FormikValues;
  editMode: boolean;
  formResetted?: boolean;
  genericModels: IGenericModel;
  formDetails: {
    type: string;
    modelName: string;
    appName: string;
  };
  resetComponentLoadIndex: boolean;
  currentFormLayer: boolean;
  isSample: boolean;
  subFormData: SubformDataType | undefined;
  data: string;
  countryCodeInUserPreference: string;
  setResetComponentLoadIndex: (value: boolean) => void;
  setCurrentFormLayer: (value: boolean) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<FormikValues>>;
};

export const SpecialSubForm = ({
  index,
  num,
  field,
  currentFormLayer,
  isSample,
  data,
  subFormData,
  dependingModuleFields,
  values,
  editMode,
  formResetted,
  genericModels,
  formDetails,
  resetComponentLoadIndex,
  countryCodeInUserPreference,
  setCurrentFormLayer,
  setFieldValue,
  setResetComponentLoadIndex,
}: SpecialSubFormProps) => {
  return (
    <div
      key={`field_${index}`}
      className={`${
        field.dataType == "number" || field.dataType == "expression"
          ? "w-[100px]"
          : field.dataType
          ? "w-[250px]"
          : "min-w-[250px]"
      }`}
    >
      {field.dataType === "jsonArray" ? (
        <FormQuoteTax
          name={`${field.name}SubForm${num}`}
          label={field.label["en"] ?? ""}
          optionsFromFieldName={`productTaxIds`}
          dependingModuleFields={dependingModuleFields}
          modelName={"product"}
          valueToFetchAgainst={values[`productIdSubForm${num}`]}
          fieldsToFetch={["productCategoryId", "productTaxIds", "taxable"]}
          editMode={values[`idSubForm${num}`] ? true : false}
          calculateValueOn={values[`amountSubForm${num}`]}
        />
      ) : field.dataType === "json" ? (
        <FormQuoteDiscount
          name={`${field.name}SubForm${num}`}
          required={field.mandatory}
          label={field.label["en"] ?? ""}
          editMode={editMode}
          disabled={false}
          calculateValueOn={
            values[`amountSubForm${num}`] +
            (calculateTaxValue(values[`taxesSubForm${num}`]) ?? 0)
          }
        />
      ) : field.name === "productId" ? (
        <FormSearchBox
          name={`${field.name}SubForm${num}`}
          fieldIndex={index}
          required={field.mandatory}
          label={field.label["en"] ?? ""}
          appName={
            fieldSpecificAppAndModel({
              ...field,
              name: `${field.name}SubForm${num}`,
            })[0]
          }
          modelName={
            fieldSpecificAppAndModel({
              ...field,
              name: `${field.name}SubForm${num}`,
            })[1]
          }
          parentModelName={formDetails?.modelName}
          editMode={editMode}
          allowMargin={true}
          externalExpressionToCalculateValue={field.expression}
          formResetted={formResetted}
          searchBy={searchByHelper(
            {
              ...field,
              name: `${field.name}SubForm${num}`,
            },
            genericModels
          )}
          fieldDisplayExpression={searchByDisplayExpression({
            ...field,
            name: `${field.name}SubForm${num}`,
          })}
          field={{
            ...field,
            name: `${field.name}SubForm${num}`,
          }}
          defaultOnSearchIconClick={defaultOnSearchIconClick({
            ...field,
            name: `${field.name}SubForm${num}`,
          })}
          retainDefaultValues={retainDefaultValues({
            ...field,
            name: `${field.name}SubForm${num}`,
          })}
          setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
          handleItemSelect={(item) => {
            if (item?.length <= 0) {
              (subFormData as SubformDataType)[data]?.fieldsList?.forEach(
                (field) => setFieldValue(`${field.name}SubForm${num}`, null)
              );
              return;
            }
            setFieldValue(
              `listPriceSubForm${num}`,
              get(item[0].values, "unit_price", null) ??
                get(item[0].values, "unitPrice", null)
            );
            setFieldValue(`quantitySubForm${num}`, 1);
            setFieldValue(
              `descriptionSubForm${num}`,
              get(item[0].values, "description", null)
            );
          }}
          resetComponentLoadIndex={resetComponentLoadIndex}
          setResetComponentLoadIndex={setResetComponentLoadIndex}
        />
      ) : (
        <FormFieldPerDataType
          modelName={data}
          field={{
            ...field,
            name: `${field.name}SubForm${num}`,
            dataTypeMetadata: {
              ...field?.dataTypeMetadata,
            },
          }}
          fieldList={(subFormData as SubformDataType)[data]?.fieldsList}
          additionalValueToRemove={
            field.dataType === "expression" && field.name === "total"
              ? (calculateTaxValue(values[`taxesSubForm${num}`]) ?? 0) -
                get(values[`discountSubForm${num}`], "amount", 0)
              : 0
          }
          formulaExpressionToShow={
            field.name === "amount"
              ? "quotedItem.listPrice * quotedItem.quantity"
              : field.name === "total"
              ? "quotedItem.amount + quotedItem.taxes + quotedItem.adjustment - quotedItem.discount"
              : field.dataTypeMetadata?.expression
          }
          additionalFieldName={`SubForm${num}`}
          setValuesForFields={[
            {
              fetchField: `unitPrice`,
              setValueForField: `listPrice`,
            },
            {
              fetchField: `description`,
              setValueForField: `description`,
            },
          ]}
          replaceFromExpression={`${data}.`}
          isSample={isSample}
          setFieldValue={setFieldValue}
          editMode={editMode}
          index={index}
          countryCodeInUserPreference={countryCodeInUserPreference}
          values={values}
          formResetted={formResetted}
          disabled={false}
          currentFormLayer={currentFormLayer}
          setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
          retainDefaultValue={field.name === "productId" ? true : false}
        />
      )}
    </div>
  );
};
