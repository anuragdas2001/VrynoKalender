import { gql } from "@apollo/client";
import { GenericQueryResponse } from "../../models/shared";

export interface ReminderData<T> {
  reminder: GenericQueryResponse<T>;
}

export const REMINDER_QUERY = gql`
  query fetchInAppNotification(
    $pageNumber: Int
    $recordsPerPage: Int
    $filters: [FetchFilter]
  ) {
    fetchInAppNotification(
      pageNumber: $pageNumber
      recordsPerPage: $recordsPerPage
      filters: $filters
    ) {
      code
      count
      message
      status
      messageKey
      data {
        id
        isRead
        metaData {
          message
          subject
          moduleName
          errorRecordIds
        }
        serviceModuleName
        serviceName
        recordId
        userId
        createdBy
        createdAt
      }
    }
  }
`;
