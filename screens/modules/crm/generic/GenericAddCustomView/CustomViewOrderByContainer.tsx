import { ChangeEvent } from "react";
import { ICustomField } from "../../../../../models/ICustomField";
import { FormikState, FormikValues, useFormikContext } from "formik";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { getObjectValueLabelFieldList } from "../../shared/utils/getOrderedFieldsList";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";

export const CustomViewOrderByContainer = ({
  resetForm,
  resetOrderBy,
  orderByList,
  handleOrderByChange,
  fieldsList,
  orderDropdown,
  handleOrderByRemoveClick,
  handleOrderByAddClick,
}: {
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
  resetOrderBy: () => void;
  orderByList: Record<string, string>[];
  fieldsList: Array<ICustomField>;
  handleOrderByChange: (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  orderDropdown: {
    value: string;
    label: string;
  }[];
  handleOrderByRemoveClick: (index: number) => void;
  handleOrderByAddClick: () => void;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const fieldsListLabel = getObjectValueLabelFieldList(
    fieldsList?.filter(
      (field) =>
        field.dataType !== "recordImage" &&
        field.dataType !== "image" &&
        field.dataType !== "lookup" &&
        field.dataType !== "recordLookup" &&
        field.dataType !== "multiSelectLookup" &&
        field.dataType !== "multiSelectRecordLookup"
    )
  );

  return (
    <div className="border-b border-vryno-form-border-gray pb-2 mb-3">
      <span className=" font-medium text-sm mt-4">Order By</span>
      <Button
        id="order-by-reset"
        customStyle="py-1.5 px-2 text-vryno-theme-light-blue rounded-md ml-3 my-2 underline"
        customFontSize="text-xs"
        onClick={() => {
          let resetValues = {};
          for (const key in values) {
            if (!key.includes("orderBy")) {
              resetValues = { ...resetValues, [key]: values[key] };
            }
          }
          resetForm({
            values: {
              ...resetValues,
            },
          });
          resetOrderBy();
        }}
        userEventName="customView-orderBy-reset-click"
      >
        reset order by
      </Button>
      {orderByList.map((item, index) => (
        <div className="mb-3" key={index}>
          <div className="flex gap-2 sm:gap-x-4 mb-1.5 flex-wrap sm:flex-nowrap">
            <div className="w-[7%] max-w-[48px] sm:w-12 h-[39px] bg-gray-200 flex justify-center items-center rounded-md">
              {index + 1}
            </div>
            <div className="w-[28%]">
              {fieldsListLabel.filter(
                (field) => item[`orderByName${index}`] === field.value
              )?.length > 0 ? (
                <FormDropdown
                  name={`orderByName${index}`}
                  required={true}
                  placeholder={
                    item[`orderByName${index}`]
                      ? fieldsListLabel.filter(
                          (field) => item[`orderByName${index}`] === field.value
                        )[0].label
                      : "Order by field"
                  }
                  options={fieldsListLabel}
                  onChange={(selectedOption) => {
                    handleOrderByChange(selectedOption, index);
                    setFieldValue(
                      `orderByName${index}`,
                      selectedOption.currentTarget.value
                    );
                  }}
                  allowMargin={false}
                />
              ) : item[`orderByName${index}`] ? (
                <FormInputBox
                  name={`orderByName${index}`}
                  disabled={true}
                  required={true}
                  allowMargin={false}
                  value={
                    fieldsList?.filter(
                      (field) => field.name === item[`orderByName${index}`]
                    )[0].label.en
                  }
                />
              ) : (
                <FormDropdown
                  name={`orderByName${index}`}
                  required={true}
                  placeholder={"Order by field"}
                  options={fieldsListLabel}
                  onChange={(selectedOption) => {
                    handleOrderByChange(selectedOption, index);
                    setFieldValue(
                      `orderByName${index}`,
                      selectedOption.currentTarget.value
                    );
                  }}
                  allowMargin={false}
                />
              )}
            </div>
            <div className="w-[28%]">
              <FormDropdown
                name={`orderByOrder${index}`}
                required={true}
                disabled={!item[`orderByName${index}`]}
                placeholder={
                  item[`orderByOrder${index}`]
                    ? orderDropdown.filter(
                        (order) => order.value === item[`orderByOrder${index}`]
                      )[0].label
                    : "Order by order"
                }
                options={orderDropdown}
                onChange={(selectedOption) => {
                  handleOrderByChange(selectedOption, index);
                  setFieldValue(
                    `orderByOrder${index}`,
                    selectedOption.currentTarget.value
                  );
                }}
                allowMargin={false}
              />
            </div>
            <div className="flex flex-row gap-x-2 sm:gap-x-4">
              {orderByList.length !== 1 && (
                <Button
                  customStyle="w-10 h-[39px] mr-4 border border-vryno-form-border-gray text-vryno-delete-icon text-xl flex justify-center items-center rounded-md cursor-pointer"
                  onClick={() => {
                    const resetValues: Record<string, string> = {};
                    let highest = -1;
                    for (const key in values) {
                      if (key.includes("orderByName")) {
                        let indexValue = parseInt(key[key.length - 1]);
                        if (index === 0 && indexValue !== 0) {
                          if (indexValue > highest) {
                            highest = indexValue;
                          }
                          resetValues[`orderByName${indexValue - 1}`] =
                            values[key];
                        } else if (indexValue === index) {
                          continue;
                        } else if (indexValue < index) {
                          resetValues[key] = values[key];
                        } else if (indexValue > index) {
                          resetValues[`orderByName${indexValue - 1}`] =
                            values[key];
                        }
                      } else if (key.includes("orderByOrder")) {
                        let indexValue = parseInt(key[key.length - 1]);
                        if (index === 0 && indexValue !== 0) {
                          if (indexValue > highest) {
                            highest = indexValue;
                          }
                          resetValues[`orderByOrder${indexValue - 1}`] =
                            values[key];
                        } else if (indexValue === index) {
                          continue;
                        } else if (indexValue < index) {
                          resetValues[key] = values[key];
                        } else if (indexValue > index) {
                          resetValues[`orderByOrder${indexValue - 1}`] =
                            values[key];
                        }
                      } else {
                        resetValues[key] = values[key];
                      }
                    }
                    let finalReset: Record<string, string> = {};
                    if (highest !== -1) {
                      for (const key in resetValues) {
                        if (key !== `orderByOrder${highest}`) {
                          finalReset[key] = resetValues[key];
                        }
                      }
                    } else {
                      finalReset = { ...resetValues };
                    }
                    resetForm({
                      values: {
                        ...resetValues,
                      },
                    });
                    handleOrderByRemoveClick(index);
                  }}
                  id={`custom-orderby-remove-${index}`}
                  userEventName="customView-orderBy-filter-remove-click"
                >
                  -
                </Button>
              )}
              {orderByList.length - 1 === index && (
                <Button
                  customStyle={`w-10 h-[39px] border ${
                    !item[`orderByOrder${index}`] ? "hidden" : ""
                  } border-vryno-form-border-gray text-vryno-theme-blue text-xl flex justify-center items-center rounded-md cursor-pointer`}
                  onClick={handleOrderByAddClick}
                  id={`custom-orderby-add-${index}`}
                  userEventName="customView-orderBy-filter-add-click"
                >
                  +
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
