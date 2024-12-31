import { gql } from "@apollo/client";
import { IInstance } from "../../models/Accounts";
import { GenericMutationResponse } from "../../models/shared";

export interface CreateInstanceVars {
  instance: Partial<IInstance>;
}

export interface CreateInstanceData {
  createInstance: GenericMutationResponse<IInstance>;
}

export const CREATE_INSTANCE_MUTATION = gql`
  mutation CreateInstance($instance: InstanceCreateInput!) {
    createInstance(instance: $instance) {
      status
      data {
        id
        name
        subdomain
        region
        description
        isSample
        instanceAdmins
        created_by
        companyId
      }
      code
      message
      messageKey
    }
  }
`;

export interface UpdateInstanceVars {
  id: string;
  instance: Partial<IInstance>;
}

export interface UpdateInstanceData {
  updateInstance: GenericMutationResponse<IInstance>;
}

export const UPDATE_INSTANCE_MUTATION = gql`
  mutation UpdateInstance($id: String!, $instance: InstanceUpdateInput!) {
    updateInstance(id: $id, instance: $instance) {
      status
      message
      messageKey
      data {
        id
        name
        subdomain
        region
        description
        instanceAdmins
        isSample
        created_by
        companyId
      }
    }
  }
`;

export interface DeleteInstanceVars {
  id: string;
}

export interface DeleteInstanceData {
  deleteInstance: GenericMutationResponse<{ id: string }>;
}

export const DELETE_INSTANCE_MUTATION = gql`
  mutation DeleteInstance($id: String!) {
    deleteInstance(id: $id) {
      status
      code
      message
      messageKey
      data {
        id
      }
    }
  }
`;

export const DELETE_SAMPLE_DATA_MUTATION = gql`
  mutation DeleteSampleData {
    deleteSampleData {
      status
      code
      message
      messageKey
    }
  }
`;
