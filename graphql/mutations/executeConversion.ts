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

export const EXECUTE_CONVERSION = gql`
  mutation executeConversion(
    $modelName: String!
    $executeConversionInput: ExecuteConversionInput!
  ) {
    executeConversion(
      modelName: $modelName
      executeConversionInput: $executeConversionInput
    ) {
      status
      data
      code
      message
      messageKey
      errors
      __typename
    }
  }
`;
