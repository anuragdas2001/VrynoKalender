import { IUserPreference } from "../../../../models/shared";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { IGenericFormDetails } from "../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";

export type JSONDateTimePickerProps = {
  name: string;
  placeholder?: string;
  label?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  labelLocation?: SupportedLabelLocations;
  value?: string | Date;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  editMode?: boolean;
  type?: "datetime" | "date" | "time";
  applyMargin?: boolean;
  allowMargin?: boolean;
  formResetted?: boolean;
  externalExpressionToCalculateValue?: string;
  modelName?: string;
  formDetails?: IGenericFormDetails;
  rejectRequired?: boolean;
  externalError?: string;
  addClear?: boolean;
  userPreferences?: IUserPreference;
  paddingInPixelForInputBox?: number;
  timezone?: string;
  rightIconClick?: () => void;
  onBlur?: () => void;
  onChange?: (
    date: Date | null,
    event?: React.SyntheticEvent<any> | undefined
  ) => void;
  user?: User;
  dropdownFields?: ICustomField[];
  dataTestId?: string;
  hideValidationMessages?: boolean;
};
