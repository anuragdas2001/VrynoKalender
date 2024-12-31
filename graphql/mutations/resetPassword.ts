import { gql } from "@apollo/client";

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $token: String!
    $password: String!
    $token1: String!
  ) {
    resetPassword(token: $token, password: $password, token1: $token1) {
      code
      messageKey
      status
    }
  }
`;
