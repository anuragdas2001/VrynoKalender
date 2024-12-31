import React from "react";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { AddEditViewType } from "../../../../models/shared";
import { ICustomField } from "../../../../models/ICustomField";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";

export type SearchBoxProps<T extends BasicLookupType> = {
  name: string;
  appName: string;
  modelName: string;
  searchBy: Array<string>;
  fieldDisplayExpression: string[];
  field?: ICustomField; //
  placeholder?: string;
  label?: string;
  editMode?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  rightIconClick?: () => void;
  autoFocus?: boolean;
  labelLocation?: SupportedLabelLocations;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  defaultOnSearchIconClick?: boolean;
  handleItemSelect?: (items: ISearchQuestData[]) => void;
  value?: string;
  isValid?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  usedInForm?: boolean;
  allowMargin?: boolean;
  offsetValue?: number;
  pageSize?: number;
  setValuesForFields?: { fetchField: string; setValueForField: string }[];
  onDataLoadButtonComponent?: React.ReactElement;
  externalExpressionToCalculateValue?: string;
  formResetted?: boolean;
  useNewAddedRecordInForm?: boolean;
  showModelNameInSearch?: boolean;
  overflow?: boolean;
  paddingInPixelForInputBox?: number;
  setSearchedValue?: (value: string) => void;
  handleNewAddedRecord?: (data: any) => void;
  rejectRequired?: boolean;
  addClear?: boolean;
  retainDefaultValues?: boolean;
  parentModelName?: string;
  fieldIndex?: number;
  additionalFieldName?: string;
  autoOpenSearchScreenContainer?: boolean;
  helpText?: React.ReactElement;
  setCurrentFormLayer?: (value: boolean) => void;
  stopRecordLookupAutoReset?: boolean;
  handleSetValuesForFields?: (
    items: {
      fetchField: string;
      setValueForField: string;
      value: any;
    }[]
  ) => void;
  disableGlobalSearchIcon?: boolean;
  dataTestId?: string;
  hideValidationMessages?: boolean;
  resetComponentLoadIndex?: boolean;
  setResetComponentLoadIndex?: (value: boolean) => void;
};

export type BasicLookupType = {
  id: string;
};
export type SearchByOption = {
  label: string;
  value: string;
  icon: React.ReactElement;
};
export interface IGenericFormDetails {
  type: AddEditViewType | null;
  id: string | null;
  modelName: string;
  appName: string;
  quickCreate: boolean;
  aliasName?: string;
}
export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}
