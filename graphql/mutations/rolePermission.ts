import { gql } from "@apollo/client";
import { GenericMutationResponse } from "../../models/shared";
import { IRolePermission } from "../../models/Accounts";

export interface CreateRolePermissionVars {
  rolePermission: Partial<IRolePermission>;
}

export interface CreateRolePermissionData {
  setUpRolePermissions: GenericMutationResponse<IRolePermission>;
}

export const CREATE_ROLE_PERMISSION_MUTATION = gql`
  mutation setUpRolePermissions($roleKey: String!, $copyFrom: String!) {
    setUpRolePermissions(roleKey: $roleKey, copyFrom: $copyFrom) {
      status
      data {
        id
        permissionKey
      }
      code
      message
      messageKey
    }
  }
`;
