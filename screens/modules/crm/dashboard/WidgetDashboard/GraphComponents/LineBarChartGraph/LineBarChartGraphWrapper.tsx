import React from "react";
import FormDropdown from "../../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { ICustomField } from "../../../../../../../models/ICustomField";
import { ICustomView } from "../../../../../../../models/shared";
import { getFieldsForModuleViewId } from "../Utils/getFieldsForModuleViewId";
import { FormikValues, useFormikContext } from "formik";
import { BarGraphChart } from "./BarGraphChart";
import { LineGraphChart } from "./LineGraphChart";
import { InfoMessage } from "../../../../shared/components/InfoMessage";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "../../ConnectedWidgetDashbaord";
import AddCircleFillIcon from "remixicon-react/AddCircleFillIcon";
import IndeterminateCircleFillIcon from "remixicon-react/IndeterminateCircleFillIcon";
import {
  SampelGroupingDataForBarLineGraph,
  SampleMultiMeasureDataForBarLineGraph,
} from "../Utils/sampleDatForGraphs";

export type LineBarChartGraphWrapperProps = {
  chartName: string;
  fieldsList: ICustomField[];
  customViewList: ICustomView[];
  moduleData: any[];
  valueOfModuleViewId: string;
  valueFieldList: ValueFieldListType[];
  valueAgainstFieldList: ValueAgainstFieldListType[];
  modules?: { value: string; label: string }[];
  handleAddGroupByField: () => void;
  handleRemoveGroupByField: (index: number) => void;
  handleAddMeasureField: () => void;
  handleRemoveMeasureField: (index: number) => void;
};

