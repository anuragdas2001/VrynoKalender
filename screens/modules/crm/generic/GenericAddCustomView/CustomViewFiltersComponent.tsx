import _, { get } from "lodash";
import React from "react";
import { useFormikContext } from "formik";
import { CustomViewValueField } from "./CustomViewValueField";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../models/shared";
import { CustomViewFiltersLogicalOperator } from "./CustomViewFiltersLogicalOperator";
import { getObjectValueLabelFieldList } from "../../shared/utils/getOrderedFieldsList";
import { datatypeOperatorSymbolDict } from "../../../../../shared/datatypeOperatorDict";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { getDictionaryOptionsForFilters } from "../../shared/utils/getDictionaryOptionsForFilters";
import {
  IndexExpressionMapper,
  logicalOperatorDropDown,
} from "./customViewHelpers/customViewShared";

export const CustomViewFiltersComponent = ({
  selectedDropdown,
  selectedField,
  conditionList,
  uniqueCustomName,
  fieldsList,
  handleAddClick,
  handleFilterChange,
  updateSelectedFieldsList,
  handleRemoveClick,
  setConditionList,
  modelName,
  editMode,
  convertToBoolean,
  hideOperator,
  datatypeOperatorDict,
  disableFieldSelect,
  disableFieldAdd,
  userPreferences,
  disableDatatypeMetadataModification = false,
}: {
  selectedDropdown: string[] | undefined;
  selectedField: ICustomField[] | undefined;
  conditionList: ICriteriaFilterRow[];
  uniqueCustomName: string;
  fieldsList: ICustomField[];
  handleAddClick: () => void;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  handleRemoveClick: (index: number) => ICriteriaFilterRow[];
  updateSelectedFieldsList: (conditionList: ICriteriaFilterRow[]) => void;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  modelName: string;
  editMode: boolean;
  convertToBoolean: boolean;
  hideOperator: boolean;
  userPreferences: IUserPreference[];
  datatypeOperatorDict: Record<
    string,
    {
      value: string;
      label: string;
    }[]
  >;
  disableFieldSelect: boolean;
  disableFieldAdd: boolean;
  disableDatatypeMetadataModification?: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [fieldName, setFieldName] = React.useState<string>("fieldName");

  React.useEffect(() => {
    if (conditionList?.length > 0) {
      for (let key in conditionList[0]) {
        if (key.includes("fieldName")) {
          setFieldName(key);
          break;
        }
      }
    }
  }, [conditionList]);

  return (
    selectedDropdown &&
    selectedField &&
    conditionList.map((condition, index) => (
      <div className="mb-3 px-2" key={index}>
        <div className="flex mb-1.5 flex-wrap sm:flex-nowrap">
          <div className="mr-2 sm:mr-4 w-[7%] max-w-[48px] sm:w-12 h-[39px] bg-gray-200 flex justify-center items-center rounded-md">
            {IndexExpressionMapper[index + 1]}
          </div>
          <div
            className={`mr-2 sm:mr-4 ${
              values[`logicalOperator${uniqueCustomName}${index}`]
                ? "w-[28%]"
                : "w-[29%]"
            }`}
          >
            <FormDropdown
              name={`fieldName${uniqueCustomName}`}
              required={true}
              disabled={disableFieldSelect}
              placeholder={
                selectedField && selectedField[index]
                  ? selectedField[index].label.en
                  : "Field"
              }
              options={getObjectValueLabelFieldList(
                fieldsList?.filter(
                  (field) => !["recordImage", "image"].includes(field.dataType)
                )
              )}
              onChange={(selectedOption) => {
                setFieldValue(`value${uniqueCustomName}${index}`, null);
                setFieldValue(`operator${uniqueCustomName}${index}`, null);
                if (`value${uniqueCustomName}${index}-between-start`) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}-between-start`,
                    null
                  );
                }
                if (`value${uniqueCustomName}${index}-between-end`) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}-between-end`,
                    null
                  );
                }
                handleFilterChange(selectedOption, index);
                if (
                  conditionList[index]?.[`operator${uniqueCustomName}${index}`]
                ) {
                  const updatedConditionList = conditionList.map(
                    (val: ICriteriaFilterRow, i: number) => {
                      if (i === index) {
                        setFieldValue(
                          `operator${uniqueCustomName}${index}`,
                          undefined
                        );
                        setFieldValue(
                          `value${uniqueCustomName}${index}`,
                          undefined
                        );
                        setFieldValue(
                          `name${uniqueCustomName}${index}`,
                          undefined
                        );
                        if (val[`logicalOperator${uniqueCustomName}${index}`]) {
                          return {
                            [`fieldName${uniqueCustomName}`]:
                              val[`fieldName${uniqueCustomName}`],
                            [`value${uniqueCustomName}`]: "",
                            [`logicalOperator${uniqueCustomName}${index}`]:
                              val[`logicalOperator${uniqueCustomName}${index}`],
                          };
                        }
                        return {
                          [`fieldName${uniqueCustomName}`]:
                            val[`fieldName${uniqueCustomName}`],
                          [`value${uniqueCustomName}`]: "",
                        };
                      } else {
                        return val;
                      }
                    }
                  );
                  setConditionList(updatedConditionList);
                }
              }}
              allowMargin={false}
            />
          </div>

          <div
            className={`mr-2 sm:mr-4 ${
              values[`logicalOperator${uniqueCustomName}${index}`]
                ? "w-[28%]"
                : "w-[29%]"
            }`}
          >
            <FormDropdown
              name={`operator${uniqueCustomName}${index}`}
              required={true}
              disabled={!condition[`fieldName${uniqueCustomName}`]}
              options={
                selectedDropdown &&
                getDictionaryOptionsForFilters(
                  datatypeOperatorDict[selectedDropdown[index]],
                  selectedField,
                  _.get(condition, fieldName, "fieldName"),
                  !disableDatatypeMetadataModification
                )
              }
              onChange={(selectedOption) => {
                handleFilterChange(selectedOption, index);
                setFieldValue(
                  `operator${uniqueCustomName}${index}`,
                  selectedOption.currentTarget.value
                );
                if (values[`value${uniqueCustomName}${index}-between-start`]) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}-between-start`,
                    null
                  );
                } else if (
                  values[`value${uniqueCustomName}${index}-between-end`]
                ) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}-between-end`,
                    null
                  );
                } else if (selectedOption.currentTarget.value.includes("d_")) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}`,
                    datatypeOperatorSymbolDict[
                      selectedOption.currentTarget.value
                    ]
                  );
                } else if (selectedOption.currentTarget.value.includes("is_")) {
                  setFieldValue(
                    `value${uniqueCustomName}${index}`,
                    selectedOption.currentTarget.value === "is_empty"
                      ? "empty"
                      : "not empty"
                  );
                } else if (selectedOption.currentTarget.value === "any_value") {
                  setFieldValue(
                    `value${uniqueCustomName}${index}`,
                    "any_value"
                  );
                } else if (selectedField[index].dataType === "phoneNumber") {
                  if (values[`value${uniqueCustomName}${index}`]) {
                    setFieldValue(
                      `value${uniqueCustomName}${index}`,
                      undefined
                    );
                  } else
                    setFieldValue(`value${uniqueCustomName}${index}`, null);
                } else setFieldValue(`value${uniqueCustomName}${index}`, "");
              }}
              allowMargin={false}
            />
          </div>

          <div
            className={`${
              values[`logicalOperator${uniqueCustomName}${index}`]
                ? "w-[28%]"
                : "w-[29%]"
            }`}
            onKeyPress={(e) => {
              if (e.code === "Enter" || e.code === "NumpadEnter")
                e.preventDefault();
            }}
          >
            <CustomViewValueField
              index={index}
              selectedField={selectedField}
              fieldLabel={
                getObjectValueLabelFieldList(
                  fieldsList?.filter(
                    (field) =>
                      !["recordImage", "image"].includes(field.dataType)
                  )
                )?.find(
                  (field) =>
                    field.value ===
                    get(condition, "fieldName", get(condition, "value", ""))
                )?.label
              }
              conditionList={conditionList}
              modelName={modelName}
              editMode={editMode}
              condition={condition}
              convertToBoolean={convertToBoolean}
              disabled={
                values[`operator${uniqueCustomName}${index}`] ? false : true
              }
              uniqueCustomName={uniqueCustomName}
              disableDatatypeMetadataModification={
                disableDatatypeMetadataModification
              }
              userPreferences={userPreferences}
            />
          </div>
          {!disableFieldAdd ? (
            <CustomViewFiltersLogicalOperator
              index={index}
              condition={condition}
              uniqueCustomName={uniqueCustomName}
              conditionList={conditionList}
              handleRemoveClick={handleRemoveClick}
              updateSelectedFieldsList={updateSelectedFieldsList}
              hideOperator={hideOperator}
              handleAddClick={handleAddClick}
            />
          ) : (
            <></>
          )}
        </div>
        {hideOperator ? (
          <></>
        ) : (
          <div className="w-full grid grid-cols-12 grid-rows-1 items-center gap-x-1">
            <hr className="bg-gray-200 col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-5" />
            <div className="col-span-4 md:col-span-2 lg:col-span-4 xl:col-span-2 max-w-[115px] m-auto">
              <FormDropdown
                name={`logicalOperator${uniqueCustomName}${index}`}
                placeholder="Operator"
                options={logicalOperatorDropDown}
                onChange={(selectedOption) => {
                  handleFilterChange(selectedOption, index);
                  setFieldValue(
                    `logicalOperator${uniqueCustomName}${index}`,
                    selectedOption.currentTarget.value
                  );
                }}
                dropdownType={"thin"}
                allowMargin={false}
                disabled={
                  values[`operator${uniqueCustomName}${index}`] &&
                  ((values[`operator${uniqueCustomName}${index}`] ===
                    "between" &&
                    values[`value${uniqueCustomName}${index}-between-start`]) ||
                    values[`value${uniqueCustomName}${index}-between-end`] ||
                    values[`value${uniqueCustomName}${index}`] ||
                    typeof values[`value${uniqueCustomName}${index}`] ==
                      "boolean")
                    ? false
                    : true
                }
              />
            </div>
            <hr className="bg-gray-200 col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-5" />
          </div>
        )}
      </div>
    ))
  );
};
