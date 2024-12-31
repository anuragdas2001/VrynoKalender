import React, { Dispatch, SetStateAction } from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import AddIcon from "remixicon-react/AddCircleFillIcon";

interface AddFieldProps {
  onAddClick: Dispatch<
    SetStateAction<{ visible: boolean; uniqueName: string | null }>
  >;
}

export const AddField = ({ onAddClick }: AddFieldProps) => {
  return (
    <Button
      id="add-field"
      buttonType="thin"
      kind="primary"
      onClick={() => {
        onAddClick({ visible: true, uniqueName: null });
      }}
      userEventName="open-add-field-modal-click"
    >
      <div className="flex gap-x-1">
        <AddIcon size={18} />
        <>{`Add Field`}</>
      </div>
    </Button>
  );
};