export const LineBarChartGraphWrapper = ({
  chartName,
  fieldsList,
  customViewList,
  moduleData,
  valueOfModuleViewId,
  valueAgainstFieldList,
  valueFieldList,
  modules = [],
  handleAddGroupByField,
  handleAddMeasureField,
  handleRemoveGroupByField,
  handleRemoveMeasureField,
}: LineBarChartGraphWrapperProps) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const numberFieldsAvailable =
    valueOfModuleViewId && customViewList?.length > 0
      ? getFieldsForModuleViewId(
          fieldsList?.filter(
            (field) =>
              field.dataType === "number" || field.dataType === "expression"
          ),
          customViewList,
          valueOfModuleViewId
        )?.filter((field) => field)
      : fieldsList
          ?.filter(
            (field) =>
              field.dataType === "number" || field.dataType === "expression"
          )
          ?.map((field) => {
            return {
              label: field.label.en,
              value: field.name,
              dataType: field.dataType,
            };
          });
  const filteredFieldsList =
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
      {/* {numberFieldsAvailable?.length <= 0 ? (
        <div className="w-full">
          <InfoMessage
            messageType="warning"
            message="No field of number datatype available in this module."
          />
        </div>
      ) : ( */}
      <div className="w-full grid grid-cols-2 gap-x-4">
        <div className="w-full flex flex-col">
          <label className={`text-sm tracking-wide text-vryno-label-gray mt-2`}>
            Measure (Y-axis)
          </label>
          {valueFieldList?.map((field, index) => (
            <div className="grid grid-cols-9" key={index}>
              <div className="col-span-4">
                <FormDropdown
                  name={`graph-groupby-field-name${index}`}
                  options={[
                    {
                      label: `${
                        modules?.filter(
                          (module) => module.value === values["moduleName"]
                        )?.length > 0
                          ? `${
                              modules?.filter(
                                (module) =>
                                  module.value === values["moduleName"]
                              )[0].label
                            }`
                          : `All Records`
                      }`,
                      value: `all`,
                    },
                    ...filteredFieldsList?.filter(
                      (field) =>
                        field?.dataType === "number" ||
                        field?.dataType === "expression"
                    ),
                  ]
                    ?.filter((field) => {
                      if (
                        valueFieldList.filter(
                          (valueField, innerIndex) =>
                            values[`graph-groupby-field-name${innerIndex}`] ===
                              field.value && innerIndex !== index
                        )?.length > 0 ||
                        valueAgainstFieldList.filter(
                          (fielder, innerIndex) =>
                            values[`graph-measure-field-name${innerIndex}`] ===
                            field.value
                        )?.length > 0
                      ) {
                        return null;
                      } else {
                        return field;
                      }
                    })
                    ?.filter((field) => field)}
                  onChange={(selectedOption: any) => {
                    setFieldValue(
                      `graph-groupby-field-name${index}`,
                      selectedOption.currentTarget.value
                    );
                    const findIndex = filteredFieldsList?.findIndex(
                      (field) =>
                        field.value === selectedOption.currentTarget.value
                    );
                    if (findIndex !== -1) {
                      setFieldValue(
                        `graph-groupby-field-OperationType${index}`,
                        filteredFieldsList[findIndex].dataType === "number" ||
                          filteredFieldsList[findIndex].dataType ===
                            "expression"
                          ? "sumAbsolute"
                          : "countAbsolute"
                      );
                      setFieldValue(
                        `graph-groupby-field-dataType${index}`,
                        filteredFieldsList[findIndex].dataType
                      );
                      setFieldValue(
                        `graph-groupby-field-label${index}`,
                        filteredFieldsList[findIndex].label
                      );
                    } else if (selectedOption.currentTarget.value === "all") {
                      setFieldValue(
                        `graph-groupby-field-OperationType${index}`,
                        "countAbsolute"
                      );
                      setFieldValue(
                        `graph-groupby-field-dataType${index}`,
                        null
                      );
                      setFieldValue(
                        `graph-groupby-field-label${index}`,
                        `${
                          modules?.filter(
                            (module) => module.value === values["moduleName"]
                          )?.length > 0
                            ? `${
                                modules?.filter(
                                  (module) =>
                                    module.value === values["moduleName"]
                                )[0].label
                              }`
                            : `All Records`
                        }`
                      );
                    } else {
                      setFieldValue(
                        `graph-groupby-field-OperationType${index}`,
                        null
                      );
                      setFieldValue(
                        `graph-groupby-field-dataType${index}`,
                        null
                      );
                      setFieldValue(`graph-groupby-field-label${index}`, null);
                    }
                    setFieldValue(
                      `graph-groupby-field-OperationType${index}`,
                      selectedOption.currentTarget.value === "all"
                        ? "countAbsolute"
                        : findIndex !== -1
                        ? filteredFieldsList[findIndex].dataType === "number" ||
                          filteredFieldsList[findIndex].dataType ===
                            "expression"
                          ? "sumAbsolute"
                          : "countAbsolute"
                        : null
                    );
                  }}
                />
              </div>
              <div className="col-span-3">
                <FormDropdown
                  name={`graph-groupby-field-OperationType${index}`}
                  options={
                    values[`graph-groupby-field-name${index}`] === "all"
                      ? [{ label: "Count", value: "countAbsolute" }]
                      : [
                          { label: "Sum", value: "sumAbsolute" },
                          { label: "Sum Percentage", value: "sumPercentage" },
                        ]
                  }
                  disabled={!values[`graph-groupby-field-name${index}`]}
                  onChange={(selectedOption: any) => {
                    setFieldValue(
                      `graph-groupby-field-OperationType${index}`,
                      selectedOption.currentTarget.value
                    );
                  }}
                />
              </div>
              {values[`graph-groupby-field-name${index}`] ? (
                <div className="col-span-2 h-full flex items-center justify-center gap-x-1 pl-2">
                  <AddCircleFillIcon
                    data-testid={`add-groupby-field-${index}`}
                    onClick={() => handleAddGroupByField()}
                    size={20}
                    className={`text-gray-400 hover:text-vryno-theme-light-blue cursor-pointer ${
                      valueAgainstFieldList?.length >= 2
                        ? "hidden"
                        : valueFieldList?.length >= 2
                        ? "hidden"
                        : ""
                    }`}
                  />
                  <IndeterminateCircleFillIcon
                    data-testid={`remove-groupby-field-${index}`}
                    onClick={() => handleRemoveGroupByField(index)}
                    size={20}
                    className={`text-gray-400 hover:text-vryno-theme-light-blue cursor-pointer ${
                      valueFieldList?.length < 2 ? "hidden" : ""
                    }`}
                  />
                </div>
              ) : (
                <div className="col-span-2"></div>
              )}
            </div>
          ))}
          <label className={`text-sm tracking-wide text-vryno-label-gray mt-2`}>
            Group by (X-axis)
          </label>
          {valueAgainstFieldList?.map(
            (field: ValueAgainstFieldListType, index: number) => (
              <div className="grid grid-cols-9" key={index}>
                <div className="col-span-7">
                  <FormDropdown
                    name={`graph-measure-field-name${index}`}
                    options={filteredFieldsList
                      ?.filter((field) => {
                        if (
                          valueFieldList.filter(
                            (valueField, innerIndex) =>
                              values[
                                `graph-groupby-field-name${innerIndex}`
                              ] === field.value
                          )?.length > 0 ||
                          valueAgainstFieldList.filter(
                            (fielder, innerIndex) =>
                              values[
                                `graph-measure-field-name${innerIndex}`
                              ] === field.value && innerIndex !== index
                          )?.length > 0
                        ) {
                          return null;
                        } else {
                          return field;
                        }
                      })
                      ?.filter((field) => field)}
                    onChange={(selectedOption: any) => {
                      const findIndex = filteredFieldsList?.findIndex(
                        (field) =>
                          field.value === selectedOption.currentTarget.value
                      );
                      setFieldValue(
                        `graph-measure-field-name${index}`,
                        findIndex !== -1
                          ? selectedOption.currentTarget.value
                          : null
                      );
                      setFieldValue(
                        `graph-measure-field-dataType${index}`,
                        findIndex !== -1
                          ? filteredFieldsList[findIndex].dataType
                          : null
                      );
                      setFieldValue(
                        `graph-measure-field-label${index}`,
                        findIndex !== -1
                          ? filteredFieldsList[findIndex].label
                          : null
                      );
                    }}
                    key={index}
                  />
                </div>
                {values[`graph-measure-field-name${index}`] ? (
                  <div className="col-span-2 h-full flex items-center justify-center gap-x-1 pl-2">
                    <AddCircleFillIcon
                      data-testid={`add-measure-field-${index}`}
                      onClick={() => handleAddMeasureField()}
                      size={20}
                      className={`text-gray-400 hover:text-vryno-theme-light-blue cursor-pointer ${
                        valueFieldList?.length >= 2
                          ? "hidden"
                          : valueAgainstFieldList?.length >= 2
                          ? "hidden"
                          : ""
                      }`}
                    />
                    <IndeterminateCircleFillIcon
                      data-testid={`remove-measure-field-${index}`}
                      onClick={() => handleRemoveMeasureField(index)}
                      size={20}
                      className={`text-gray-400 hover:text-vryno-theme-light-blue cursor-pointer ${
                        valueAgainstFieldList?.length < 2 ? "hidden" : ""
                      }`}
                    />
                  </div>
                ) : (
                  <div className="col-span-2"></div>
                )}
              </div>
            )
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-lg flex justify-center pt-2">
          {values["widgetType"] === "barGraph" ? (
            <BarGraphChart
              data={
                valueAgainstFieldList?.length <= 0 ||
                valueFieldList?.length <= 0 ||
                valueAgainstFieldList?.filter(
                  (field, index) => values[`graph-measure-field-name${index}`]
                )?.length === 0 ||
                valueFieldList.filter(
                  (field, index) => values[`graph-groupby-field-name${index}`]
                )?.length === 0
                  ? []
                  : valueAgainstFieldList?.filter(
                      (field, index) =>
                        values[`graph-measure-field-name${index}`]
                    )?.length > 1 ||
                    valueFieldList.filter(
                      (field, index) =>
                        values[`graph-groupby-field-name${index}`]
                    )?.length > 1
                  ? SampleMultiMeasureDataForBarLineGraph
                  : SampelGroupingDataForBarLineGraph
              }
              allowDataManipulation={false}
              fieldsList={fieldsList}
              changeGraphToStack={
                valueAgainstFieldList?.filter(
                  (field, index) => values[`graph-measure-field-name${index}`]
                )?.length > 1
              }
            />
          ) : values["widgetType"] === "lineGraph" ? (
            <LineGraphChart
              data={
                valueAgainstFieldList?.length <= 0 ||
                valueFieldList?.length <= 0 ||
                valueAgainstFieldList?.filter(
                  (field, index) => values[`graph-measure-field-name${index}`]
                )?.length === 0 ||
                valueFieldList.filter(
                  (field, index) => values[`graph-groupby-field-name${index}`]
                )?.length === 0
                  ? []
                  : valueAgainstFieldList?.filter(
                      (field, index) =>
                        values[`graph-measure-field-name${index}`]
                    )?.length > 1 ||
                    valueFieldList.filter(
                      (field, index) =>
                        values[`graph-groupby-field-name${index}`]
                    )?.length > 1
                  ? SampleMultiMeasureDataForBarLineGraph
                  : SampelGroupingDataForBarLineGraph
              }
              allowDataManipulation={false}
              fieldsList={fieldsList}
              changeGraphToStack={
                valueAgainstFieldList?.filter(
                  (field, index) => values[`graph-measure-field-name${index}`]
                )?.length > 1
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
