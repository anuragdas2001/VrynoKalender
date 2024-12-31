import React, { ForwardedRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import { useFormikContext } from "formik";
import CalenderIcon from "remixicon-react/CalendarLineIcon";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
// import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { IUserPreference } from "../../../../models/shared";
import { User } from "../../../../models/Accounts";
import useScrollPosition from "../../../../screens/modules/crm/shared/utils/useScrollPosition";
import moment from "moment";

export function formatDate(date = new Date()) {
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", {
    month: "2-digit",
  });
  const day = date.toLocaleString("default", { day: "2-digit" });
  return [year, month, day].join("-");
}

export type DatePickerProps = {
  name: string;
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  rightIconClick?: () => void;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (
    date: Date | null,
    event: React.SyntheticEvent<any> | undefined
  ) => void;
  value?: string | Date;
  externalError?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  editMode?: boolean;
  user?: User;
  type?: "datetime" | "date" | "time";
  applyMargin?: boolean;
  allowMargin?: boolean;
  excludeTimes?: boolean;
  futureDate?: boolean;
  externalExpressionToCalculateValue?: string;
  rejectRequired?: boolean;
  addClear?: boolean;
  overflow?: boolean;
  userPreferences?: IUserPreference;
  paddingInPixelForInputBox?: number;
  dataTestId?: string;
  hideValidationMessages?: boolean;
};

function ReactDatePicker(
  {
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
    onBlur = () => {},
    onChange = () => {},
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    error = undefined,
    user,
    disabled = false,
    required = false,
    externalError,
    applyMargin = true,
    allowMargin = true,
    rejectRequired,
    addClear,
    editMode,
    paddingInPixelForInputBox,
    dataTestId,
    hideValidationMessages,
  }: DatePickerProps,
  ref: ForwardedRef<any> | null
) {
  const { values, setFieldValue } =
    useFormikContext<Record<string, Date | null | string>>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  const [selectedDate, setSelectedDate] = React.useState(
    editMode && values[name] && typeof values[name] === "string"
      ? new Date(
          Number((values[name] as string)?.split("-")[0]),
          Number((values[name] as string)?.split("-")[1]) - 1,
          Number((values[name] as string)?.split("-")[2])
        )
      : values[name]
      ? new Date(values[name] as Date)
      : null
  );
  const scrollPosition = useScrollPosition();
  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);
  const paddingLeftClass = leftIcon ? "pl-12" : "pl-2";
  const paddingRightClass = rightIcon ? "pr-12" : "pr-2";
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";

  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";

  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);

  const handleDateSelection = (date: Date | null) => {
    if (date === null) {
      setFieldValue(name, null);
      setDatePickerOpen(false);
      return null;
    } else {
      const finalDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0
      );
      setFieldValue(name, formatDate(finalDate));
      setSelectedDate(new Date(finalDate));
      setDatePickerOpen(false);
      return new Date(finalDate);
    }
  };

  React.useEffect(() => {
    if (Array.isArray(values[name])) {
      setFieldValue(name, null);
    } else {
      setSelectedDate(
        editMode && values[name] && typeof values[name] === "string"
          ? new Date(
              Number((values[name] as string)?.split("-")[0]),
              Number((values[name] as string)?.split("-")[1]) - 1,
              Number((values[name] as string)?.split("-")[2])
            )
          : values[name]
          ? new Date(values[name] as Date)
          : null
      );
    }
  }, [values[name]]);

  React.useEffect(() => {
    setDatePickerOpen(false);
  }, [scrollPosition]);

  const handleChangeRaw = (event: any) => {
    const inputValue = event.currentTarget.value;
    if (!inputValue) return;
    const sanitizedValue = inputValue?.replace(/[^0-9/.\-]/g, "");
    if (sanitizedValue !== inputValue) {
      event.currentTarget.value = sanitizedValue?.length
        ? sanitizedValue
        : null;
    }
    if (moment(sanitizedValue, "DD/MM/YYYY", true).isValid()) {
      event.currentTarget.value = moment(sanitizedValue, "DD/MM/YYYY").format(
        "DD/MM/YYYY"
      );
    }
  };

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-2"}`}>
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={name}
            className={`${
              applyMargin && "mb-2.5"
            } text-sm tracking-wide text-vryno-label-gray  ${labelClasses}`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              data-testid={(`clear-${name}`)}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, null);
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
        className={`relative w-full flex text-sm placeholder-vryno-placeholder ${textBoxClasses} ${
          datePickerOpen ? "z-[1000]" : ""
        }`}
      >
        {leftIcon && IconInsideInputBox(leftIcon, IconLocation.Left)}
        <DatePicker
          id={(name)}
          data-testid={
            dataTestId ? (dataTestId) : (`${name}`)
          }
          name={name}
          onChange={(date: Date | null) => {
            handleDateSelection(date);
            onChange;
          }}
          selected={
            Array.isArray(values[name])
              ? null
              : String(values[name]).toLocaleLowerCase() === "invalid date" ||
                !values[name]
              ? null
              : values[name] &&
                String(selectedDate).toLocaleLowerCase() === "invalid date"
              ? handleDateSelection(new Date(values[name] as Date))
              : String(selectedDate).toLocaleLowerCase() === "invalid date" ||
                !selectedDate
              ? null
              : selectedDate
          }
          dateFormat={`${user?.dateFormat ? user.dateFormat : "dd/MM/yyyy"}`}
          open={datePickerOpen}
          onInputClick={() => setDatePickerOpen(!datePickerOpen)}
          onClickOutside={() => setDatePickerOpen(!datePickerOpen)}
          yearDropdownItemNumber={60}
          showYearDropdown
          scrollableYearDropdown
          onBlur={onBlur}
          placeholderText={
            selectedDate?.toString() &&
            selectedDate?.toString() !== "Invalid Date"
              ? selectedDate?.toString()
              : placeholder
          }
          disabled={formDisabled}
          wrapperClassName="react-datepicker-wrapper-class"
          ref={ref}
          autoComplete="off"
          className={`border rounded-md text-sm w-full placeholder-vryno-placeholder focus:shadow-md focus:outline-none ${
            paddingInPixelForInputBox
              ? `py-[${paddingInPixelForInputBox}px]`
              : "py-2"
          } px-2 ${borderClass} ${focusBorderClass} ${paddingRightClass} ${paddingLeftClass}`}
          onChangeRaw={handleChangeRaw}
        />

        {IconInsideInputBox(
          <CalenderIcon size={24} className="text-vryno-icon-gray" />,
          IconLocation.Right,
          () => {
            if (formDisabled) return;
            setDatePickerOpen(!datePickerOpen);
          }
        )}
      </div>
      {hideValidationMessages ? (
        <></>
      ) : rejectRequired ? (
        !isValid || (error && !error?.includes("required")) ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        ) : (
          <></>
        )
      ) : externalError ? (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {externalError}
        </label>
      ) : (
        !isValid &&
        error && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {error}
          </label>
        )
      )}
    </div>
  );
}
export default React.forwardRef(ReactDatePicker);
