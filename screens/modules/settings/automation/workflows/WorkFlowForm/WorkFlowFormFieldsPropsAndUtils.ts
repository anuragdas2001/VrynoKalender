import { FormikState, FormikValues } from "formik";
import { User } from "../../../../../../models/Accounts";
import { ICustomField } from "../../../../../../models/ICustomField";
import {
  ICriteriaFilterRow,
  IUserPreference,
} from "../../../../../../models/shared";
import { ActionType } from "../../shared/actionTypes";

export const executeWhenOptions = [
  { value: "create", label: "Create" },
  { value: "create_update", label: "Create or Modify" },
  { value: "update", label: "Modify" },
  { value: "delete", label: "Delete" },
];

export const dateBeforeOptions: { value: string; label: string }[] = [
  { value: "daysbefore", label: "Day(s) before" },
  // { value: "weeksbefore", label: "Week(s) before" },
  // { value: "monthsbefore", label: "Month(s) before" },
  // { value: "yearsbefore", label: "Year(s) before" },
];

export const dateAfterOptions: { value: string; label: string }[] = [
  { value: "daysafter", label: "Day(s) after" },
  // { value: "weeksafter", label: "Week(s) after" },
  // { value: "monthsafter", label: "Month(s) after" },
  // { value: "yearsafter", label: "Year(s) after" },
];

export type WorkFlowFormFieldsProps = {
  editMode: boolean;
  savedExecuteWhen: boolean;
  savedConditionOn: boolean;
  modules: { value: string; label: string }[];
  fieldsList: ICustomField[];
  fieldsListLoading?: boolean;
  loading?: boolean;
  appName?: string;
  user: User | null;
  actionTypes: {
    label: string;
    value: string;
    groupBy?: string;
    onClick?: (item: ActionType) => void;
  }[];
  handleSave: () => void;
  setSavedExecuteWhen: (value: boolean) => void;
  setSavedConditionOn: (value: boolean) => void;
  handleConditionFormSave: () => void;
  handleExecuteWhenSave: () => void;
  conditionExecuteList: ICriteriaFilterRow[];
  conditionConditionList: ICriteriaFilterRow[];
  userPreferences: IUserPreference[];
  setConditionExecuteList: (value: ICriteriaFilterRow[]) => void;
  setConditionConditionList: (value: ICriteriaFilterRow[]) => void;
  resetForm: (
    nextState?: Partial<FormikState<FormikValues>> | undefined
  ) => void;
};
