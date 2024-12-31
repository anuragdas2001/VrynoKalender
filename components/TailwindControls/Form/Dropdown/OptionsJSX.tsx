import { kebabCase } from "change-case";
import { FormikValues, useFormikContext } from "formik";

export const GetOptionsJSX = ({
  name,
  options,
  editMode,
  dropdownTextColor,
  allowColourInValue,
}: {
  name: string;
  options: (
    | {
        label: string;
        value: string | null;
        visible?: boolean | undefined;
        extraInfoField?: boolean;
        colourHex?: string;
      }
    | undefined
  )[];
  editMode: boolean;
  dropdownTextColor?: string;
  allowColourInValue?: boolean;
}) => {
  const { values } = useFormikContext<FormikValues>();
  return (
    <>
      {options.length > 0 &&
        options
          ?.filter((opt, index) => {
            if (!editMode && typeof opt?.visible === "boolean" && !opt.visible)
              return null;
            else if (
              editMode &&
              typeof opt?.visible === "boolean" &&
              !opt.visible &&
              values[name] === opt.value
            )
              return opt;
            else if (
              editMode &&
              typeof opt?.visible === "boolean" &&
              !opt.visible &&
              values[name] !== opt.value
            )
              return null;
            else return opt;
          })
          ?.filter((opt) => opt)
          .map((opt, index) => (
            <option
              className={`w-full text-xsm ${dropdownTextColor} flex flex-row items-center gap-x-2`}
              id={opt?.label}
              data-testid={kebabCase(opt?.label ?? "")}
              key={index}
              value={opt?.value ? opt?.value : undefined}
              label={`${
                allowColourInValue && opt?.colourHex ? "\u2B24   " : ""
              }${opt?.label}${opt?.extraInfoField ? "**" : ""}`}
              disabled={typeof opt?.visible === "boolean" && !opt.visible}
              style={
                allowColourInValue && opt?.colourHex
                  ? { color: opt?.colourHex }
                  : { color: "black" }
              }
            >
              {allowColourInValue && opt?.colourHex ? "\u2B24   " : ""}
              {`${opt?.label}${opt?.extraInfoField ? "**" : ""}`}
            </option>
          ))}
    </>
  );
};
