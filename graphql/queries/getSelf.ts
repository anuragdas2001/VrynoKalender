import { gql } from "@apollo/client";

export const GET_SELF = gql`
  query {
    getSelf {
      status
      message
      messageKey
      data {
        id
        recordImage
      }
    }
  }
`;
