import { gql } from "@apollo/client";

export const REMINDER_MUTATION = gql`
  mutation updateInAppNotification(
    $id: String!
    $input: UpdateInAppNotificationInput
  ) {
    updateInAppNotification(id: $id, input: $input) {
      code
      message
      status
      messageKey
      data {
        id
        createdBy
        createdAt
        userId
        isRead
        recordId
        metaData {
          message
        }
        serviceName
        serviceModuleName
      }
    }
  }
`;
