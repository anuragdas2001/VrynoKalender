import { gql } from "@apollo/client";

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!, $token: String!) {
    forgotPassword(email: $email, token: $token) {
      code
      messageKey
      status
    }
  }
`;
