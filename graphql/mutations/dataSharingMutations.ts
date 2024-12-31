import { gql } from "@apollo/client";
import { GenericMutationResponse } from "../../models/shared";
import { IModuleDataSharingRuleData } from "../../models/DataSharingModels";

export const SAVE_PROFILE = gql`
  mutation createProfile($input: CreateProfileInput!) {
    createProfile(input: $input) {
      code
      message
      status
      messageKey
      data {
        id
        name
        parentId
        sharedPeers
        description
        recordStatus
        createdAt
      }
      errors
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($id: String!, $input: UpdateProfileInput!) {
    updateProfile(id: $id, input: $input) {
      code
      message
      status
      messageKey
      data {
        id
        name
        parentId
        sharedPeers
        description
        recordStatus
        createdAt
      }
      errors
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation deleteProfile($id: String!) {
    deleteProfile(id: $id) {
      code
      message
      status
      messageKey
      data {
        id
        name
        parentId
        sharedPeers
        description
        recordStatus
        createdAt
      }
      errors
    }
  }
`;

export interface ICreateModuleDataSharingRuleResponse {
  createModuleDataSharingRule: GenericMutationResponse<IModuleDataSharingRuleData>;
}

export const SAVE_MODULE_DATA_SHARING_RULE = gql`
  mutation createModuleDataSharingRule(
    $input: CreateModuleDataSharingRuleInput!
  ) {
    createModuleDataSharingRule(input: $input) {
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
        moduleName
        serviceName
        modulePermission
        instanceId
        description
      }
      errors
    }
  }
`;

export interface IUpdateModuleDataSharingRuleResponse {
  updateModuleDataSharingRule: GenericMutationResponse<IModuleDataSharingRuleData>;
}

export const UPDATE_MODULE_DATA_SHARING_RULE = gql`
  mutation updateModuleDataSharingRule(
    $id: String!
    $input: UpdateModuleDataSharingRuleInput!
  ) {
    updateModuleDataSharingRule(id: $id, input: $input) {
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
        moduleName
        serviceName
        modulePermission
        instanceId
        description
      }
      errors
    }
  }
`;

export const DELETE_MODULE_DATA_SHARING_RULE = gql`
  mutation deleteModuleDataSharingRule($id: String!) {
    deleteModuleDataSharingRule(id: $id) {
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
        moduleName
        serviceName
        modulePermission
        instanceId
        description
      }
      errors
    }
  }
`;
