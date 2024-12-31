import { NoDataControl } from "../NoDataControl";
import { DetailFieldPerDataTypeProps } from "../DetailFieldPerDataType";
import _ from "lodash";

export const QuoteDiscountJson = ({
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
  const discountData = data?.[field?.value]
    ? typeof data[field.value] === "string"
      ? JSON.parse(data[field.value].replace(/'/g, '"'))
      : data[field.value]
    : null;

  //If want to make generic in future, simply iterate over values and display them using key value, and follow same approach in case of nested object as a value
  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        viewType === "List" || truncateData
          ? "truncate"
          : "break-all whitespace-pre-line"
      }`}
    >
      {_.get(discountData, "amount", 0) ? (
        _.get(discountData, "amount", 0)
      ) : (
        <NoDataControl fontSize={fontSize} />
      )}
    </p>
  );
};

/* discountData ? (
        <>
          Amount: {discountData?.["amount"] || "-"}, Discount:{" "}
          {discountData?.["discount"] || "-"}, Precision:{" "}
          {discountData?.["format"]?.["precision"] || "-"}, Ratio:{" "}
          {discountData?.["format"]?.["ratio"] || "-"}, Type :{" "}
          {discountData?.["format"]?.["type"] || "-"}
        </>
      )
*/
