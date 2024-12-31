import { gql } from "@apollo/client";

export const DELETE_LINKED_ACCOUNT = gql`
  mutation deleteLinkedAccount($id: String!) {
    deleteLinkedAccount(id: $id) {
      code
      status
      message
      messageKey
      data {
        id
      }
      errors
    }
  }
`;

export const DELETE_MAIL_SYNCHING_JOB = gql`
  mutation deleteMailSynchronizationJob($id: String!) {
    deleteMailSynchronizationJob(id: $id) {
      code
      status
      message
      messageKey
      data {
        id
        status
        mailAccount
        recordStatus
      }
    }
  }
`;
