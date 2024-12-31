import { FormikValues, useFormikContext } from "formik";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { removeFilterValueRectifier } from "./customViewHelpers/customFilterHelper";
import { ICriteriaFilterRow } from "../../../../../models/shared";

export const CustomViewFiltersLogicalOperator = ({
  index,
  condition,
  uniqueCustomName,
  conditionList,
  handleRemoveClick,
  updateSelectedFieldsList,
  hideOperator,
  handleAddClick,
}: {
  index: number;
  condition: ICriteriaFilterRow;
  uniqueCustomName: string;
  conditionList: ICriteriaFilterRow[];
  handleRemoveClick: (index: number) => ICriteriaFilterRow[];
  updateSelectedFieldsList: (conditionList: ICriteriaFilterRow[]) => void;
  hideOperator: boolean;
  handleAddClick: () => void;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  return (
    values[`operator${uniqueCustomName}${index}`] &&
    (values[`value${uniqueCustomName}${index}`] ||
      values[`value${uniqueCustomName}${index}-between-start`] ||
      values[`value${uniqueCustomName}${index}-between-end`] ||
      typeof values[`value${uniqueCustomName}${index}`] == "boolean") &&
    (conditionList.length !== 1 || conditionList.length - 1 === index) && (
      <div className="flex flex-row">
        {conditionList.length !== 1 && (
          <Button
            customStyle="ml-2 sm:ml-4 w-10 h-[39px] border border-vryno-form-border-gray text-vryno-delete-icon text-xl flex justify-center items-center rounded-md cursor-pointer"
            onClick={() => {
              let resetValues: Record<string, FormikValues | null> = {};
              let highest: number = -1;
              for (const key in values) {
                let indexValue = key.includes("between")
                  ? parseInt(key.split("-")[0].slice(-1))
                  : parseInt(key.slice(-1));
                let name = key.includes(`logicalOperator${uniqueCustomName}`)
                  ? `logicalOperator${uniqueCustomName}`
                  : key.includes(`operator${uniqueCustomName}`)
                  ? `operator${uniqueCustomName}`
                  : key.includes("value")
                  ? `value${uniqueCustomName}`
                  : key.includes(`name${uniqueCustomName}`)
                  ? `name${uniqueCustomName}`
                  : "none";
                if (indexValue > highest) highest = indexValue;
                if (!key.includes("hiddenSearchLookup")) {
                  resetValues = removeFilterValueRectifier(
                    name === "none" ? true : false,
                    name,
                    key,
                    index,
                    indexValue,
                    resetValues,
                    values,
                    uniqueCustomName
                  );
                } else {
                  resetValues[key] = null;
                }
              }
              if (
                !resetValues?.[
                  `logicalOperator${uniqueCustomName}${highest - 1}`
                ]
              ) {
                resetValues[
                  `logicalOperator${uniqueCustomName}${highest - 1}`
                ] = null;
              }
              setFieldValue(`value${index}`, null);
              setFieldValue(`value${uniqueCustomName}${index}`, null);
              updateSelectedFieldsList(handleRemoveClick(index));
              for (const key in resetValues) {
                setFieldValue(key, resetValues[key]);
              }
            }}
            id={`custom-filter-remove-${index}`}
            userEventName="customView-condition-filter-remove-click"
          >
            -
          </Button>
        )}
        {hideOperator || conditionList.length - 1 === index ? (
          <Button
            customStyle={`ml-2 sm:ml-4 w-10 h-[39px] border border-vryno-form-border-gray text-vryno-theme-blue text-xl flex justify-center items-center rounded-md cursor-pointer ${
              !hideOperator &&
              !condition[`logicalOperator${uniqueCustomName}${index}`]
                ? "hidden"
                : ""
            }`}
            onClick={() => handleAddClick()}
            id={`custom-filter-add-${index}`}
            userEventName="customView-condition-filter-add-click"
          >
            +
          </Button>
        ) : (
          <></>
        )}
      </div>
    )
  );
};
