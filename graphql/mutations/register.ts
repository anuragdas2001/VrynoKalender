import { gql } from "@apollo/client";
import { GenericMutationResponse } from "../../models/shared";

export interface RegisterData<T> {
  register: GenericMutationResponse<T>;
}

export const REGISTRATION_MUTATION = gql`
  mutation Register($registerReq: RegisterInput!) {
    register(registerReq: $registerReq) {
      message
      status
      messageKey
    }
  }
`;
