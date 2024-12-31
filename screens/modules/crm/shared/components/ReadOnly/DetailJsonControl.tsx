import React from "react";
import { NoDataControl } from "./NoDataControl";
import { TaskRepeatJson } from "./Display Json Types/TaskRepeatJson";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { QuoteDiscountJson } from "./Display Json Types/QuoteDiscountJson";

export const DetailJsonControl = ({
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
  if (field?.field?.moduleName === "task" && field?.value === "repeat") {
    return (
      <TaskRepeatJson
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
      />
    );
  }
  if (
    (field?.field?.moduleName === "quotedItem" ||
      field?.field?.moduleName === "quote" ||
      field?.field?.moduleName === "salesOrder" ||
      field?.field?.moduleName === "purchaseOrder" ||
      field?.field?.moduleName === "orderedItem" ||
      field?.field?.moduleName === "invoice" ||
      field?.field?.moduleName === "invoicedItem" ||
      field?.field?.moduleName === "purchaseItem") &&
    field?.value === "discount"
  ) {
    return (
      <QuoteDiscountJson
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
      />
    );
  }
  return <NoDataControl fontSize={fontSize} />;
};
