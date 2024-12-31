import { gql } from "@apollo/client";

export const SAVE_FIELD_PERMISSION = gql`
  mutation createFieldPermission($input: CreateFieldPermissionInput!) {
    createFieldPermission(input: $input) {
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
      errors
    }
  }
`;

export const UPDATE_FIELD_PERMISSION = gql`
  mutation updateFieldPermission(
    $id: String!
    $input: UpdateFieldPermissionInput!
  ) {
    updateFieldPermission(id: $id, input: $input) {
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
      errors
    }
  }
`;
