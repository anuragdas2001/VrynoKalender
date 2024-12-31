import { gql } from "@apollo/client";
import { GenericQueryResponse, IInstanceUser } from "../../models/shared";

export interface InstanceUserListData {
  instanceUsers: GenericQueryResponse<IInstanceUser>;
}

export const INSTANCE_USERS_LIST_QUERY = gql`
  query InstanceUsers {
    InstanceUsers {
      status
      code
      message
      data {
        id
        firstName
        lastName
        phoneNumber
        email
      }
    }
  }
`;
