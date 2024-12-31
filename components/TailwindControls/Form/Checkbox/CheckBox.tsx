import React from "react";
import { kebabCase } from "change-case";
import MoreInfo from "remixicon-react/QuestionFillIcon";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import Button from "../Button/Button";

export type CheckboxProps = {
  name: string;
  type?: string;
  label?: string;
  customLabel?: React.ReactElement;
  labelSize?: string;
  datatestid?: string;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  value?: boolean;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  helpText?: React.ReactElement;
  checkboxGap?: number;
  marginY?: string;
  infoDetail?: null | { label: string; value: string };
};

function Checkbox(
  {
    type = "checkbox",
    label,
    customLabel,
    datatestid,
    labelSize = "text-sm",
    onBlur = () => {},
    onChange = () => {},
    name,
    isValid = true,
    value = false,
    error = undefined,
    disabled = false,
    required = false,
    checkboxGap = 4,
    marginY = "my-4",
    infoDetail = null,
  }: CheckboxProps,
  ref: React.Ref<HTMLInputElement>
) {
  const borderClass = isValid
    ? "border-vryno-form-border-gray"
    : "border-red-200";

  const refCloseMoreInfo = React.useRef(null);
  const [moreInfoVisible, setMoreInfoVisible] = React.useState(false);
  ClickOutsideToClose(refCloseMoreInfo, (value: boolean) =>
    setMoreInfoVisible(value)
  );

  return (
    <div
      data-testid={`checkbox-${kebabCase(name)}`}
      className={`flex flex-row w-full items-center ${marginY}`}
    >
      <input
        id={kebabCase(name)}
        name={name}
        type="checkbox"
        data-testid={datatestid ? kebabCase(datatestid) : kebabCase(name)}
        onChange={onChange}
        onBlur={onBlur}
        checked={value}
        disabled={disabled}
        ref={ref}
        className={`border rounded-sm cursor-pointer focus:shadow-md focus:outline-none ${borderClass} mr-${checkboxGap}`}
      />
      {customLabel
        ? customLabel
        : label && (
            <label
              htmlFor={kebabCase(name)}
              className={`tracking-wide text-vryno-label-gray ${labelSize}`}
            >
              {label}
            </label>
          )}
      {infoDetail && (
        <div ref={refCloseMoreInfo} className="relative ml-2">
          <Button
            id="checkBox-more-info-icon"
            onClick={(e) => {
              e.stopPropagation();
              setMoreInfoVisible(!moreInfoVisible);
            }}
            customStyle=""
            userEventName="checkBox-more-info:toggle-click"
          >
            <MoreInfo size={"16"} className="text-gray-300" />
          </Button>
          {moreInfoVisible && (
            <div
              className="origin-top-right absolute right-0 z-40 p-2 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              id="moreInfo"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="mb-2">
                <span className="text-sm font-bold block">
                  {infoDetail.label}
                </span>
                <span className="text-xs text-vryno-label-gray">
                  {infoDetail.value}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {!isValid && error && (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {error}
        </label>
      )}
    </div>
  );
}

export default React.forwardRef(Checkbox);
