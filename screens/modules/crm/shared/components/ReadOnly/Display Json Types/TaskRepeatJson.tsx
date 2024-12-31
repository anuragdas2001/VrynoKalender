import React from "react";
import { get } from "lodash";
import { NoDataControl } from "../NoDataControl";
import { DetailFieldPerDataTypeProps } from "../DetailFieldPerDataType";

export const TaskRepeatJson = ({
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
  const repeatFrequencyOptions: any = {
    hf: "Half Hour",
    d: "Daily",
    w: "Weekly",
    m: "Monthly",
    y: "Yearly",
  };
  const repeatTermTypeOptions: any = {
    n: "Never",
    f: "Fixed",
    d: "Date",
  };

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        viewType === "List" || truncateData
          ? "truncate"
          : "break-all whitespace-pre-line"
      }`}
    >
      {field.value === "repeat" ? (
        data[field.value] ? (
          `Frequency: ${
            data[field.value]?.frequency
              ? repeatFrequencyOptions[data[field.value].frequency]
              : "-"
          }, Term: ${
            data[field.value]?.termType
              ? repeatTermTypeOptions[data[field.value].termType]
              : data[field.value].term_type
              ? repeatTermTypeOptions[data[field.value].term_type]
              : "-"
          }, Value: ${
            data[field.value]?.termValue || data[field.value]?.term_value || "-"
          }`
        ) : (
          "-"
        )
      ) : typeof get(data[field.value], "amount") === "number" ? (
        Number(get(data[field.value], "amount"))
      ) : get(data[field.value], "amount") ? (
        get(data[field.value], "amount")
      ) : (
        <NoDataControl fontSize={fontSize} />
      )}
    </p>
  );
};
