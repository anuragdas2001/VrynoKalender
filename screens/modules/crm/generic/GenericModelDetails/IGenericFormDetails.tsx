import { AddEditViewType } from "../../../../../models/shared";

export const emptyModalValues = {
  visible: false,
  formDetails: {
    type: null,
    parentId: "",
    parentModelName: "",
    aliasName: "",
    id: "",
    modelName: "",
    appName: "",
  },
};

export interface IGenericFormDetails {
  type: AddEditViewType | null;
  parentId?: string;
  parentModelName?: string;
  aliasName?: string;
  id: string | null;
  modelName: string;
  appName: string;
  quickCreate?: boolean;
}
export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}
export type GeneralVisibilityProps = {
  visible: boolean;
  id: string | null;
};
