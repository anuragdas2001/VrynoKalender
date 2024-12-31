import React from "react";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../models/shared";
import { FormikState, FormikValues, useFormikContext } from "formik";
import { CustomViewFiltersComponent } from "./CustomViewFiltersComponent";
import { IndexExpressionMapper } from "./customViewHelpers/customViewShared";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import {
  handleConditionListChangeFunction,
  handleFilterChangeFunction,
  handleRemoveClickFunction,
} from "./customViewHelpers/customFilterHelper";

export const CustomViewConditionsFilterContainer = ({
  resetForm,
  conditionList,
  fieldsList,
  modelName,
  editMode,
  setConditionList,
  convertToBoolean,
  uniqueCustomName,
  hideExpression = false,
  hideOperator = false,
  datatypeOperatorDict,
  hideResetCondition = false,
  excludedName = [""],
  disableFieldSelect = false,
  disableFieldAdd = false,
  userPreferences,
  disableDatatypeMetadataModification = false,
}: {
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
  conditionList: ICriteriaFilterRow[];
  fieldsList: ICustomField[];
  modelName: string;
  editMode: boolean;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  convertToBoolean: boolean;
  uniqueCustomName: string;
  hideExpression?: boolean;
  hideOperator?: boolean;
  datatypeOperatorDict: Record<
    string,
    {
      value: string;
      label: string;
    }[]
  >;
  hideResetCondition?: boolean;
  excludedName?: string[];
  disableFieldSelect?: boolean;
  disableFieldAdd?: boolean;
  userPreferences: IUserPreference[];
  disableDatatypeMetadataModification?: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [selectedDropdown, setSelectedDropdown] = React.useState<string[]>();
  const [selectedField, setSelectedField] = React.useState<ICustomField[]>();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    setConditionList(handleFilterChangeFunction(e, index, conditionList));
  };

  const handleAddClick = () => {
    setConditionList([
      ...conditionList,
      {
        [`fieldName${uniqueCustomName}`]: "",
        [`value${uniqueCustomName}`]: "",
      },
    ]);
  };

  const handleRemoveClick = (index: number) => {
    const removeClickValues = handleRemoveClickFunction(
      index,
      conditionList,
      uniqueCustomName
    );
    setConditionList(removeClickValues);
    return removeClickValues;
  };

  const updateSelectedFieldsList = (conditionList: ICriteriaFilterRow[]) => {
    const [stDropdown, stField] = handleConditionListChangeFunction(
      conditionList,
      fieldsList,
      uniqueCustomName
    );
    setSelectedDropdown(stDropdown);
    setSelectedField(stField);
  };

  const resetCustomViewCondition = () => {
    setConditionList([
      {
        [`fieldName${uniqueCustomName}`]: "",
        [`value${uniqueCustomName}`]: "",
      },
    ]);
  };

  React.useEffect(() => {
    updateSelectedFieldsList(conditionList);
    if (hideExpression) return;
    let expressionPattern = "";
    conditionList.forEach(
      (
        item: ICriteriaFilterRow,
        index: number,
        conditionList: ICriteriaFilterRow[]
      ) =>
        conditionList[index] &&
        conditionList[index][`operator${uniqueCustomName}${index}`]
          ? (expressionPattern += "( ")
          : (expressionPattern += "")
    );
    conditionList.forEach(
      (
        item: ICriteriaFilterRow,
        index: number,
        conditionList: ICriteriaFilterRow[]
      ) => {
        index === 0 &&
          item[`logicalOperatorNot${uniqueCustomName}`] &&
          setFieldValue(
            `logicalOperatorNot${uniqueCustomName}`,
            item[`logicalOperatorNot${uniqueCustomName}`] === "NOT" ? "NOT" : ""
          );
        expressionPattern += `${
          index === 0 && item[`logicalOperatorNot${uniqueCustomName}`] === "NOT"
            ? "not "
            : ""
        }${
          conditionList[index] &&
          conditionList[index][`operator${uniqueCustomName}${index}`]
            ? `${IndexExpressionMapper[index + 1]} )`
            : ""
        }${
          conditionList[index + 1] &&
          conditionList[index + 1][`operator${uniqueCustomName}${index + 1}`]
            ? ` ${String(
                item[`logicalOperator${uniqueCustomName}${index}`]
              ).toLowerCase()}`
            : ""
        } `;
      }
    );
    setFieldValue(`expression${uniqueCustomName}`, expressionPattern);
  }, [conditionList]);

  return (
    <>
      {hideExpression ? (
        <></>
      ) : (
        <FormInputBox
          name={`expression${uniqueCustomName}`}
          label="Expression Pattern"
          disabled={true}
        />
      )}
      {hideResetCondition ? (
        <></>
      ) : (
        <div className="w-full flex gap-x-4 items-center my-3">
          <span className="font-medium text-sm">Conditions</span>
          <Button
            id="custom-view-reset-condition"
            customStyle="text-vryno-theme-light-blue underline"
            customFontSize="text-xs"
            onClick={() => {
              let resetValues = {};
              for (const key in values) {
                if (
                  !excludedName.includes(key) &&
                  !key.includes(`expression${uniqueCustomName}`) &&
                  !key.includes(`name${uniqueCustomName}`) &&
                  !key.includes(`operator${uniqueCustomName}`) &&
                  !key.includes(`value${uniqueCustomName}`) &&
                  !key.includes(`logicalOperator${uniqueCustomName}`) &&
                  !key.includes(`logicalOperatorNot${uniqueCustomName}`)
                ) {
                  resetValues = { ...resetValues, [key]: values[key] };
                }
              }
              resetForm({
                values: {
                  ...resetValues,
                },
              });
              resetCustomViewCondition();
              setFieldValue(`expression${uniqueCustomName}`, "");
            }}
            userEventName={`customView-${uniqueCustomName}-resetCondition:click`}
          >
            reset condition
          </Button>
        </div>
      )}
      <div className="w-full grid grid-cols-12 grid-rows-1 items-center gap-x-1 mb-1.5">
        <hr className="bg-gray-200 col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-5" />
        <div className="col-span-4 md:col-span-2 lg:col-span-4 xl:col-span-2 max-w-[115px] m-auto">
          <FormDropdown
            name={`logicalOperatorNot${uniqueCustomName}`}
            placeholder="N/A"
            options={[
              { value: "N/A", label: "N/A" },
              { value: "NOT", label: "NOT" },
            ]}
            onChange={(selectedOption) => {
              handleFilterChange(selectedOption, 0);
              setFieldValue(
                `logicalOperatorNot${uniqueCustomName}`,
                selectedOption.currentTarget.value === "N/A"
                  ? ""
                  : selectedOption.currentTarget.value
              );
            }}
            dropdownType={"thin"}
            allowMargin={false}
            disabled={false}
          />
        </div>
        <hr className="bg-gray-200 col-span-4 md:col-span-5 lg:col-span-4 xl:col-span-5" />
      </div>
      <CustomViewFiltersComponent
        selectedDropdown={selectedDropdown}
        selectedField={selectedField}
        conditionList={conditionList}
        uniqueCustomName={uniqueCustomName}
        fieldsList={fieldsList}
        handleAddClick={handleAddClick}
        handleFilterChange={handleFilterChange}
        updateSelectedFieldsList={updateSelectedFieldsList}
        handleRemoveClick={handleRemoveClick}
        setConditionList={setConditionList}
        modelName={modelName}
        editMode={editMode}
        convertToBoolean={convertToBoolean}
        hideOperator={hideOperator}
        datatypeOperatorDict={datatypeOperatorDict}
        disableFieldSelect={disableFieldSelect}
        disableFieldAdd={disableFieldAdd}
        disableDatatypeMetadataModification={
          disableDatatypeMetadataModification
        }
        userPreferences={userPreferences}
      />
    </>
  );
};
