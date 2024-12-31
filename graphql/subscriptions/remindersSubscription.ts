import { gql } from "@apollo/client";

export interface RemindersVars {
  serviceName: string;
  modelName: string;
  text: string;
  [key: string]: any;
}

export const IN_APP_NOTIFICATION_SUBSCRIPTION = gql`
  subscription SubscribeToInAppNotification($userId: String!) {
    subscribeToInAppNotification(userId: $userId) {
      notification {
        id
        serviceName
        serviceModuleName
        userId
        instanceId
        isRead
        metaData {
          recipients
          errorRecordIds
          moduleName
          message
          subject
        }
        recordId
        createdAt
      }
    }
  }
`;

export const PING_PONG_SUBSCRIPTION = gql`
  subscription ping {
    ping
  }
`;
