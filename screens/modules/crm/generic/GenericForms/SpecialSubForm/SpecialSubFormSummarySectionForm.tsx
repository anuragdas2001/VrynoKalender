import React from "react";
import FormQuoteTax from "../../../../../../components/TailwindControls/Form/QuoteTax/FormQuoteTax";
import {
  calculateTaxValue,
  getLookupOptions,
} from "../../../../../../components/TailwindControls/Form/QuoteTax/QuoteTax";
import FormQuoteDiscount from "../../../../../../components/TailwindControls/Form/QuoteDiscount/FormQuoteDiscount";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { get, range } from "lodash";
import { SupportedLabelLocations } from "../../../../../../components/TailwindControls/SupportedLabelLocations";
import { FormikValues } from "formik";
import { ICustomField } from "../../../../../../models/ICustomField";
import { FieldType } from "./SpecialSubFormWrapper";

export type SpecialSubFormSummarySectionFormProps = {
  index: number;
  values: FormikValues;
  field: FieldType;
  dependingModuleFields?: ICustomField[];
  editMode: boolean;
  totalSubForms?: number;
  variableRegex: RegExp;
};

export const SpecialSubFormSummarySectionForm = ({
  index,
  values,
  field,
  dependingModuleFields,
  editMode,
  totalSubForms,
  variableRegex,
}: SpecialSubFormSummarySectionFormProps) => {
  return (
    <div key={`field_${index}`} className={`w-full`}>
      {field.name === "taxes" ? (
        <FormQuoteTax
          name={`${field.name}SummarySection`}
          label={field.displayAs["en"] ?? ""}
          dependingModuleFields={dependingModuleFields}
          modelName={"product"}
          calculateValueOn={values[`subTotalSummarySection`]}
          labelLocation={SupportedLabelLocations.OnLeftSide}
          externalOptions={
            dependingModuleFields &&
            dependingModuleFields?.filter(
              (field) => field.name === "productTaxIds"
            )?.length > 0
              ? getLookupOptions(
                  dependingModuleFields?.filter(
                    (field) => field.name === "productTaxIds"
                  )[0]?.dataTypeMetadata?.lookupOptions
                )
              : getLookupOptions([])
          }
        />
      ) : field.name === "discount" ? (
        <FormQuoteDiscount
          labelLocation={SupportedLabelLocations.OnLeftSide}
          name={`${field.name}SummarySection`}
          required={false}
          label={field?.displayAs?.en}
          editMode={editMode}
          disabled={false}
          calculateValueOn={
            values[`subTotalSummarySection`] +
            (calculateTaxValue(values[`taxesSummarySection`]) ?? 0)
          }
        />
      ) : (
        <FormInputBox
          name={`${field?.name}SummarySection`}
          label={field?.displayAs?.en}
          labelLocation={SupportedLabelLocations?.OnLeftSide}
          precision={get(field?.format, "precision", 0)}
          additionalValueToRemove={
            field.name === "grandTotal"
              ? (calculateTaxValue(values[`taxesSummarySection`]) ?? 0) +
                Number(-get(values["discountSummarySection"], "amount", 0))
              : 0
          }
          type={"number"}
          disabled={field?.name !== "adjustment" ? true : false}
          externalExpressionToCalculateValue={
            field?.expression
              ? String(
                  range(0, totalSubForms).reduce((accumulator, num) => {
                    return (
                      accumulator +
                      `${field?.expression.replace(
                        variableRegex,
                        (match: string) =>
                          match.includes("quotedItem.")
                            ? match.replace("quotedItem.", "") + `SubForm${num}`
                            : " - + "
                      )} ${num + 1 === totalSubForms ? "" : " + "}`
                    );
                  }, "")
                ) +
                `${
                  field.name === "grandTotal"
                    ? " + adjustmentSummarySection"
                    : ""
                }`
              : ""
          }
        />
      )}
    </div>
  );
};
