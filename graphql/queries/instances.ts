import { gql } from "@apollo/client";
import { IInstance } from "../../models/Accounts";
import { GenericQueryResponse } from "../../models/shared";

export const INSTANCE_DETAIL_QUERY = gql`
  query instance($id: String!) {
    instance(id: $id) {
      status
      code
      message
      data {
        id
        name
        region
        description
        subdomain
        instanceAdmins
        isSample
        created_by
        companyId
      }
    }
  }
`;

export interface InstanceListData {
  instances: GenericQueryResponse<IInstance>;
}

export const INSTANCE_LIST_QUERY = gql`
  query instances($pageNumber: Int) {
    instances(pageNumber: $pageNumber) {
      status
      code
      message
      count
      data {
        id
        name
        region
        instanceAdmins
        description
        subdomain
        status
        isSample
        created_by
        companyId
        logo
      }
    }
  }
`;

export interface InstanceSubdomainData {
  getSubdomainInstance: IInstance;
}

export const INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY = gql`
  query fetchSubdomainInstance($subdomain: String!) {
    getSubdomainInstance(subdomain: $subdomain) {
      status
      code
      message
      messageKey
      data {
        id
        name
        region
        mfaEnabled
        instanceAdmins
        description
        subdomain
        status
        isSample
        created_by
        companyId
        logo
      }
    }
  }
`;
