import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { TimePickerProps } from "./TimePickerProps";
import useScrollPosition from "../../../../screens/modules/crm/shared/utils/useScrollPosition";
// import { paramCase } from "change-case";
import { get } from "lodash";
import { parseISO } from "date-fns";
import { convertTZ } from "../../DayCalculator";
import { UserStoreContext } from "../../../../stores/UserStore";

function ReactTimePicker(
  {
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
    name,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    disabled = false,
    required = false,
    editMode = false,
    type = "datetime",
    applyMargin = true,
    allowMargin = true,
    formResetted,
    externalExpressionToCalculateValue,
    modelName,
    externalError,
    formDetails,
    rejectRequired,
    addClear,
    userPreferences,
    user,
    timezone,
    paddingInPixelForInputBox,
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
  }: TimePickerProps,
  ref: React.Ref<any>
) {
  const userContext = useContext(UserStoreContext);
  const { user: userDetails } = userContext;
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);
  modelName = formDetails?.modelName
    ? formDetails?.modelName[0].toLowerCase() + formDetails?.modelName.slice(1)
    : modelName;
  if (modelName === "calllog") modelName = "callLog";
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [componentLoaded, setComponentLoaded] = React.useState(false);
  const scrollPosition = useScrollPosition();
  // console.log(values);
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

  const onTimeChange = (newTime: Date | null) => {
    if (!newTime && !selectedDate) return;
    if (!newTime && selectedDate) {
      const finalDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0
      );
      setSelectedDate(finalDate);
      setFieldValue(name, finalDate);
      return;
    }
    if (newTime && !selectedDate) {
      const todaysDate = new Date();
      const finalDate = new Date(
        todaysDate.getFullYear(),
        todaysDate.getMonth(),
        todaysDate.getDate(),
        newTime?.getHours(),
        newTime?.getMinutes()
      );
      setSelectedDate(finalDate);
      setFieldValue(name, finalDate);
      return;
    }
    if (newTime && selectedDate) {
      const finalDate = new Date(
        selectedDate?.getFullYear(),
        selectedDate?.getMonth(),
        selectedDate?.getDate(),
        newTime?.getHours(),
        newTime?.getMinutes()
      );
      setSelectedDate(finalDate);
      setFieldValue(name, finalDate);
      return;
    }
  };

  React.useEffect(() => {
    if (values[name] && componentLoaded === false) {
      const timeZonePreference = timezone
        ? timezone
        : get(user ?? userDetails, "timezone", "");
      if (timeZonePreference) {
        let parseDate = parseISO(values[name]);
        if (
          String(parseDate) === "Invalid Date" ||
          String(parseDate) === "Invalid time"
        ) {
          setSelectedDate(new Date(values[name]));
        } else {
          setSelectedDate(convertTZ(values[name], timeZonePreference));
          setFieldValue(name, convertTZ(values[name], timeZonePreference));
        }
      } else {
        setSelectedDate(new Date(values[name]));
      }
      setComponentLoaded(true);
    }
  }, [values[name], componentLoaded]);

  React.useEffect(() => {
    if (!formResetted) return;
    setSelectedDate(null);
    setFieldValue("time", new Date(""));
    setFieldValue("date", new Date(""));
  }, [formResetted]);

  React.useEffect(() => {
    if (values[name] === null) {
      setSelectedDate(null);
    }
    if (Array.isArray(values[name]) && values[name].length === 0) {
      setSelectedDate(null);
      setFieldValue(name, null);
    }
  }, [values[name]]);

  React.useEffect(() => {
    setTimePickerOpen(false);
  }, [scrollPosition]);
  console.log("selectedDate",selectedDate);
  return (
    <div className={`flex ${divFlexCol} ${allowMargin ? "my-2" : ""}`}>
      <div className="w-full flex justify-between">
        {label && (
          <label
            className={`text-sm tracking-wide text-vryno-label-gray ${
              applyMargin && "mb-2.5"
            } ${labelClasses}`}
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
                setSelectedDate(null);
                if (formDisabled) {
                  setFieldValue(name, "");
                  setFieldValue("time", "");
                  setFieldValue("date", "");
                  setFormDisabled(false);
                  return;
                }
                setFieldValue(name, null);
                setFieldValue("time", null);
                setFieldValue("date", null);
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
          timePickerOpen ? "z-[1000]" : ""
        }`}
      >
        <DatePicker
          id="time"
          data-testid={(`time-${name}`)}
          name="time"
          onChange={onTimeChange}
          selected={selectedDate ? selectedDate : null}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat={"h:mm aa"}
          open={timePickerOpen}
          onInputClick={() => setTimePickerOpen(!timePickerOpen)}
          onClickOutside={() => setTimePickerOpen(!timePickerOpen)}
          onBlur={onBlur}
          placeholderText="Time"
          disabled={disabled}
          autoComplete="off"
          ref={ref}
          className={`border w-32  rounded-md focus:outline-none ${
            paddingInPixelForInputBox
              ? `py-[${paddingInPixelForInputBox}px]`
              : "py-2"
          } focus:shadow-md rounded-r-md
                   ${borderClass} ${focusBorderClass} ${paddingLeftClass} ${paddingRightClass}`}
        />
      </div>
      {rejectRequired ? (
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
export default React.forwardRef(ReactTimePicker);
