import React from "react";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { PieChartGraph } from "./PieChartGraph";
import { FormikValues, useFormikContext } from "formik";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { ICustomView } from "../../../../../../../models/shared";
import { getFieldsForModuleViewId } from "../Utils/getFieldsForModuleViewId";
import { calculateModuleDataForPieChart } from "../Utils/calculateModuleDataForPieChart";

export type PieChartGraphWrapperProps = {
  chartName: string;
  fieldsList: ICustomField[];
  customViewList: ICustomView[];
  moduleData: any[];
  valueOfModuleViewId: string;
  valueFieldList: {
    fieldName: string;
    operationType: string | null;
  }[];
};

export const PieChartGraphWrapper = ({
  chartName,
  fieldsList,
  customViewList,
  moduleData = [],
  valueOfModuleViewId,
  valueFieldList = [],
}: PieChartGraphWrapperProps) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const filteredFieldsList: {
    value: string;
    label: string;
    dataType: string;
  }[] =
    valueOfModuleViewId && customViewList?.length > 0
      ? getFieldsForModuleViewId(
          fieldsList,
          customViewList,
          valueOfModuleViewId
        )?.filter((field) => field)
      : fieldsList
          ?.map((field) => {
            return {
              label: field.label.en,
              value: field.name,
              dataType: field.dataType,
            };
          })
          ?.filter((field) => field);

  return (
    <div className="col-span-2 border border-gray-200 rounded-lg px-4 py-2">
      <p className="text-gray-400">{chartName}</p>
      <div className="w-full flex flex-col gap-y-2">
        <div className="">
          {valueFieldList?.map((field, index) => (
            <div className="flex flex-row gap-x-4" key={index}>
              <FormDropdown
                name={`graph-groupby-field-name${index}`}
                label="Select field"
                options={filteredFieldsList}
                onChange={(selectedOption: any) => {
                  const findIndex = filteredFieldsList?.findIndex(
                    (field) =>
                      field.value === selectedOption.currentTarget.value
                  );
                  setFieldValue(
                    `graph-groupby-field-name${index}`,
                    selectedOption.currentTarget.value
                  );
                  setFieldValue(
                    `graph-groupby-field-dataType${index}`,
                    filteredFieldsList[findIndex].dataType
                  );
                  setFieldValue(
                    `graph-groupby-field-label${index}`,
                    filteredFieldsList[findIndex].label
                  );
                  setFieldValue(
                    `graph-groupby-field-OperationType${index}`,
                    "countAbsolute"
                  );
                }}
              />
              <FormDropdown
                name={`graph-groupby-field-OperationType${index}`}
                label="Type"
                options={[
                  { label: "Count", value: "countAbsolute" },
                  { label: "Count Percentage", value: "countPercentage" },
                ]}
                onChange={(selectedOption: any) => {
                  setFieldValue(
                    `graph-groupby-field-OperationType${index}`,
                    selectedOption.currentTarget.value
                  );
                }}
              />
            </div>
          ))}
        </div>
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center">
          <PieChartGraph
            data={
              values[`graph-groupby-field-name${valueFieldList?.length - 1}`]
                ? [
                    { name: "Group A", value: 400 },
                    { name: "Group B", value: 300 },
                    { name: "Group C", value: 300 },
                    { name: "Group D", value: 200 },
                  ]
                : []
            }
            cy={40}
            fieldsList={fieldsList}
            allowDataManipulation={false}
            containerHeight={220}
            legendBackgroundColor={"rgb(243 244 246 / var(--tw-bg-opacity)"}
          />
        </div>
      </div>
    </div>
  );
};
