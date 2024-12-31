import React, { ForwardedRef, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import CloseIcon from "remixicon-react/CloseLineIcon";
import RequiredIndicator from "../Shared/RequiredIndicator";
import Button from "../Button/Button";
import { ICustomField } from "../../../../models/ICustomField";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../graphql/queries/fetchQuery";
import _ from "lodash";

export const getLookupOptions = (
  options: {
    id: string;
    label: { en: string };
    recordStatus: string;
    order: number;
    recordMetaData: { taxType: string; taxValue: number };
  }[]
) => {
  return [...options]
    ?.slice()
    ?.sort(
      (
        optionOne: {
          id: string;
          label: { en: string };
          recordStatus: string;
          order: number;
          recordMetaData: { taxType: string; taxValue: number };
        },
        optionTwo: {
          id: string;
          label: { en: string };
          recordStatus: string;
          order: number;
          recordMetaData: { taxType: string; taxValue: number };
        }
      ) => (optionOne?.order > optionTwo?.order ? 1 : -1)
    )
    ?.map(
      (lookupOption: {
        id: string;
        label: { en: string };
        recordStatus: string;
        recordMetaData: { taxType: string; taxValue: number };
      }) => {
        return {
          id: lookupOption.id,
          label: lookupOption.label.en,
          visible: lookupOption.recordStatus === "a",
          value: lookupOption?.recordMetaData?.taxValue,
        };
      }
    );
};

type Tax = {
  id: string;
  displayAs: { en: string };
  format: { type: string; ratio: string; precision: 2 };
  selected: boolean;
  amount: number;
};

export const calculateTaxValue = (values: Tax[] | string) => {
  let totalTax = 0;
  if (!values) return totalTax;
  if (
    typeof values === "string" &&
    JSON.parse(
      (values as string)
        .replace(/'/g, '"')
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
    ) &&
    Array.isArray(
      JSON.parse(
        (values as string)
          .replace(/'/g, '"')
          .replace(/\bTrue\b/g, "true")
          .replace(/\bFalse\b/g, "false")
      )
    )
  ) {
    JSON.parse(
      (values as string)
        .replace(/'/g, '"')
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
    )?.forEach((value: Tax) => (totalTax = totalTax + (value?.amount ?? 0)));
  } else {
    (values as Tax[])?.forEach(
      (value: Tax) => (totalTax = totalTax + (value?.amount ?? 0))
    );
  }

  return totalTax;
};

export type QuoteTaxProps = {
  name: string;
  modelName: string;
  placeholder?: string;
  label?: string;
  editMode?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  labelLocation?: SupportedLabelLocations;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  usedInForm?: boolean;
  limitSelectionTo?: number;
  allowMargin?: boolean;
  rejectRequired?: boolean;
  addClear?: boolean;
  formResetted?: boolean;
  dependingModuleFields?: ICustomField[];
  optionsFromFieldName?: string;
  valueToFetchAgainst?: string;
  fieldsToFetch?: string[];
  calculateValueOn?: string;
  externalOptions?: {
    id: string;
    label: string;
    value: number;
    visible: boolean;
  }[];
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  rightIconClick?: () => void;
};

function QuoteTax(
  {
    placeholder = "",
    label,
    modelName,
    leftIcon,
    rightIcon,
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    editMode = false,
    disabled = false,
    required = false,
    multiple = true,
    usedInForm = true,
    limitSelectionTo,
    allowMargin = true,
    rejectRequired,
    addClear,
    formResetted,
    dependingModuleFields = [],
    optionsFromFieldName,
    valueToFetchAgainst,
    fieldsToFetch,
    calculateValueOn,
    externalOptions = [],
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    ...props
  }: QuoteTaxProps,
  ref: ForwardedRef<HTMLInputElement> | null
) {
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 pr-[122px]"
      : "";

  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "w-full";
  const [data, setData] = React.useState<Record<string, string>>();
  const [dataLoading, setDataLoading] = React.useState<boolean>(true);
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  const [options, setOptions] = React.useState<
    { id: string; label: string; value: number; visible: boolean }[]
  >([]);

  const handleUnselectedItem = (value: Record<string, any>) => {
    let updatedValues = [...values[name]];
    updatedValues = updatedValues?.filter(
      (updatedValue) => updatedValue?.id !== value?.id
    );
    if (updatedValues?.length === 0) {
      setFieldValue(name, null);
    } else setFieldValue(name, [...updatedValues]);
  };

  const handleSelectedItem = (
    selectedValue: string,
    dropdownOptions: {
      id: string;
      label: string;
      value: number;
      visible: boolean;
    }[],
    returnType: "returnValue" | "setValue" = "setValue"
  ): void | any => {
    const findSelectedFieldIndex =
      returnType === "setValue" && values[name]
        ? values[name]?.findIndex((value: any) => value?.id === selectedValue)
        : -1;
    const indexInOption = dropdownOptions?.findIndex(
      (option) => option?.id === selectedValue
    );
    if (findSelectedFieldIndex === -1) {
      if (values[name]) {
        let value = {
          id: selectedValue,
          displayAs: { en: dropdownOptions[indexInOption]?.label },
          format: { type: "number", ratio: "percent", precision: 2 },
          selected: true,
          tax: dropdownOptions[indexInOption]?.value,
          amount:
            (dropdownOptions[indexInOption]?.value * Number(calculateValueOn)) /
            100,
        };
        if (returnType === "returnValue") return _.cloneDeep(value);
        setFieldValue(name, [...values[name], _.cloneDeep(value)]);
      } else {
        let value = {
          id: selectedValue,
          displayAs: { en: dropdownOptions[indexInOption]?.label },
          format: { type: "number", ratio: "percent", precision: 2 },
          selected: true,
          tax: dropdownOptions[indexInOption]?.value,
          amount:
            (dropdownOptions[indexInOption]?.value * Number(calculateValueOn)) /
            100,
        };
        if (returnType === "returnValue") return _.cloneDeep(value);
        setFieldValue(name, [_.cloneDeep(value)]);
      }
    }
  };

  const [getDataForValueToFetchAgainst] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  React.useEffect(() => {
    if (dependingModuleFields?.length > 0) {
      const findDependentFieldIndex = dependingModuleFields?.findIndex(
        (field) => field.name === optionsFromFieldName
      );
      if (
        findDependentFieldIndex !== -1 &&
        (dependingModuleFields[findDependentFieldIndex]?.dataType ===
          "lookup" ||
          dependingModuleFields[findDependentFieldIndex]?.dataType ===
            "multiSelectLookup")
      ) {
        if (!editMode) {
          let updatedTaxValue = [];
          if (data?.taxable) {
            for (let taxId of _.get(data, "productTaxIds", [])) {
              updatedTaxValue.push(
                handleSelectedItem(
                  taxId,
                  getLookupOptions(
                    dependingModuleFields[findDependentFieldIndex]
                      .dataTypeMetadata?.lookupOptions
                  ),
                  "returnValue"
                )
              );
            }
          }
          setFieldValue(name, _.cloneDeep(updatedTaxValue));
        }
        setOptions(
          getLookupOptions(
            dependingModuleFields[findDependentFieldIndex].dataTypeMetadata
              ?.lookupOptions
          )
        );
      }
    }
  }, [data, dependingModuleFields]);

  React.useEffect(() => {
    const handleDataValueFetch = async () => {
      await getDataForValueToFetchAgainst({
        variables: {
          modelName: modelName,
          fields: fieldsToFetch ? [...fieldsToFetch] : [],
          filters: [
            {
              operator: "eq",
              name: "id",
              value: valueToFetchAgainst?.toString() || "",
            },
          ],
        },
      }).then((responseOnCompletion) => {
        if (responseOnCompletion?.data?.fetch?.data) {
          setData(responseOnCompletion?.data?.fetch.data[0]);
        }
        setDataLoading(false);
      });
    };
    handleDataValueFetch();
  }, [valueToFetchAgainst]);

  React.useEffect(() => {
    setFieldValue(`systemDefinedSelectedOptions${name}`, values[name]);
  }, [editMode]);

  React.useEffect(() => {
    if (externalOptions && externalOptions?.length > 0) {
      setOptions(externalOptions);
    }
  }, [externalOptions]);

  React.useEffect(() => {
    if (values[name]) {
      let updatedValues = [
        ...values[name]?.map((newValue: any) => {
          return {
            ...newValue,
            amount: (newValue?.tax * Number(calculateValueOn)) / 100,
          };
        }),
      ];
      setFieldValue(name, [...updatedValues]);
    }
  }, [calculateValueOn]);

  return (
    <>
      <div className={`flex ${divFlexCol} ${allowMargin && "my-2"}`}>
        <div className={`${labelClasses}  flex justify-between`}>
          {label && (
            <label
              htmlFor={paramCase(name)}
              className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray `}
            >
              {label}
              <RequiredIndicator required={rejectRequired ? false : required} />
            </label>
          )}
        </div>
        <div
          className={`relative  ${textBoxClasses}
          `}
        >
          <div
            className={`focus:shadow-md
          border
          ${borderClass}
          ${focusBorderClass}
          rounded-md text-sm break-words bg-white`}
          >
            <div
              className={`py-[2.5px] max-h-44 overflow-y-scroll ${
                values[name]?.length ? `mx-2 my-1` : "hidden"
              }`}
            >
              {values[name]?.length > 0 &&
                values[name]?.map((value: any, index: number) => (
                  <span
                    className={`bg-vryno-theme-highlighter-blue hover:text-white hover:bg-vryno-theme-light-blue px-2 rounded-xl mr-2 inline-flex justify-center items-center my-1 text-xs`}
                    key={index}
                  >
                    <span className="pl-1">{`${value?.displayAs?.en}`}</span>
                    <Button
                      id="multiple-values-dropdown-close"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleUnselectedItem(value);
                      }}
                      customStyle=""
                      userEventName="multiple-values-dropdown-close:action-click"
                    >
                      <CloseIcon className="ml-2 w-4 cursor-pointer hover:text-red-500" />
                    </Button>
                  </span>
                ))}
            </div>
            <select
              id={paramCase(`tax-${name}`)}
              name={`tax-${name}`}
              onChange={(selectedOption: React.ChangeEvent<any>) => {
                handleSelectedItem(selectedOption.currentTarget.value, options);
              }}
              onBlur={onBlur}
              value={""}
              // @ts-ignore
              placeholder={placeholder}
              disabled={
                !calculateValueOn ||
                formDisabled ||
                (options.length > 0 &&
                  options.filter((option) => {
                    if (typeof option?.visible === "boolean") {
                      if (option.visible) return option;
                    } else return option;
                  }).length === 0) ||
                (externalOptions?.length === 0
                  ? !data || !data?.taxable
                  : false)
              }
              className={`relative w-full rounded-md text-sm placeholder-vryno-placeholder focus:outline-none py-2 px-2 `}
            >
              {!placeholder && (
                <option value="" selected disabled hidden>
                  {data && !data?.taxable
                    ? "No associated tax"
                    : "Please select a value"}
                </option>
              )}
              {placeholder && (
                <option value="" selected disabled hidden>
                  {placeholder}
                </option>
              )}
              {!editMode
                ? options?.length > 0 &&
                  options?.map((opt, index) => (
                    <option
                      className={`w-full text-xsm`}
                      id={opt?.label}
                      key={index}
                      value={opt?.id ? opt?.id : undefined}
                      label={opt?.label}
                      disabled={
                        typeof opt?.visible === "boolean" && !opt.visible
                      }
                    >
                      {opt?.label}
                    </option>
                  ))
                : options
                    ?.filter((option) => {
                      if (data?.productTaxIds?.includes(option.id))
                        return option;
                    })
                    ?.map((option) => option).length > 0 &&
                  options
                    ?.filter((option) => {
                      if (data?.productTaxIds?.includes(option.id))
                        return option;
                    })
                    ?.map((option) => option)
                    .map((opt, index) => (
                      <option
                        className={`w-full text-xsm`}
                        id={opt?.label}
                        key={index}
                        value={opt?.id ? opt?.id : undefined}
                        label={opt?.label}
                        disabled={
                          typeof opt?.visible === "boolean" && !opt.visible
                        }
                      >
                        {opt?.label}
                      </option>
                    ))}
            </select>
          </div>
          {values[name] ? (
            <label className="text-blue-600 ml-2 mt-1 text-xs box-decoration-clone">
              {`Tax = ${calculateTaxValue(values[name])}`}
            </label>
          ) : null}
        </div>
      </div>
    </>
  );
}
export default React.forwardRef(QuoteTax);
