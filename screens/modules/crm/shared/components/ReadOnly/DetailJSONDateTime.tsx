import _ from "lodash";
import { NoDataControl } from "./NoDataControl";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { operationDaysOptions } from "../../../../../../components/TailwindControls/Form/JSONDateTimePicker/JSONDateTimePicker";

export const DetailJSONDateTime = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  displayType,
}: Pick<
  DetailFieldPerDataTypeProps,
  "data" | "field" | "truncateData" | "fontSize" | "fontColor" | "displayType"
>) => {
  const parentFieldsList = _.get(field.field, "parentFieldsList", []);
  const executorField =
    _.get(data, "executorField", "") === "triggeredDate"
      ? { label: { en: "Triggered date" } }
      : parentFieldsList?.length > 0
      ? parentFieldsList.find(
          (field) => field.name === _.get(data, "executorField", "")
        )
      : {};
  const beforeAfterType =
    _.get(_.get(data, "adjust", {}), "type", "") === "after"
      ? "plus"
      : _.get(_.get(data, "adjust", {}), "type", "") === "before"
      ? "minus"
      : "";
  const beforeAfterOperateOn = operationDaysOptions?.find((option) =>
    Object.keys(_.get(data, "adjust", {})).includes(option.value)
  );

  const beforeAfterOperateOnValue = _.get(
    _.get(data, "adjust", {}),
    beforeAfterOperateOn?.value ?? "",
    ""
  );

  const fieldValue =
    _.get(executorField?.label, "en", "") +
    " " +
    beforeAfterType +
    " " +
    beforeAfterOperateOnValue +
    " " +
    _.get(beforeAfterOperateOn, "label", "");

  return (
    <p
      className={`whitespace-pre-line ${displayType} ${
        fontSize.value
      } ${fontColor} ${truncateData ? "truncate" : "break-words"}`}
      data-testid={field.label}
      title={fieldValue}
    >
      {!fieldValue.trim() ? <NoDataControl fontSize={fontSize} /> : fieldValue}
    </p>
  );
};
