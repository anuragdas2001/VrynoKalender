import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { JSONDateTimePickerProps } from "./JSONDateTimePickerProps";
import useScrollPosition from "../../../../screens/modules/crm/shared/utils/useScrollPosition";
import { paramCase } from "change-case";
import _, { get } from "lodash";
import { parseISO } from "date-fns";
import { convertTZ } from "../../DayCalculator";
import { UserStoreContext } from "../../../../stores/UserStore";
import FormDropdown from "../Dropdown/FormDropdown";
import FormInputBox from "../InputBox/FormInputBox";
import { getCorrectTimezone } from "../../../../shared/dateTimeTimezoneFormatter";
import moment from "moment";

export const operationDaysOptions = [
  { value: "days", label: "Day(s)" },
  { value: "hours", label: "Hour(s)" },
  { value: "minutes", label: "Minute(s)" },
];

function JSONDateTimePicker(
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
    dropdownFields = [],
    dataTestId,
    hideValidationMessages,
  }: JSONDateTimePickerProps,
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
  const { values, setFieldValue } =
    useFormikContext<Record<string, string | Record<string, string>>>();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [timePickerOpen, setTimePickerOpen] = React.useState(false);
  const [componentLoaded, setComponentLoaded] = React.useState(false);
  const scrollPosition = useScrollPosition();

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
      setFieldValue(name, {
        executorField: values[`${name}-DateField`],
        adjust: {
          type: values[`${name}-OperationType`],
          [values[`${name}-OperationDays`] as string]:
            values[`${name}-OperationTypeValue`],
        },
        at:
          values[`${name}-TriggerAt`] === "triggerTime"
            ? null
            : user?.timezone
            ? getCorrectTimezone(finalDate as any, user?.timezone)
                ?.split("T")[1]
                .replace("Z", "")
            : moment(finalDate).toISOString().split("T")[1].replace("Z", ""),
      });
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
      setFieldValue(name, {
        executorField: values[`${name}-DateField`],
        adjust: {
          type: values[`${name}-OperationType`],
          [values[`${name}-OperationDays`] as string]:
            values[`${name}-OperationTypeValue`],
        },
        at:
          values[`${name}-TriggerAt`] === "triggerTime"
            ? null
            : user?.timezone
            ? getCorrectTimezone(finalDate as any, user?.timezone)
                ?.split("T")[1]
                .replace("Z", "")
            : moment(finalDate).toISOString().split("T")[1].replace("Z", ""),
      });
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
      setFieldValue(name, {
        executorField: values[`${name}-DateField`],
        adjust: {
          type: values[`${name}-OperationType`],
          [values[`${name}-OperationDays`] as string]:
            values[`${name}-OperationTypeValue`],
        },
        at:
          values[`${name}-TriggerAt`] === "triggerTime"
            ? null
            : user?.timezone
            ? getCorrectTimezone(finalDate as any, user?.timezone)
                ?.split("T")[1]
                .replace("Z", "")
            : moment(finalDate).toISOString().split("T")[1].replace("Z", ""),
      });
      return;
    }
  };

  React.useEffect(() => {
    if (values[name] && componentLoaded === false) {
      let timeValue = _.get(values[name], "at", null);
      setFieldValue(
        `${name}-DateField`,
        _.get(values[name], "executorField", "")
      );
      if (_.get(values[name], "adjust", "")) {
        setFieldValue(
          `${name}-OperationType`,
          _.get(_.get(values[name], "adjust", ""), "type", "")
        );
      }

      let findOperationDaysKey = "days";
      Object.keys(_.get(values[name], "adjust", {})).forEach((key) => {
        if (operationDaysOptions.map((option) => option.value).includes(key)) {
          findOperationDaysKey = key;
        }
      });

      if (_.get(values[name], "adjust", "")) {
        setFieldValue(
          `${name}-OperationTypeValue`,
          _.get(
            _.get(values[name], "adjust", ""),
            `${findOperationDaysKey}`,
            ""
          )
        );
        setFieldValue(`${name}-OperationDays`, findOperationDaysKey);
      }
      setFieldValue(`${name}-TriggerAt`, timeValue ? "newTime" : "triggerTime");
      const timeZonePreference = timezone
        ? timezone
        : get(user ?? userDetails, "timezone", "");
      if (timeZonePreference && timeValue) {
        let parseDate = parseISO(timeValue as string);
        if (
          String(parseDate) === "Invalid Date" ||
          String(parseDate) === "Invalid time"
        ) {
          setSelectedDate(new Date(timeValue as string));
        } else {
          setSelectedDate(convertTZ(timeValue as string, timeZonePreference));

          setFieldValue(name, {
            ...(values[name] as Record<string, string>),
            at: timeValue
              ? timeValue
              : "triggerTime" === "triggerTime"
              ? null
              : timeValue,
          });
        }
      } else {
        if (timeValue) {
          setSelectedDate(new Date(timeValue as string));
        }
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
    let timeValue = _.get(values[name] as Record<string, string>, "at", null);
    if (timeValue === null) {
      setSelectedDate(null);
    }
    if (Array.isArray(timeValue) && timeValue.length === 0) {
      setSelectedDate(null);
      setFieldValue(name, null);
    }
  }, [values[name]]);

  React.useEffect(() => {
    setTimePickerOpen(false);
  }, [scrollPosition]);

  const nextStepMarker = (
    <p className="whitespace-nowrap text-vryno-theme-blue-disable">{`-`}</p>
  );

  const dateFieldsList = [
    { value: "triggeredDate", label: "Triggered Date" },
    ...dropdownFields
      ?.filter(
        (field) => field.dataType === "datetime" || field.dataType === "date"
      )
      ?.map((field) => {
        return { value: field.name, label: field.label.en };
      }),
  ];

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
      </div>
      <div
        className={`relative w-full grid grid-cols-12 gap-x-1 items-center text-sm placeholder-vryno-placeholder ${textBoxClasses} ${
          timePickerOpen ? "z-[1000]" : ""
        }`}
      >
        <div className="col-span-4 items-center grid grid-cols-5 gap-x-1">
          <div className="col-span-3 flex items-center gap-x-1">
            <FormDropdown
              required={required}
              editMode={editMode}
              name={`${name}-DateField`}
              options={[...dateFieldsList]}
              onChange={(selectedOption: any) => {
                setFieldValue(
                  `${name}-DateField`,
                  selectedOption.currentTarget.value
                );
                setFieldValue(name, {
                  ...(values[name] as Record<string, string>),
                  executorField: selectedOption.currentTarget.value,
                });
              }}
              allowMargin={false}
            />
            {nextStepMarker}
          </div>
          <div className="col-span-2 flex items-center gap-x-1">
            <FormDropdown
              required={required}
              editMode={editMode}
              name={`${name}-OperationType`}
              options={[
                { value: "after", label: "plus" },
                { value: "before", label: "minus" },
              ]}
              onChange={(selectedOption: any) => {
                setFieldValue(
                  `${name}-OperationType`,
                  selectedOption.currentTarget.value
                );
                setFieldValue(name, {
                  ...(values[name] as Record<string, string>),
                  adjust: _.get(values[name], "adjust", "")
                    ? {
                        ...(_.get(values[name], "adjust", {}) as Record<
                          string,
                          string
                        >),
                        type: selectedOption.currentTarget.value,
                      }
                    : { type: selectedOption.currentTarget.value },
                });
              }}
              allowMargin={false}
              disabled={!values[`${name}-DateField`]}
            />
            {nextStepMarker}
          </div>
        </div>
        <div className="flex items-center gap-x-1">
          <FormInputBox
            required={required}
            name={`${name}-OperationTypeValue`}
            type={"number"}
            allowMargin={false}
            onChange={(e) => {
              setFieldValue(
                `${name}-OperationTypeValue`,
                Number(e.currentTarget.value)
              );
              if (!values[`${name}-OperationDays`]) {
                setFieldValue(`${name}-OperationDays`, "days");
              }

              setFieldValue(name, {
                ...(values[name] as Record<string, string>),
                adjust: _.get(values[name], "adjust", "")
                  ? {
                      ...(_.get(values[name], "adjust", {}) as Record<
                        string,
                        string
                      >),
                      [(values[`${name}-OperationDays`] as string) ?? "days"]:
                        Number(e.currentTarget.value),
                    }
                  : {
                      [(values[`${name}-OperationDays`] as string) ?? "days"]:
                        Number(e.currentTarget.value),
                    },
              });
            }}
            disabled={!values[`${name}-OperationType`]}
          />
          {nextStepMarker}
        </div>
        <div className="col-span-2 flex items-center gap-x-1">
          <FormDropdown
            required={required}
            editMode={editMode}
            name={`${name}-OperationDays`}
            options={operationDaysOptions}
            onChange={(selectedOption: any) => {
              setFieldValue(
                `${name}-OperationDays`,
                selectedOption.currentTarget.value
              );
              if (typeof values[`${name}-OperationTypeValue`] !== "number")
                setFieldValue(`${name}-OperationTypeValue`, 1);

              const findKey = Object.keys(
                _.get(values[name], "adjust", {})
              ).find((key) =>
                operationDaysOptions.map((option) => option.value).includes(key)
              );
              if (findKey) {
                delete _.get(values[name], "adjust", {} as any)[findKey];
              }

              setFieldValue(name, {
                ...(values[name] as Record<string, string>),
                adjust: _.get(values[name], "adjust", "")
                  ? {
                      ...(_.get(values[name], "adjust", {}) as Record<
                        string,
                        string
                      >),
                      [selectedOption.currentTarget.value]:
                        typeof values[`${name}-OperationTypeValue`] === "number"
                          ? values[`${name}-OperationTypeValue`]
                          : 1,
                    }
                  : {
                      [selectedOption.currentTarget.value]:
                        typeof values[`${name}-OperationTypeValue`] === "number"
                          ? values[`${name}-OperationTypeValue`]
                          : 1,
                    },
              });
            }}
            allowMargin={false}
            disabled={
              typeof values[`${name}-OperationTypeValue`] !== "number" &&
              !values[`${name}-OperationTypeValue`]
            }
          />
          {nextStepMarker}
        </div>
        <div className="col-span-3 flex items-center gap-x-1">
          <p className="pr-1">at</p>
          <FormDropdown
            required={required}
            editMode={editMode}
            name={`${name}-TriggerAt`}
            options={[
              {
                value: "triggerTime",
                label: `Use time from ${
                  dateFieldsList?.find(
                    (field) => field.value === values[`${name}-DateField`]
                  )?.label ?? ""
                }`,
              },
              { value: "newTime", label: "New Time" },
            ]}
            onChange={(selectedOption: any) => {
              setFieldValue(
                `${name}-TriggerAt`,
                selectedOption.currentTarget.value
              );
              if (selectedOption.currentTarget.value === "triggerTime") {
                setFieldValue("time", null);
                setFieldValue(name, {
                  ...(values[name] as Record<string, string>),
                  at: null,
                });
              }
            }}
            disabled={!values[`${name}-OperationDays`]}
            allowMargin={false}
          />
        </div>
        <div
          className="col-span-2 flex items-center gap-x-1"
          data-testid={
            dataTestId ? paramCase(dataTestId) : paramCase(`${name}`)
          }
        >
          {nextStepMarker}
          <DatePicker
            id="time"
            data-testid={
              dataTestId ? paramCase(dataTestId) : paramCase(`${name}`)
            }
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
            disabled={disabled || values[`${name}-TriggerAt`] !== "newTime"}
            autoComplete="off"
            ref={ref}
            className={`border w-full focus:outline-none ${
              paddingInPixelForInputBox
                ? `py-[${paddingInPixelForInputBox}px]`
                : "py-2"
            } focus:shadow-md rounded-md
                   ${borderClass} ${focusBorderClass} ${paddingLeftClass} ${paddingRightClass}`}
          />
        </div>
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
export default React.forwardRef(JSONDateTimePicker);
