import { gql } from "@apollo/client";

export const MUTATION_UPDATE_MAIL_SYNCHING_JOB = gql`
  mutation updateMailSynchronizationJob(
    $id: String!
    $input: UpdateMailSynchronizationJobInput
  ) {
    updateMailSynchronizationJob(id: $id, input: $input) {
      code
      status
      message
      messageKey
      data {
        id
        status
        mailAccount
        recordStatus
        stats
      }
    }
  }
`;

export const MUTATION_CREATE_MAIL_SYNCHING_JOB = gql`
  mutation createMailSynchronizationJob(
    $input: CreateMailSynchronizationJobInput
  ) {
    createMailSynchronizationJob(input: $input) {
      code
      status
      message
      messageKey
      data {
        id
        status
        mailAccount
        recordStatus
        stats
      }
    }
  }
`;
