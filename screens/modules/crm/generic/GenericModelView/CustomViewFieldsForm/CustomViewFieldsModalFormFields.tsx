import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import RequiredIndicator from "../../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";
import ArrowRightIcon from "remixicon-react/ArrowRightLineIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import ArrowLeftIcon from "remixicon-react/ArrowLeftLineIcon";
import { ICustomField } from "../../../../../../models/ICustomField";
import { useTranslation } from "react-i18next";

export type CustomViewFieldsModalFormFieldsProps = {
  availableFieldsList: ICustomField[];
  selectedFieldsList: ICustomField[];
  availableFieldsListThreshold: ICustomField[];
  selectedFieldsListThreshold: ICustomField[];
  savingProcess: boolean;
  handleAddFieldToAvailableFieldsList: (field: ICustomField) => void;
  handleAddFieldToSelectedFieldsList: (field: ICustomField) => void;
  handleAddThresholdToSelected: (fields: ICustomField[]) => void;
  handleAddThresholdToAvailable: (fields: ICustomField[]) => void;
  setAvailableFieldsListThreshold: (fields: ICustomField[]) => void;
  setSelectedFieldsListThreshold: (fields: ICustomField[]) => void;
  handleSave: () => void;
  onCancel: () => void;
};

export const CustomViewFieldsModalFormFields = ({
  availableFieldsList,
  availableFieldsListThreshold,
  selectedFieldsList,
  selectedFieldsListThreshold,
  savingProcess,
  handleAddFieldToAvailableFieldsList,
  handleAddFieldToSelectedFieldsList,
  handleAddThresholdToAvailable,
  handleAddThresholdToSelected,
  setAvailableFieldsListThreshold,
  setSelectedFieldsListThreshold,
  handleSave,
  onCancel,
}: CustomViewFieldsModalFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  return (
    <>
      <div className="grid sm:grid-cols-12 my-4 ">
        <div className="sm:col-span-5 flex flex-col">
          <span className=" mb-2.5 text-sm tracking-wide font-medium">
            Available Fields
          </span>
          <div className="border border-vryno-form-border-gray rounded-xl w-full h-64 p-3">
            <div className="w-full h-full overflow-y-scroll">
              {availableFieldsList.map((field, index) => (
                <span
                  onClick={() => {
                    handleAddFieldToAvailableFieldsList(field);
                    setSelectedFieldsListThreshold([]);
                  }}
                  key={index}
                  className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                    availableFieldsListThreshold.includes(field)
                      ? "bg-vryno-theme-highlighter-blue"
                      : ""
                  }`}
                >
                  {field?.label?.en}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 flex flex-row sm:flex-col items-center justify-center">
          <Button
            id={"custom-add-field-action-down"}
            onClick={
              availableFieldsListThreshold?.length > 0
                ? () => {
                    handleAddThresholdToSelected(availableFieldsListThreshold);
                    setAvailableFieldsListThreshold([]);
                  }
                : () => {}
            }
            customStyle={`cursor-pointer sm:hidden w-10 h-10 ${
              availableFieldsListThreshold?.length > 0 ? "" : "opacity-50"
            } rounded-md flex justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue`}
            userEventName="customView-add-field-down-click"
          >
            <ArrowDownIcon className="text-white" />
          </Button>
          <Button
            id={"custom-add-field-action-right"}
            onClick={
              availableFieldsListThreshold?.length > 0
                ? () => {
                    handleAddThresholdToSelected(availableFieldsListThreshold);
                    setAvailableFieldsListThreshold([]);
                  }
                : () => {}
            }
            customStyle={`cursor-pointer hidden sm:flex w-10 h-10 ${
              availableFieldsListThreshold?.length > 0 ? "" : "opacity-50"
            } rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue`}
            userEventName="customView-add-field-right-click"
          >
            <ArrowRightIcon className="text-white" />
          </Button>
          <Button
            id={"custom-remove-field-action-up"}
            onClick={
              selectedFieldsListThreshold?.length > 0
                ? () => {
                    handleAddThresholdToAvailable(selectedFieldsListThreshold);
                    setSelectedFieldsListThreshold([]);
                  }
                : () => {}
            }
            customStyle={`cursor-pointer sm:hidden w-10 h-10 ${
              selectedFieldsListThreshold?.length > 0 ? "" : "opacity-50"
            } rounded-md flex justify-center items-center  my-4 mx-2 bg-vryno-theme-light-blue`}
            userEventName="customView-remove-field-up-click"
          >
            <ArrowUpIcon className="text-white" />
          </Button>
          <Button
            id={"custom-remove-field-action-left"}
            onClick={
              selectedFieldsListThreshold?.length > 0
                ? () => {
                    handleAddThresholdToAvailable(selectedFieldsListThreshold);
                    setSelectedFieldsListThreshold([]);
                  }
                : () => {}
            }
            customStyle={`cursor-pointer hidden sm:flex w-10 h-10 ${
              selectedFieldsListThreshold?.length > 0 ? "" : "opacity-50"
            } rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue`}
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
                    handleAddFieldToSelectedFieldsList(field);
                    setAvailableFieldsListThreshold([]);
                  }}
                  key={index}
                  className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                    selectedFieldsListThreshold.includes(field)
                      ? "bg-vryno-theme-highlighter-blue"
                      : ""
                  }`}
                >
                  {field?.label?.en}
                </span>
              ))}
            </div>
          </div>
          <span className="mt-1 text-xs text-vryno-label-gray">
            {selectedFieldsList.length === 0
              ? "* Please select atleast one field"
              : ""}
          </span>
        </div>
      </div>
      <div className="grid sm:grid-cols-12 my-4 ">
        <div className="col-span-5">
          <Button
            id="cancel-form"
            onClick={() => onCancel()}
            kind="back"
            disabled={savingProcess}
            userEventName="custom-view-field-save:cancel-click"
          >
            {t("common:cancel")}
          </Button>
        </div>
        <div className="col-span-2" />
        <div className="col-span-5">
          <Button
            id="save-form"
            onClick={() => handleSave()}
            loading={savingProcess}
            kind="primary"
            disabled={savingProcess}
            userEventName="custom-view-field-save:submit-click"
          >
            {t("common:save")}
          </Button>
        </div>
      </div>
    </>
  );
};
