import React from "react";
import ArrowRightIcon from "remixicon-react/ArrowRightLineIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import ArrowLeftIcon from "remixicon-react/ArrowLeftLineIcon";
import RequiredIndicator from "../../../../../../components/TailwindControls/Form/Shared/RequiredIndicator";
import { ICustomField } from "../../../../../../models/ICustomField";
import { Formik } from "formik";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { get } from "lodash";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "react-i18next";

export type ChooseFieldsForReverseLookupProps = {
  availableFieldsList: ICustomField[];
  selectedFieldsList: ICustomField[];
  loading: boolean;
  onCancel: () => void;
  handleAvailableFields: (fields: ICustomField[]) => void;
  handleSelectedFields: (fields: ICustomField[]) => void;
  handleSave: () => void;
};

export const ChooseFieldsForReverseLookup = ({
  availableFieldsList,
  selectedFieldsList,
  loading,
  onCancel,
  handleAvailableFields,
  handleSelectedFields,
  handleSave,
}: ChooseFieldsForReverseLookupProps) => {
  const { t } = useTranslation(["common"]);

  const [availableFieldsForMoving, setAvailableFieldsForMoving] =
    React.useState<ICustomField[]>([]);
  const [selectFieldsForMoving, setSelectFieldsForMoving] = React.useState<
    ICustomField[]
  >([]);

  const handleAvailableFieldsSelectedForMoving = (field: ICustomField) => {
    const findIndex = availableFieldsForMoving.findIndex(
      (item) => item.uniqueName === field.uniqueName
    );
    if (findIndex === -1) {
      setAvailableFieldsForMoving([...availableFieldsForMoving, field]);
    } else {
      let updatedArray = [...availableFieldsForMoving];
      updatedArray = updatedArray.filter(
        (item) => item.uniqueName !== field.uniqueName
      );
      setAvailableFieldsForMoving(updatedArray);
    }
  };

  const handleSelectedFieldsSelectedForMoving = (field: ICustomField) => {
    const findIndex = selectFieldsForMoving.findIndex(
      (item) => item.uniqueName === field.uniqueName
    );
    if (findIndex === -1) {
      setSelectFieldsForMoving([...selectFieldsForMoving, field]);
    } else {
      let updatedArray = [...selectFieldsForMoving];
      updatedArray = updatedArray.filter(
        (item) => item.uniqueName !== field.uniqueName
      );
      setSelectFieldsForMoving(updatedArray);
    }
  };

  return (
    <Formik
      initialValues={{}}
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        handleSave();
      }}
    >
      {({ handleSubmit, values }) => (
        <GenericFormModalContainer
          formHeading="Choose Fields"
          onCancel={() => onCancel()}
          onOutsideClick={() => onCancel()}
        >
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
                          handleAvailableFieldsSelectedForMoving(field);
                          setSelectFieldsForMoving([]);
                        }}
                        key={index}
                        className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                          availableFieldsForMoving.findIndex(
                            (item) => item.uniqueName === field.uniqueName
                          ) === -1
                            ? ""
                            : "bg-vryno-theme-highlighter-blue"
                        }`}
                      >
                        {get(field.label, "en", "")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-row sm:flex-col items-center justify-center">
                <Button
                  id={"custom-add-field-action-down"}
                  onClick={() => {
                    handleAvailableFields(availableFieldsForMoving);
                    setSelectFieldsForMoving([]);
                    setAvailableFieldsForMoving([]);
                  }}
                  customStyle={`sm:hidden w-10 h-10 rounded-md flex justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue ${
                    availableFieldsForMoving?.length > 0
                      ? "cursor-pointer"
                      : "opacity-40 cursor-default"
                  }`}
                  userEventName="reverseLookup-field-action-down-click"
                >
                  <ArrowDownIcon className="text-white" />
                </Button>
                <Button
                  id={"custom-add-field-action-right"}
                  onClick={() => {
                    handleAvailableFields(availableFieldsForMoving);
                    setSelectFieldsForMoving([]);
                    setAvailableFieldsForMoving([]);
                  }}
                  customStyle={`hidden sm:flex w-10 h-10 rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue ${
                    availableFieldsForMoving?.length > 0
                      ? "cursor-pointer"
                      : "opacity-40 cursor-default"
                  }`}
                  userEventName="reverseLookup-field-action-right-click"
                >
                  <ArrowRightIcon className="text-white" />
                </Button>
                <Button
                  id={"custom-remove-field-action-up"}
                  onClick={() => {
                    handleSelectedFields(selectFieldsForMoving);
                    setSelectFieldsForMoving([]);
                    setAvailableFieldsForMoving([]);
                  }}
                  customStyle={`sm:hidden w-10 h-10 rounded-md flex justify-center items-center  my-4 mx-2 bg-vryno-theme-light-blue ${
                    selectFieldsForMoving?.length > 0
                      ? "cursor-pointer"
                      : "opacity-40 cursor-default"
                  }`}
                  userEventName="reverseLookup-field-action-up-click"
                >
                  <ArrowUpIcon className="text-white" />
                </Button>
                <Button
                  id={"custom-remove-field-action-left"}
                  onClick={() => {
                    handleSelectedFields(selectFieldsForMoving);
                    setSelectFieldsForMoving([]);
                    setAvailableFieldsForMoving([]);
                  }}
                  customStyle={`hidden sm:flex w-10 h-10 rounded-md justify-center items-center my-4 mx-2 bg-vryno-theme-light-blue ${
                    selectFieldsForMoving?.length > 0
                      ? "cursor-pointer"
                      : "opacity-40 cursor-default"
                  }`}
                  userEventName="reverseLookup-field-action-left-click"
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
                          handleSelectedFieldsSelectedForMoving(field);
                          setAvailableFieldsForMoving([]);
                        }}
                        key={index}
                        className={`text-sm p-2 mb-1 flex items-center hover:bg-vryno-theme-blue-disable cursor-pointer ${
                          selectFieldsForMoving.findIndex(
                            (item) => item.uniqueName === field.uniqueName
                          ) === -1
                            ? ""
                            : "bg-vryno-theme-highlighter-blue"
                        }`}
                      >
                        {get(field.label, "en", "")}
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
            <div className="grid grid-cols-2 gap-x-28">
              <Button
                id="cancel-fields-selection"
                kind="back"
                onClick={() => onCancel()}
                disabled={loading}
                userEventName="reverseLookup-save:cancel-click"
              >
                {t("common:cancel")}
              </Button>
              <Button
                id="save-fields-selection"
                onClick={() => handleSubmit()}
                disabled={loading || selectedFieldsList?.length === 0}
                loading={loading}
                userEventName="reverseLookup-save:submit-click"
              >
                {t("common:save")}
              </Button>
            </div>
          </>
        </GenericFormModalContainer>
      )}
    </Formik>
  );
};
