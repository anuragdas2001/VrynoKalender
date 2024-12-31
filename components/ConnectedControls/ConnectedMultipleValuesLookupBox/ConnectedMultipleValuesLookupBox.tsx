import React from "react";
import FormMultipleValuesLookupBox from "../../TailwindControls/Form/MultipleValuesLookupBox/FormMultipleValuesLookupBox";
import { Option } from "../../TailwindControls/Form/MultipleValuesLookupBox/MultipleValuesLookupBoxProps";

export type ConnectedMultipleValuesLookupBoxProps = {
  name: string;
  label?: string;
  editMode?: boolean;
  type: string;
  dataTypeChanged?: boolean;
  onDataTypeChange?: () => void;
  appName?: string;
  modelName?: string;
  filters?: any;
  fields?: any;
  dataType?: string;
  pickupListError?: { error: boolean; fieldName: string }[];
  allowLookupColourHex?: boolean;
  editModeValues: Option[];
  setEditModeValues: (values: Option[]) => void;
  setPickupListError?: (value: { error: boolean; fieldName: string }) => void;
};

export const ConnectedMultipleValuesLookupBox = ({
  name,
  label,
  editMode,
  type,
  dataTypeChanged = false,
  onDataTypeChange = () => {},
  appName,
  modelName,
  filters = { type: "" },
  fields = [],
  dataType,
  pickupListError,
  allowLookupColourHex = false,
  editModeValues,
  setEditModeValues,
  setPickupListError = () => {},
}: ConnectedMultipleValuesLookupBoxProps) => {
  const [dropdownDataFetched, setDrpodownDataFetched] = React.useState<
    Array<any>
  >([]);

  return (
    <FormMultipleValuesLookupBox
      name={name}
      label={label}
      editMode={editMode}
      type={type}
      dataType={dataType}
      dataTypeChanged={dataTypeChanged}
      onDataTypeChange={() => onDataTypeChange()}
      externalOptions={dropdownDataFetched}
      pickupListError={pickupListError}
      setPickupListError={(value) => setPickupListError(value)}
      editModeValues={editModeValues}
      setEditModeValues={setEditModeValues}
      allowLookupColourHex={allowLookupColourHex}
    />
  );
};
