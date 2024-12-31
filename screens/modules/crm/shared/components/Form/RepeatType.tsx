import React, { useContext } from "react";
import { useFormikContext } from "formik";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDatePicker from "../../../../../../components/TailwindControls/Form/DatePicker/FormDatePicker";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { MixpanelActions } from "../../../../../Shared/MixPanel";

const frequencyOptions = [
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

export const RepeatType = ({
  allowMargin = true,
}: {
  allowMargin?: boolean;
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const [repeatActive, setRepeatActive] = React.useState(false);
  const [termTypeValue, setTermTypeValue] = React.useState("n");

  // {
  //     "frequency": "d", // d = Daily , w = weekly, m = monthly ( Define a python enum)
  //     "termType": "n", // n = never, f = fixed, d = date (Define a python enum)
  //     "termValue": integer or a date // as per the `termType` if termType is f = fixed it should be integer greater than 0 , if termType is d = Date it should be future date
  // }

  return (
    <div className="flex gap-4">
      <SwitchToggle
        name={"repeatActive"}
        label={"Repeat"}
        onChange={() => {
          setRepeatActive(!repeatActive);
          MixpanelActions.track(`switch-repeat-type-active:toggle-click`, {
            type: "switch",
          });
        }}
        value={`${repeatActive}`}
      />
      <FormDropdown
        name={"frequency"}
        label={"Repeat Type"}
        options={frequencyOptions}
        onChange={(selectedOption) => {
          setFieldValue("frequency", selectedOption.currentTarget.value);
        }}
        allowMargin={allowMargin}
        disabled={repeatActive}
        // value={}
      />
      <FormDropdown
        name={"termType"}
        label={"Ends"}
        options={termTypeOptions}
        onChange={(selectedOption) => {
          setTermTypeValue(selectedOption.currentTarget.value);
          setFieldValue("termType", selectedOption.currentTarget.value);
        }}
        allowMargin={allowMargin}
        disabled={repeatActive}
      />
      {!(termTypeValue === "n") ? (
        termTypeValue === "f" ? (
          <FormInputBox
            name={"termType"}
            label={""}
            type={"number"}
            allowMargin={allowMargin}
            disabled={false}
            onChange={(selectedOption) => {
              setFieldValue("termType", selectedOption.currentTarget.value);
            }}
          />
        ) : (
          <FormDatePicker
            name={"termType"}
            label={""}
            // editMode={false}
            placeholder="date"
            type="date"
            allowMargin={allowMargin}
            disabled={false}
            onChange={(selectedOption: any) => {
              setFieldValue("termType", selectedOption.currentTarget.value);
            }}
            user={user ?? undefined}
          />
        )
      ) : (
        <FormDropdown
          name={"termValue"}
          label={""}
          onChange={() => {}}
          allowMargin={allowMargin}
          disabled={true}
          value={undefined}
        />
      )}
    </div>
  );
};
