import { useFormikContext } from "formik";
import CheckIcon from "remixicon-react/CheckLineIcon";
import RequiredIndicator from "../../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

const BAR_COLORS = [
  "#005792",
  "#448EF6",
  "#FDB44B",
  "#FF7E67",
  "#3D2C8D",
  "#1C0C5B",
  "#6998AB",
  "#B1D0E0",
  "#4B3869",
  "#664E88",
  "#F0D9FF",
  "#39A2DB",
  "#A2DBFA",
  "#A7BBC7",
  "#DA7F8F",
  "#92967D",
  "#C8C6A7",
  "#F4ABC4",
  "#7579E7",
  "#E7DFD5",
];

export const CalendarColorPicker = ({
  name,
  label,
  labelSize = "text-sm",
  marginTop,
  onClick,
  selectedColorList,
}: {
  name: string;
  label?: string;
  labelSize?: string;
  marginTop?: string;
  onClick: (color: string) => void;
  selectedColorList: string[];
}) => {
  const { values } = useFormikContext<Record<string, string>>();

  return BAR_COLORS.length === selectedColorList?.length ? (
    <div className="mt-2">
      <p className="text-gray-500 text-sm">
        No unique color left to choose
        <RequiredIndicator required={true} />
      </p>
    </div>
  ) : (
    <div className={`w-full ${marginTop || ""}`}>
      {label && (
        <label className={`tracking-wide text-vryno-label-gray ${labelSize}`}>
          {label}
          <RequiredIndicator required={true} />
        </label>
      )}
      <div className="grid grid-cols-6 gap-2 mt-2">
        {BAR_COLORS.filter((color) => !selectedColorList.includes(color)).map(
          (color, index) => {
            return (
              <Button
                id="color-picker"
                key={`color-${index}`}
                customStyle={`w-8 h-8 rounded-full flex justify-center items-center`}
                cssStyle={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(color);
                }}
                userEventName="color-picker-click"
              >
                {values[name] === color ? <CheckIcon size={20} /> : <></>}
              </Button>
            );
          }
        )}
      </div>
    </div>
  );
};
