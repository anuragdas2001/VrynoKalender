import { gql } from "@apollo/client";

export const FIELD_PERMISSION_DATA_QUERY = gql`
  query FieldPermission($filters: [FetchFilter!], $pageNumber: Int) {
    fetchFieldPermission(filters: $filters, pageNumber: $pageNumber) {
      code
      message
      status
      messageKey
      data {
        id
        recordStatus
        createdBy
        createdAt
        updatedBy
        updatedAt
        moduleUniqueName
        moduleName
        fieldName
        fieldUniqueName
        permission
        priority
        instanceId
        role
        description
      }
    }
  }
`;
