import { gql } from "@apollo/client";
import { GenericMutationResponse } from "../../models/shared";

export interface SaveVars<T> {
  id: string | null | undefined;
  modelName: String;
  saveInput: Partial<T>;
}

export interface SaveData<T> {
  save: GenericMutationResponse<T>;
}

export const SAVE_MUTATION = gql`
  mutation save($id: String, $modelName: String!, $saveInput: GenericData!) {
    save(id: $id, modelName: $modelName, saveInput: $saveInput) {
      status
      data
      code
      message
      messageKey
      errors
    }
  }
`;
