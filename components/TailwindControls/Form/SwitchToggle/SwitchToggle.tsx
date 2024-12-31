import React, { SyntheticEvent } from "react";
import Switch from "react-switch";
import { useFormikContext } from "formik";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";

export default function SwitchToggle({
  label,
  name,
  disabled = false,
  onChange,
  value,
  required = false,
  labelLocation = "Top",
  width = "full",
  allowMargin = false,
  helpText,
  externalError,
  rejectRequired,
  addClear,
  dataTestId,
  convertToBoolean = false,
  paddingInPixelForInputBox,
  hideValidationMessages,
}: {
  label?: string;
  name: string;
  disabled?: boolean;
  labelLocation?: "Top" | "Left";
  onChange: (
    checked?: boolean,
    event?: MouseEvent | SyntheticEvent<MouseEvent | KeyboardEvent, Event>,
    id?: string
  ) => void;
  value: string | ReadonlyArray<string> | number;
  required?: boolean;
  width?: "full" | "auto";
  externalExpressionToCalculateValue?: string;
  allowMargin?: boolean;
  helpText?: React.ReactElement;
  externalError?: string;
  rejectRequired?: boolean;
  addClear?: boolean;
  dataTestId?: string;
  convertToBoolean?: boolean;
  paddingInPixelForInputBox?: number;
  hideValidationMessages?: boolean;
}) {
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | boolean>>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);
  const switchRef = React.useRef(null);

  React.useEffect(() => {
    if (convertToBoolean && !values[name]) {
      setFieldValue(name, false);
    }
  }, [values[name]]);

  return (
    <div
      className={`flex ${
        labelLocation === "Left"
          ? "flex-row items-center justify-between gap-x-3"
          : "flex-col"
      } ${label ? "my-2" : "justify-end"} ${allowMargin && "my-2"} w-${width}`}
    >
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={paramCase(name)}
            data-testid={paramCase(`clear-${dataTestId ? dataTestId : name}`)}
            className="text-sm tracking-wide text-vryno-label-gray"
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              data-testid={paramCase(`clear-${dataTestId ? dataTestId : name}`)}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, false);
                  setFormDisabled(false);
                  return;
                }
                setFieldValue(name, null);
                setFormDisabled(true);
              }}
              className="cursor-pointer mr-1.5"
            />
            <label htmlFor={`clear-${name}`} className="cursor-pointer text-xs">
              clear
            </label>
          </div>
        )}
      </div>

      <div
        className={`${
          labelLocation === "Left"
            ? ""
            : paddingInPixelForInputBox
            ? `py-[${paddingInPixelForInputBox}px]`
            : label
            ? "py-2"
            : ""
        }`}
        id={`${paramCase(name)}-switch-container`}
        data-testid={dataTestId ? paramCase(dataTestId) : paramCase(`${name}`)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Switch
          id={paramCase(name)}
          name={name}
          onChange={onChange}
          value={value}
          checked={values[name] === true}
          disabled={formDisabled}
          onColor="#4DBE8D"
          offColor="#DBDBDB"
          ref={switchRef}
          placeholder={values[name] === true ? "true" : "false"}
        />
      </div>
      {helpText}
    </div>
  );
}
