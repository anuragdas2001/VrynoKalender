import React from "react";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import { GenericFieldsSelector } from "./GenericFieldsSelector";

export type GenericAddCustomViewFieldFormProps = {
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
};

const GenericAddCustomViewFieldForm = ({
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
}: GenericAddCustomViewFieldFormProps) => {
  return (
    <GenericHeaderCardContainer
      cardHeading="Details"
      extended={true}
      marginBottom="mb-0"
    >
      <div
        className="grid gap-x-10"
        onKeyPress={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter")
            e.preventDefault();
        }}
      >
        <FormInputBox name="customViewName" label="Name" required={true} />
        <GenericFieldsSelector
          availableFieldsList={availableFieldsList}
          availableThresholdFieldsList={availableThresholdFieldsList}
          selectedFieldsList={selectedFieldsList}
          selectedThresholdFieldsList={selectedThresholdFieldsList}
          handleAvailableFieldSelection={handleAvailableFieldSelection}
          setSelectedThresholdFieldsList={setSelectedThresholdFieldsList}
          handleSelectedFieldSelection={handleSelectedFieldSelection}
          setAvailableThresholdFieldsList={setAvailableThresholdFieldsList}
          handleAvailableFields={handleAvailableFields}
          handleSelectedFields={handleSelectedFields}
        />
      </div>
    </GenericHeaderCardContainer>
  );
};

export default GenericAddCustomViewFieldForm;
