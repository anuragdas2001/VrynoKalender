import { gql } from "@apollo/client";
import {
  IProfileData,
  IModuleDataSharingRuleData,
} from "../../models/DataSharingModels";
import { GenericQueryResponse } from "../../models/shared";

export interface IFetchProfile {
  fetchProfile: GenericQueryResponse<IProfileData>;
}

export const PROFILE_DATA_QUERY = gql`
  query Profile($filters: [FetchFilter!]) {
    fetchProfile(filters: $filters) {
      code
      message
      status
      messageKey
      count
      data {
        id
        name
        parentId
        sharedPeers
        description
        recordStatus
        createdBy
        createdAt
        updatedBy
        updatedAt
      }
    }
  }
`;

export interface IFetchModuleDataSharingRule {
  fetchModuleDataSharingRule: GenericQueryResponse<IModuleDataSharingRuleData>;
}

export const MODULE_DATA_SHARING_RULE_QUERY = gql`
  query ModuleDataSharingRule($filters: [FetchFilter!]) {
    fetchModuleDataSharingRule(filters: $filters) {
      code
      message
      status
      messageKey
      count
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
    }
  }
`;
