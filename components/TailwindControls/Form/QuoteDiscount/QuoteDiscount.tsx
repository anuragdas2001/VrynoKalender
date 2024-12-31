import React from "react";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { get } from "lodash";

export type QuoteDiscountProps = {
  name: string;
  placeholder?: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  stopEventPropagation?: boolean;
  editMode?: boolean;
  allowMargin?: boolean;
  precision?: number;
  calculateValueOn?: string;
};

function QuoteDiscount({
  placeholder = "",
  label,
  name,
  value,
  onBlur = () => {},
  onChange = () => {},
  labelLocation = SupportedLabelLocations.OnTop,
  disabled = false,
  required = false,
  editMode = false,
  precision = 2,
  allowMargin = true,
  stopEventPropagation,
  calculateValueOn,
}: QuoteDiscountProps) {
  const { errors, touched, values, setFieldValue, handleChange } =
    useFormikContext<Record<string, string>>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3  pr-[122px]"
      : "";

  const borderClass = (touched[name] ? errors[name] === undefined : true)
    ? "border-vryno-form-border-gray"
    : "border-red-200";
  const focusBorderClass = (touched[name] ? errors[name] === undefined : true)
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "w-full";

  const handleDiscountType = (value: string) => {
    setFieldValue(`discount-input-${name}`, 0);
    setFieldValue(name, {
      amount: 0,
      discount: 0,
      displayAs: { en: "discount" },
      format: { type: "number", ratio: value, precision: 2 },
    });
  };

  const handleDiscountValue = (value: string) => {
    if (values[`discount-type-${name}`] === "percent") {
      if (Number(value) > 100) {
        setFieldValue(`discount-input-${name}`, 100);
        setFieldValue(name, {
          amount: calculateValueOn,
          discount: 100,
          displayAs: { en: "discount" },
          format: {
            type: "number",
            ratio: values[`discount-type-${name}`],
            precision: 2,
          },
        });
      } else {
        setFieldValue(name, {
          amount: (Number(value) * Number(calculateValueOn)) / 100,
          discount: Number(value),
          displayAs: { en: "discount" },
          format: {
            type: "number",
            ratio: values[`discount-type-${name}`],
            precision: 2,
          },
        });
      }
    } else {
      setFieldValue(name, {
        amount: Number(value),
        discount: Number(value),
        displayAs: { en: "discount" },
        format: {
          type: "number",
          ratio: values[`discount-type-${name}`],
          precision: 2,
        },
      });
    }
  };

  React.useEffect(() => {
    if (values[name]) {
      if (get(values[name], "format.ratio") === "percent") {
        setFieldValue(name, {
          amount:
            (Number(values[`discount-input-${name}`]) *
              Number(calculateValueOn)) /
            100,
          discount: get(values[name], "discount"),
          displayAs: { en: get(values[name], "displayAs.en") },
          format: get(values[name], "format"),
        });
      }
    }
  }, [calculateValueOn]);

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-2"} `}>
      <div className={`${labelClasses} flex justify-between`}>
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray w-full`}
          >
            {label}
            <RequiredIndicator required={required} />
          </label>
        )}
      </div>
      <div className={`relative ${textBoxClasses} grid grid-cols-2`}>
        <select
          id={paramCase(`discount-type-${name}`)}
          name={`discount-type-${name}`}
          onClick={(e) => (stopEventPropagation ? e.stopPropagation() : {})}
          onChange={(selectedOption) => {
            setFieldValue(`discount-type-${name}`, selectedOption.target.value);
            handleDiscountType(selectedOption.target.value);
          }}
          onBlur={onBlur}
          // @ts-ignore
          placeholder={placeholder}
          value={values[`discount-type-${name}`] ?? ""}
          disabled={disabled || !calculateValueOn}
          className={`form-select appearance-none bg-clip-padding bg-no-repeat border border-r-1 pr-8
                      text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none rounded-l-md
                      ${borderClass} ${focusBorderClass} py-2 px-2 ${
            disabled || !calculateValueOn ? "bg-gray-50" : "bg-white"
          }`}
        >
          {!placeholder && (
            <option value="" disabled hidden>
              Please select
            </option>
          )}
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {[
            { label: "Percent (%)", value: "percent", visible: true },
            { label: "Direct Price", value: "absolute", visible: true },
          ].map((opt, index) => (
            <option
              className={`text-xsm`}
              id={opt?.label}
              key={index}
              value={opt?.value ? opt?.value : undefined}
              label={opt?.label}
              disabled={typeof opt?.visible === "boolean" && !opt.visible}
            >
              {opt?.label}
            </option>
          ))}
        </select>
        <input
          id={paramCase(`discount-input-${name}`)}
          name={`discount-input-${name}`}
          type="number"
          onChange={(e) => {
            handleChange(e);
            handleDiscountValue(e.target.value);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          value={values[`discount-input-${name}`] ?? 0}
          disabled={
            disabled || !calculateValueOn || !values[`discount-type-${name}`]
          }
          ref={inputRef}
          min={"0"}
          onKeyDown={(e) => {
            if (e.code === "Minus" || e.charCode === 45) {
              e.preventDefault();
            }
          }}
          step={precision ? "" : "1"}
          className={`border border-l-0 rounded-r-md text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none py-2
                        ${borderClass} ${focusBorderClass} px-2`}
        />
        {values[name] && get(values[name], "amount", 0) ? (
          <label className="text-blue-600 ml-2 mt-1 text-xs box-decoration-clone">
            {`Discount = ${get(values[name], "amount", 0)}`}
          </label>
        ) : null}
      </div>
    </div>
  );
}

export default QuoteDiscount;
