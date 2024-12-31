import ArrowRightIcon from "remixicon-react/ArrowRightLineIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import ArrowLeftIcon from "remixicon-react/ArrowLeftLineIcon";
import RequiredIndicator from "../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";

export const GenericFieldsSelector = ({
  availableFieldsList,
  availableThresholdFieldsList,
  selectedFieldsList,
  selectedThresholdFieldsList,
  handleAvailableFieldSelection,
  setSelectedThresholdFieldsList,
  handleSelectedFieldSelection,
  setAvailableThresholdFieldsList,
  handleAvailableFields,
  handleSelectedFields,
  containerMargin = "my-4",
}: {
  availableFieldsList: ISimplifiedCustomField[];
  availableThresholdFieldsList: ISimplifiedCustomField[];
  selectedFieldsList: ISimplifiedCustomField[];
  selectedThresholdFieldsList: ISimplifiedCustomField[];
  handleAvailableFieldSelection: (field: ISimplifiedCustomField) => void;
  handleSelectedFieldSelection: (field: ISimplifiedCustomField) => void;
  setSelectedThresholdFieldsList: (fields: ISimplifiedCustomField[]) => void;
  setAvailableThresholdFieldsList: (fields: ISimplifiedCustomField[]) => void;
  handleAvailableFields: () => void;
  handleSelectedFields: () => void;
  containerMargin?: string;
}) => {
  return (
    <>
      <div className={`grid sm:grid-cols-12 ${containerMargin}`}>
        <div className="sm:col-span-5 flex flex-col">
          <span className=" mb-2.5 text-sm tracking-wide font-medium">
            Available Fields
          </span>
          <div className="border border-vryno-form-border-gray rounded-xl w-full h-64 p-3">
            <div className="w-full h-full overflow-y-scroll">
              {availableFieldsList.map((field, index) => (
                <span
                  onClick={() => {
                    handleAvailableFieldSelection(field);
                    setSelectedThresholdFieldsList([]);
                  }}
                  key={index}
                  className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                    availableThresholdFieldsList.includes(field)
                      ? "bg-vryno-theme-highlighter-blue"
                      : ""
                  }`}
                >
                  {field.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 flex flex-row sm:flex-col items-center justify-center">
          <Button
            id={"custom-add-field-action-down"}
            onClick={() => handleAvailableFields()}
            customStyle="cursor-pointer sm:hidden w-10 h-10 rounded-md flex justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue"
            userEventName="customView-add-field-down-click"
          >
            <ArrowDownIcon className="text-white" />
          </Button>
          <Button
            id={"custom-add-field-action-right"}
            onClick={() => handleAvailableFields()}
            customStyle="cursor-pointer hidden sm:flex w-10 h-10 rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue"
            userEventName="customView-add-field-right-click"
          >
            <ArrowRightIcon className="text-white" />
          </Button>
          <Button
            id={"custom-remove-field-action-up"}
            onClick={() => handleSelectedFields()}
            customStyle="cursor-pointer sm:hidden w-10 h-10 rounded-md flex justify-center items-center  my-4 mx-2 bg-vryno-theme-light-blue"
            userEventName="customView-remove-field-up-click"
          >
            <ArrowUpIcon className="text-white" />
          </Button>
          <Button
            id={"custom-remove-field-action-left"}
            onClick={() => handleSelectedFields()}
            customStyle="cursor-pointer hidden sm:flex w-10 h-10 rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue"
            userEventName="customView-remove-field-left-click"
          >
            <ArrowLeftIcon className="text-white" />
          </Button>
        </div>
        <div className="sm:col-span-5 flex flex-col">
          <span className=" mb-2.5 text-sm tracking-wide font-medium">
            Selected Fields
            <RequiredIndicator required={true} />
          </span>
          <div
            className={`border ${
              selectedFieldsList.length === 0
                ? "border-red-200"
                : "border-vryno-form-border-gray"
            } rounded-xl w-full h-64  p-3`}
          >
            <div className="w-full h-full overflow-y-scroll">
              {selectedFieldsList.map((field, index) => (
                <span
                  onClick={() => {
                    handleSelectedFieldSelection(field);
                    setAvailableThresholdFieldsList([]);
                  }}
                  key={index}
                  className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                    selectedThresholdFieldsList.includes(field)
                      ? "bg-vryno-theme-highlighter-blue"
                      : ""
                  }`}
                >
                  {field.label}
                </span>
              ))}
            </div>
          </div>
          <span className="mt-1 text-xs text-red-600">
            {selectedFieldsList.length === 0
              ? "* Please select atleast one field"
              : ""}
          </span>
        </div>
      </div>
    </>
  );
};
