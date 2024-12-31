import { AddEditViewType } from "../../../../models/shared";

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
}

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

export const getUserNameFormatted = (userValue: any): string => {
  if (userValue) {
    return `${userValue.firstName || ""} ${userValue.middleName || ""} ${
      userValue.lastName || ""
    }`;
  }
  return "";
};
