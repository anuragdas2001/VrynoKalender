import EditIcon from "remixicon-react/EditFillIcon";
import { ICustomField } from "../../../../../../../models/ICustomField";

export interface IEditInputDetails {
  visible: boolean;
  fieldData: null | any;
  id: string | undefined;
}

export const ShowFieldEdit = ({
  setEditInputDetails,
  dataToDisplay,
  field,
  showFieldEditInput,
  id,
}: {
  setEditInputDetails: (value: IEditInputDetails) => void;
  dataToDisplay: any;
  field: ICustomField | undefined;
  showFieldEditInput: boolean;
  id: string | undefined;
}) => {
  if (
    !showFieldEditInput ||
    !field ||
    // field?.isMasked ||
    field?.readOnly ||
    !field?.addInForm
  )
    return null;
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setEditInputDetails({
          visible: true,
          fieldData: dataToDisplay,
          id: id,
        });
      }}
      className="cursor-pointer hidden group-hover:block text-vryno-dropdown-icon"
      data-testid={`${field?.label?.en ?? field?.name}-inline-edit`}
    >
      <EditIcon size={16} />
    </span>
  );
};
