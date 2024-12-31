import React, { useContext } from "react";
import { FormikValues, useFormikContext } from "formik";
import SwitchToggle from "../../SwitchToggle/SwitchToggle";
import FormDropdown from "../../Dropdown/FormDropdown";
import FormInputBox from "../../InputBox/FormInputBox";
import FormDatePicker from "../../DatePicker/FormDatePicker";
import { toast } from "react-toastify";
import moment from "moment";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { MixpanelActions } from "../../../../../screens/Shared/MixPanel";

const frequencyOptions = [
  {
    value: "hf",
    label: "Half Hour",
  },
  {
    value: "d",
    label: "Daily",
  },
  {
    value: "w",
    label: "Weekly",
  },
  {
    value: "m",
    label: "Monthly",
  },
  {
    value: "y",
    label: "Yearly",
  },
];

const termTypeOptions = [
  {
    value: "n",
    label: "Never",
  },
  {
    value: "f",
    label: "Fixed",
  },
  {
    value: "d",
    label: "Date",
  },
];

export const FormTaskRepeat = ({
  allowMargin = true,
  editMode,
  fieldCustomization,
}: {
  allowMargin?: boolean;
  editMode: boolean;
  fieldCustomization?: boolean;
}) => {
  const today = new Date();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [repeatActive, setRepeatActive] = React.useState(false);

  React.useEffect(() => {
    if (values.repeat && editMode) {
      if (Object.keys(values.repeat).length !== 0) {
        setFieldValue("repeat", { ...values.repeat });
        setFieldValue("jsonFrequency", values.repeat.frequency);
        setFieldValue("jsonTermType", values.repeat.termType);
        setFieldValue(
          "jsonTermValue",
          values.repeat.termType === "d"
            ? moment(values.repeat.termValue).format("YYYY-MM-DD")
            : values.repeat.termValue
        );
        setFieldValue("jsonRepeatActive", true);
        setRepeatActive(true);
      }
    }
  }, []);

  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 sm:flex gap-x-4 sm:justify-around `}
    >
      <div className="w-[13%]">
        <SwitchToggle
          name={"jsonRepeatActive"}
          label={"Repeat"}
          onChange={() => {
            setFieldValue("jsonRepeatActive", !values.jsonRepeatActive);
            if (!values.jsonRepeatActive) {
              setFieldValue("repeat", {
                frequency: "d",
                termType: "n",
                termValue: 0,
              });
              setFieldValue("jsonFrequency", "d");
              setFieldValue("jsonTermType", "n");
              setFieldValue("jsonTermValue", 0);
            } else {
              setFieldValue("repeat", null);
              setFieldValue("jsonFrequency", null);
              setFieldValue("jsonTermType", null);
              setFieldValue("jsonTermValue", 0);
            }
            setRepeatActive(!repeatActive);
            MixpanelActions.track(
              `switch-task-repeat-toggle-repeat:toggle-click`,
              {
                type: "switch",
              }
            );
          }}
          value={`${repeatActive}`}
          disabled={fieldCustomization}
          width={"auto"}
        />
      </div>
      <div className="sm:w-44">
        <FormDropdown
          name={"jsonFrequency"}
          label={"Repeat Type"}
          options={frequencyOptions}
          onChange={(selectedOption) => {
            setFieldValue("jsonFrequency", selectedOption.currentTarget.value);
            setFieldValue("repeat", {
              frequency: selectedOption.currentTarget.value,
              termType: values.jsonTermType,
              termValue: values.jsonTermValue,
            });
          }}
          allowMargin={allowMargin}
          disabled={!repeatActive || fieldCustomization}
          placeholder={"Please select"}
        />
      </div>
      <div className="sm:w-44">
        <FormDropdown
          name={"jsonTermType"}
          label={"Ends"}
          options={termTypeOptions}
          onChange={(selectedOption) => {
            setFieldValue("jsonTermType", selectedOption.currentTarget.value);
            setFieldValue("repeat", {
              frequency: values.jsonFrequency,
              termType: selectedOption.currentTarget.value,
              termValue:
                selectedOption.currentTarget.value === "n"
                  ? 0
                  : selectedOption.currentTarget.value === "f"
                  ? 1
                  : moment(today.getTime() + 86400000).format("YYYY-MM-DD"), //current day + no. of millsec in a day = next day
            });
            setFieldValue(
              "jsonTermValue",
              selectedOption.currentTarget.value === "n"
                ? 0
                : selectedOption.currentTarget.value === "f"
                ? 1
                : moment(today.getTime() + 86400000).format("YYYY-MM-DD") //current day + no. of millsec in a day = next day
            );
          }}
          allowMargin={allowMargin}
          disabled={!repeatActive || fieldCustomization}
          placeholder={"Please select"}
        />
      </div>
      <div className="mt-[30px]">
        {!(values?.jsonTermType === "n") && values.jsonTermType ? (
          values.jsonTermType === "f" ? (
            <FormInputBox
              name={"jsonTermValue"}
              type={"number"}
              allowMargin={allowMargin}
              disabled={false || fieldCustomization}
              onChange={(selectedOption) => {
                setFieldValue(
                  "jsonTermValue",
                  selectedOption.currentTarget.value
                );
                setFieldValue("repeat", {
                  frequency: values.jsonFrequency,
                  termType: values.jsonTermType,
                  termValue: selectedOption.currentTarget.value,
                });
              }}
            />
          ) : (
            <FormDatePicker
              name={"jsonTermValue"}
              placeholder="date"
              type="date"
              allowMargin={allowMargin}
              disabled={false || fieldCustomization}
              onChange={(date: any) => {
                if (date.getTime() < today.getTime()) {
                  toast.error("Please select a future date");
                } else {
                  setFieldValue(
                    "jsonTermValue",
                    moment(date).format("YYYY-MM-DD")
                  );
                  setFieldValue("repeat", {
                    frequency: values.jsonFrequency,
                    termType: values.jsonTermType,
                    termValue: moment(date).format("YYYY-MM-DD"),
                  });
                }
              }}
              user={user ?? undefined}
            />
          )
        ) : (
          <FormInputBox
            name={"jsonTermValue"}
            type={"number"}
            allowMargin={allowMargin}
            disabled={true || fieldCustomization}
            onChange={() => {}}
          />
        )}
      </div>
    </div>
  );
};
