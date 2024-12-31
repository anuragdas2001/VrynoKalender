import React from "react";
import { NoDataControl } from "./NoDataControl";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { calculateTaxValue } from "../../../../../../components/TailwindControls/Form/QuoteTax/QuoteTax";

export const DetailJsonArrayControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  viewType = "Card",
  displayType,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "viewType"
  | "displayType"
>) => {
  const dataToDisplay = data[field.value]
    ? calculateTaxValue(data[field.value])
    : "";
  const jsonArrayData = data?.[field?.value] ?? null;
  if (
    (field?.field?.moduleName === "quotedItem" ||
      field?.field?.moduleName === "quote" ||
      field?.field?.moduleName === "salesOrder" ||
      field?.field?.moduleName === "purchaseOrder" ||
      field?.field?.moduleName === "orderedItem" ||
      field?.field?.moduleName === "invoice" ||
      field?.field?.moduleName === "invoicedItem" ||
      field?.field?.moduleName === "purchaseItem") &&
    field.value === "taxes"
  ) {
    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "break-all whitespace-pre-line"
        }`}
      >
        {jsonArrayData ? (
          calculateTaxValue(jsonArrayData)
        ) : (
          <NoDataControl fontSize={fontSize} />
        )}
      </p>
    );
  }
  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        viewType === "List" || truncateData
          ? "truncate"
          : "break-all whitespace-pre-line"
      }`}
      title={`${dataToDisplay}`}
      data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
    >
      {dataToDisplay || <NoDataControl fontSize={fontSize} />}
      Support not added for this field
    </p>
  );
};
