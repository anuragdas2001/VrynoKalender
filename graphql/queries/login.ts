import { gql } from "@apollo/client";

export const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!, $token: String!) {
    login(email: $email, password: $password, token: $token) {
      accessToken
      message
      messageKey
      status
    }
  }
`;

export const GENERATE_TOKEN_QUERY = gql`
  query GenerateToken {
    generateToken {
      accessToken
      message
      messageKey
      status
    }
  }
`;
export const VERIFY_EMAIL = gql`
  query VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      status
      message
      messageKey
      code
    }
  }
`;
export const SEND_EMAIL_VERIFICATION_QUERY = gql`
  query sendEmailVerificationLink($token: String!) {
    sendEmailVerificationLink(token: $token) {
      status
      message
      messageKey
      code
    }
  }
`;
