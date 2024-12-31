import React from "react";
import { GetOptionsJSX } from "../../../../../../components/TailwindControls/Form/Dropdown/OptionsJSX";
import { paramCase } from "change-case";
import { useFormikContext } from "formik";

export type DropdownSelectProps = {
  name: string;
  required: boolean;
  disabled: boolean;
  options: {
    label: string;
    value: string | null;
    visible?: boolean | undefined;
    extraInfoField?: boolean;
  }[];
  editMode: boolean;
  dropdownTextColor?: string;
  onChange: ((e: React.ChangeEvent<any>) => void) | undefined;
};

export const DropdownSelect = ({
  name,
  required,
  disabled,
  options,
  editMode,
  dropdownTextColor,
  onChange,
}: DropdownSelectProps) => {
  const { values } = useFormikContext<Record<string, string>>();
  return (
    <select
      id={paramCase(name)}
      data-testid={paramCase(name)}
      name={`${name}`}
      required={required}
      disabled={disabled}
      onChange={onChange}
      // @ts-ignore
      placeholder={
        values[name] && options.length > 0
          ? options?.filter((option) => option?.value === values[name])[0]
              ?.label
          : ""
      }
      value={values[name] ? values[name] : ""}
      className={`border relative rounded-md
      text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none w-full`}
    >
      <GetOptionsJSX
        options={options}
        editMode={editMode}
        name={name}
        dropdownTextColor={dropdownTextColor}
      />
    </select>
  );
};
